import {  Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { MenuItem } from 'primeng/api';
import { MenuItemContent } from 'primeng/menu';
import { Router } from '@angular/router';
import { EvenementService } from '../../services/evenement.service';
import { sharedEvenementDataService } from '../../services/sharedEvenementData.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Evenement, evenementValidation, evenementFilters, TypeOrgane, typeAccessOrgane, evenementView, evenementListFilters } from '../../models/evenement';
import { DatePipe, formatDate } from '@angular/common';
import { Societe } from 'src/app/modules/hierarchy/model/hierarchy';
import { HierarchyService } from 'src/app/modules/hierarchy/services/hierarchy.service';
import { EventBusService } from 'src/app/shared/services/event-bus.service';


interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-list-evenements',
  templateUrl: './list-evenements.component.html',
  styleUrls: ['./list-evenements.component.scss', '../../shared/sharedEvenements_style.scss'],
  providers: [MessageService,ConfirmationService]

})
export class ListEvenementsComponent implements OnInit, OnDestroy {

  items: MenuItem[] = [] ;

  activeItem: MenuItem = {};

  routeState : any;
  //isDataLoaded : boolean = false;


  today: string = '';
  societes : any[] = [];
  userSocieteId : number = 0;
  type_organes : any[] = [];
  type_evenements : any[] =[];
  remuneration : any[] = [{label : 'Rémunéré', value : 'true'},
                            {label : 'Non rémunéré', value : 'false'}
                          ];

  evenementValidation :any = evenementValidation;
  //evenementFilters:any= {...evenementFilters};
  evenementFilters:any= evenementFilters;
  evenementView:any = evenementView;

  events: any[] = [];
  evenements : Evenement[] =[];

  nombreResultatEvs:number = 0;

  constructor( private evenementService: EvenementService, public sharedDataEvService : sharedEvenementDataService, private hierarchyService : HierarchyService,private eventBusService : EventBusService, private messageService: MessageService, private confirmationService : ConfirmationService,private router: Router,private location: Location, private datepipe:DatePipe ) {


     //verification privilèges access

                if(this.eventBusService.hasPrivilges(['evenement.list']))
                {
                 //Accés a tous les évènements (tous les sociétés ou seulement sa société)
                 this.evenementFilters.typeAcces = 'all';

                }else if(this.eventBusService.hasPrivilges(['evenement.listOwn'])){
                 //Accès à ses propres événements
                 this.evenementFilters.typeAcces = 'own';

                }else{
                 // pas d'accéss
                 this.location.back();
                }

                //-------------Traitement affichage toast from others components---------------------
                if(this.router.getCurrentNavigation()?.extras.state && !(this.router.getCurrentNavigation()?.trigger ==='popstate')) {

                 this.routeState = this.router.getCurrentNavigation()?.extras.state;

                 if (this.routeState){

                   //console.log(this.routeState);
                   if(this.routeState.type == 'message'){
                     setTimeout(() => {
                       this.showMessageToast(this.routeState.severity, this.routeState.summary ,this.routeState.detail);
                     },300);

                   }
                 }

               }
             //************************************************************************************************************** */
             //************************************Init data *********************************** ****************************/
               this.items = [
                 { label: 'Calendrier', icon: 'pi pi-fw pi-calendar' },
                 { label: 'Liste', icon: 'pi pi-fw pi-home' },

             ];

              let typeAccess : typeAccessOrgane = this.evenementFilters.typeAcces ==='all' ? "allSocietes" : "membre";
              this.sharedDataEvService.loadSharedDataEvenement(typeAccess);
              //Initiliser shared data type_organes et types_évènements
              //this.hierarchyService.getAllSociete().subscribe((data:Societe[]) => { this.societes = data; });
              this.sharedDataEvService.typesOrganes.subscribe(data => { this.type_organes = data;  });
              this.sharedDataEvService.societes.subscribe(data => {this.societes = data;} );
              this.sharedDataEvService.typesEvenement.subscribe(data => {this.type_evenements= data;  });
              this.sharedDataEvService.today.subscribe(data => {this.today = data;     });

              //activer le panel calendrier ou liste
              this.activeItem = (this.evenementView.showCalendar === true) ? this.items[0] : this.items[1];
              this.loadChangeTabsPanelItems();

              this.listSelectedFilters = [...this.evenementView.listFilters];
              console.log("listSelectedFilters");
              console.log(this.listSelectedFilters);
              console.log("this.evenementView");
              console.log(this.evenementView);

             //ne plus afficher les évènements prévisionnels la première fois
             this.evenementFilters.isPrevisionnel = 'false';

            //test create privileges in organes
            this.hasPrivilegeCreateInOrgane();


  }


  onChangeTypeAccess(event:any){

    //recharger la liste évènements a afficher
    this.loadEvenements();
  }

  ngOnInit() {

  }

  ngOnDestroy(): void {
    this.evenementView.listFilters = [... this.listSelectedFilters];

  }


  onActiveItemChange(event: MenuItem) {


    this.activeItem = event;
    if(this.activeItem)
    {
      this.loadChangeTabsPanelItems();
    }
  }

  loadChangeTabsPanelItems(){

    if(this.activeItem.label ==='Calendrier'){
      this.evenementFilters.etat_evenement = '';
      this.evenementView.showCalendar = true;

    }else{
      this.evenementView.showCalendar = false;

      this.evenementFilters.etat_evenement = 'a venir';
      this.evenementFilters.dateFrom = '';
      this.evenementFilters.dateTo = '';
      //if(this.evenementView.applyFilters === true)
        this.filtrer();
     }

  }


  hasCreateAccess : boolean = false;
  hasPrivilegeCreateInOrgane(){

    this.sharedDataEvService.hasPrivilegeCreateInOrgane().subscribe(
      (data) => { this.hasCreateAccess = true;},
      (error) => { this.hasCreateAccess = false;}
    );
  }

  ajouterEvenement(){


    this.router.navigate(['/evenements/add']);

  }

  loadedEvenements :boolean = false;
  loadEvenements() {

    setTimeout(() => {

            this.loadedEvenements = false;
            // Chargement des évènements  a la demande
            this.evenementService.getEvenements(this.evenementFilters, this.pageEvs).subscribe(

            (data) => {
                if(data){
                  this.events = [];
                  let total = data.total;
                  let list = data.list;
                  if(Array.isArray(list) )
                  {
                    list.forEach( (evenement:any)  => {

                      /*  evenement.seances.forEach((seance:any) => {
                        // console.log(evenement);
                        evenement.selectedSeance = seance; */
                        this.events = [...this.events, { ...this.getEventFromEvenement(evenement) }];
                      /* }) */

                      });

                  }else{
                     /*   list.seances.forEach((seance:any) => {
                        // console.log(evenement);
                        list.selectedSeance = seance; */

                        this.events = [...this.events, { ...this.getEventFromEvenement(list) }];
                    /* }) */
                  }


                  this.totalRecords = total;
                  this.loadedEvenements=true;

                }
                else{
                    console.log( "Une erreur inattendue s'est produite!");
                    this.loadedEvenements=true;
                }
            },
            (error) => {

                //Erreur lors du chargement des évènements
                this.loadedEvenements=true;
                this.events= [];
                console.log(error);
              }
            );


     }, 100);


}
//********************* Group avatar ********************************************* */

/* getAvatarMembreLabel(nom:any, prenom:any){

  let label = "";
  if(nom && nom.length>0)
  {
    label = label + nom[0].toUpperCase();
  }
  if(prenom && prenom.length > 0){
    label = label + prenom[0].toUpperCase() ;
  }

  return label;

} */


//***********************Pagination *************************************************
totalRecords :number = 120;
pageEvs : PageEvent = {
  first: 0,
  rows: 10,
  page: 0,
  pageCount: 12
}

onPageChange(event: PageEvent) {
  this.pageEvs = event;


  this.loadEvenements();
}


//************************* Formatage de l'évènemet ******************************************

getEventFromEvenement(evenement : any)
{
    // Transformation du model évènement vers model event du calendrier

    try{

    evenement.numero = evenement.numero.replace('-','/');
    let typeOrgane =  this.type_organes.find((to) => {return to.id === evenement.typeOrganeId});
    let organe =  typeOrgane?.organes.find((to:any) => {return to.id === evenement.organeId});
    let typeEvenement = this.type_evenements.find((te) => {return te.value.id === evenement.typeEvenementId});
    let abrvTypeOrgane = typeOrgane?.abreviation;
    if(evenement.listeMembres!==null && evenement.listeMembres.length>0){
      evenement.listeMembres.forEach((membre:any) => {
         membre.initiales = this.sharedDataEvService.getAvatarMembreLabel(membre.membre_nom, membre.membre_prenom );
        });
    }

    evenement.currentSeance = evenement.seances[evenement.seances.length-1];
    evenement.dateDebut = formatDate(evenement.currentSeance.dateDebut, 'yyyy-MM-dd HH:mm:ss', 'en-us');
    evenement.dateFin = formatDate(evenement.currentSeance.dateFin, 'yyyy-MM-dd HH:mm:ss', 'en-us');

    let colorEtat = this.sharedDataEvService.getColorEtatEvenement(evenement.etat);
    let event = {...evenement, start : evenement.dateDebut, end : evenement.dateFin,
                                   title : abrvTypeOrgane + ' - '+ evenement.titre,
                                   typeOrgane : typeOrgane,
                                   typeEvenement : typeEvenement,
                                   organe : organe,
                                   /* backgroundColor : typeOrgane?.backgroundColor,
                                   borderColor : typeOrgane?.borderColor ,
                                   textColor : typeOrgane?.textColor, */
                                   backgroundColor : colorEtat,
                                   borderColor : colorEtat ,
                                   textColor : 'white',
                                   display : 'block' };

       return event;


    }catch(ex){

        console.error(ex);
        return null;

    }

}

//********************************************************************************************************************* */
//**************************Formattage donnés liste évènement ********************************************************* */

getFormattedDateEvent(from : any, to:any){



  let dateFrom = this.datepipe.transform(from, 'dd MMMM yyyy');
  let dateTo =   this.datepipe.transform(to, 'dd MMMM yyyy');
  let timeFrom = this.datepipe.transform(from, 'HH:mm');
  let timeTo =   this.datepipe.transform(to, 'HH:mm');


  if(dateFrom === dateTo){
     if(timeFrom === timeTo)
      return dateFrom + ' | ' + timeFrom;
     else
     return dateFrom + ' | ' + timeFrom + ' -' + timeTo;
  }else{

    return dateFrom + ' - '+ dateTo + ' | '+ timeFrom;
  }

}


//***************************************************************************************************** */
//***********************Filtrer par états évènements ************************************************************* */
//*********************************************************************************************************** */
//pi pi-fw pi-eject
filtreEtatItems: MenuItem[]  = [
  {
      label: 'A venir',
      icon: 'pi pi-fw pi-angle-double-down',
      title : "Afficher les évènements en planification et publiés",
      command : () => this.etatEvenementChange('a venir'),
      styleClass : 'active',
  },
  { separator: true }
  ,{
      label: 'En cours',
      icon: 'pi pi-fw pi-sync',
      command : () => this.etatEvenementChange('en cours'),

  },
  { separator: true }
  ,{
      label: 'Complétés',
      icon: 'pi pi-fw pi-check-square',
      command : () => this.etatEvenementChange('completer'),
  },
  { separator: true }
  ,{
      label: 'Annulés',
      icon: 'pi pi-fw pi-times-circle',
      command : () => this.etatEvenementChange('annuler'),

  },


];;

etatEvenementChange(etat:string) {

  if(etat !== this.evenementFilters.etat_evenement){
    this.evenementFilters.etat_evenement = etat;
    this.loadEvenements();
  }


}

activeMenu(event:any) {

  //console.log(event.target.classList);
  let node;
  if (event.target.classList.contains("p-submenu-header") == true) {
    node = "submenu";
  } else if (event.target.tagName === "SPAN") {
    node = event.target.parentNode.parentNode;
  } else {
    node = event.target.parentNode;
  }
  //console.log(node);
  if (node != "submenu") {
    let menuitem = document.getElementsByClassName("p-menuitem");
    for (let i = 0; i < menuitem.length; i++) {
      menuitem[i].classList.remove("active");
    }
    node.classList.add("active");
  }
  }




//************************************************************** */
//***********************Load or not prévisionnels ********************* */
//*************************************************************** */
//Traite le chargement des filtre pour le calendrier
calendarChildReload : boolean = false;

onChangeChkbPrevisionnel(event: any){

  event.checked.length>0  ? this.evenementFilters.isPrevisionnel ='' :  this.evenementFilters.isPrevisionnel = 'false';
  this.activeItem.label ==='Liste' ? this.loadEvenements() :  (this.calendarChildReload = !this.calendarChildReload);
}

//************************************************************** */
//******************Filters************************************* */
//*************************************************************** */
selected_typeorgane : any;
selected_organe : any;
selected_societe : any;
selected_typeEvenement : any;
selected_remuneration :any;
selected_periodicite :any;
selectedDateFrom : any;
selectedDateTo : any;
selectedSearch : any;

listSelectedFilters : any[] = [];
firstLoadFilters:boolean = true;
sidebarVisible:boolean = false;


toggleFilters(){
this.sidebarVisible = true;
}

filtrer(){

this.sidebarVisible = false;
if(!this.firstLoadFilters){
  this.listSelectedFilters = [];
  if(this.selected_societe !=null) this.listSelectedFilters.push({label : this.selected_societe.raisonSocial, value : 'selected_societe', id : this.selected_societe.id });
  if(this.selected_typeorgane !=null) this.listSelectedFilters.push({label : this.selected_typeorgane.designation , value : 'selected_typeorgane', id : this.selected_typeorgane.id });
  if(this.selected_organe !=null) this.listSelectedFilters.push({label : this.selected_organe.titre  , value : 'selected_organe', id : this.selected_organe.id});
  if(this.selected_typeEvenement !=null) this.listSelectedFilters.push({label : this.selected_typeEvenement.designation , value : 'selected_typeEvenement', id : this.selected_typeEvenement.id});
  if(this.selected_remuneration !=null) this.listSelectedFilters.push({label : this.selected_remuneration.label , value : 'selected_remuneration', isRemunerer : this.selected_remuneration.value  });
  if(this.selected_periodicite !=null) this.listSelectedFilters.push({label : this.selected_periodicite , value : 'selected_periodicite'});
  if(this.selectedDateFrom !=null) this.listSelectedFilters.push({label : "Du : " + formatDate(this.selectedDateFrom , 'dd/MM/yyyy', 'en-us') , value : 'selectedDateFrom'});
  if(this.selectedDateTo !=null) this.listSelectedFilters.push({label : "Au : " + formatDate(this.selectedDateTo , 'dd/MM/yyyy', 'en-us') , value : 'selectedDateTo'});
  if(this.selectedSearch !=='' && this.selectedSearch != null ) this.listSelectedFilters.push({label : "Mots clés : " + this.selectedSearch , value : 'selectedSearch'});
}

if(this.listSelectedFilters.length>0 && this.evenementView.applyFilters === true )
     this.chargerListeFiltres();

   this.activeItem.label ==='Liste' ? this.loadEvenements() :  (this.calendarChildReload = !this.calendarChildReload);
}

clearFilter(){
this.selected_typeorgane = null;
this.selected_organe = null;
this.selected_societe = null;
this.selected_typeEvenement = null;
this.selected_remuneration = null;
this.selected_periodicite = null;
this.selectedDateFrom = null;
this.selectedDateTo = null;
this.selectedSearch = '';
this.listSelectedFilters = [];
this.chargerListeFiltres();
this.activeItem.label ==='Liste' ? this.loadEvenements() :  (this.calendarChildReload = !this.calendarChildReload);

}

removeChipFilter(itemFilter : any){

  //this.listSelectedFilters = this.listSelectedFilters.find(se => {return se.value !== itemFilter.value} );
  //console.log(this.listSelectedFilters);
  this.listSelectedFilters.forEach((value,index)=>{
            if(value.value === itemFilter.value) {
               this.listSelectedFilters.splice(index,1);
               this.clearChipFilter(value.value);

            }
   });
   //console.log(this.listSelectedFilters);
   this.chargerListeFiltres();
   this.activeItem.label ==='Liste' ? this.loadEvenements() :  (this.calendarChildReload = !this.calendarChildReload);
   //console.log(this.listSelectedFilters);
}

clearChipFilter(value:any){

  switch(value) {
    case 'selected_societe' :
      this.selected_societe = null;
      break;
    case 'selected_typeorgane' :
      this.selected_typeorgane = null; ;
      break;
    case 'selected_organe' :
      this.selected_organe = null;
      break;
    case 'selected_typeEvenement':
      this.selected_typeEvenement = null;
      break;
    case 'selected_remuneration':
        this.selected_remuneration = null;
        break;
    case 'selectedDateFrom' :
      this.selectedDateFrom = null;
      break;

    case 'selectedDateTo' :
      this.selectedDateTo = null;
      break;
    case 'selected_periodicite' :
      this.selected_periodicite = null;
      break;
    case 'selectedSearch' :
      this.selectedSearch = '';
      break;


  }

}

chargerListeFiltres(){

  this.evenementFilters.societeid=  0;
  this.evenementFilters.type_organeid =0;
  this.evenementFilters.organeid = 0;
  this.evenementFilters.dateFrom = '';
  this.evenementFilters.dateTo = '';
  this.evenementFilters.type_evenementid = 0;
  this.evenementFilters.isRemunerer ="";
  this.evenementFilters.isPeriodique = "";
  this.evenementFilters.keyword = "";

//chargement des filtres
if(this.listSelectedFilters.length>0){

  this.listSelectedFilters.forEach((value,index)=>{
    switch(value.value) {
      case 'selected_societe' :
        this.evenementFilters.societeid = value.id ;
        break;
      case 'selected_typeorgane' :
        this.evenementFilters.type_organeid = value.id ;
        break;
      case 'selected_organe' :
        this.evenementFilters.organeid = value.id ;
        break;
      case 'selected_typeEvenement':
        this.evenementFilters.type_evenementid = value.id ;
        break;
      case 'selected_remuneration':
        this.evenementFilters.isRemunerer = value.isRemunerer ;
        break;
      case 'selectedDateFrom' :
        let datefl = (value.label.split(":")[1].trim()).split('/');
        let newDatefl = datefl[1] + '/' +datefl[0] +'/' +datefl[2];
        this.evenementFilters.dateFrom = formatDate(new Date(newDatefl), 'yyyy-MM-dd HH:mm:ss', 'en-us');
        break;
      case 'selectedDateTo' :
        let dateT = (value.label.split(":")[1].trim()).split('/');
        let newDateT = dateT[1] + '/' +dateT[0] +'/' +dateT[2];
        this.evenementFilters.dateTo = formatDate(new Date(newDateT), 'yyyy-MM-dd HH:mm:ss', 'en-us');
        break;
      case 'selected_periodicite' :
         this.evenementFilters.isPeriodique = value.label;
        break;
      case 'selectedSearch' :
        this.evenementFilters.keyword = value.label.split(":")[1].trim();
        break;


    }
  });
 }else
   this.evenementView.applyFilters=false;


}



  // Traitement des services messages

showErrorToast(summary:string, detail:string){

  this.showMessageToast('error', summary, detail);

}
showSuccessToast(summary:string, detail:string){

  this.showMessageToast('success', summary, detail);

}
showMessageToast(severity:string, summary:string, detail:string ){

  this.messageService.add({ key: 'tst', severity: severity , summary: summary , detail: detail });

}

}
