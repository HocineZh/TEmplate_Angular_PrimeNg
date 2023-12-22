import { DocumentService } from './../../../document/services/document.service';
import { ConvocationService } from './../../services/convocation.service';
import { Component, OnDestroy, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Evenement,  evenementValidation, typeAccessOrgane } from '../../models/evenement';
import { Location } from '@angular/common';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { EvenementService } from '../../services/evenement.service';
import { EvenementPrevisionnelService } from 'src/app/modules/programme_annuel/services/evenementPrevisionnel.service';
import { sharedEvenementDataService } from '../../services/sharedEvenementData.service';
import { Router, ActivatedRoute  } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { PointOrdreService } from '../../services/pointOrdre.service';
import { BehaviorSubject } from 'rxjs';
import { ListEvenementsComponent } from '../list-evenements/list-evenements.component';
import { EventBusService } from 'src/app/shared/services/event-bus.service';
import { ApiResponse } from 'src/app/shared/models/shared';
import { DateService } from 'src/app/shared/services/date.service';
import { FileResponse } from 'src/app/modules/membres/model/membre';
import { FileService } from 'src/app/shared/services/file.service';



@Component({
  selector: 'app-edit-evenement',
  templateUrl: './edit-evenement.component.html',
  styleUrls: ['./edit-evenement.component.scss', '../../shared/sharedEvenements_style.scss'],
  providers: [MessageService,ConfirmationService]
})
export class EditEvenementComponent implements OnInit, OnDestroy {

  idEvenement :number = 0;
  activeIndexTabView : number = 0;
  isEvenementLoaded : boolean = false;
  itemsActionsEv : MenuItem[]= [];
  itemsActionsEvenement : MenuItem[] =[
  /*   {
      label: "Envoyer une notification",
      icon: 'pi pi-send',
      command: () => {
          this.notifierMembresDialog();
      }
  }, */
  {
      label: "Annuler",
      icon: 'pi pi-times',
      command: () => {
          this.annulerEvenementDialog();
      }
  },
  {
    label: "Terminer",
    icon: 'pi pi-check-circle',
    command: () => {
        this.terminerEvenement();
    }
  },
  {
    label: "Cloturer",
    icon: 'pi pi-lock',
    command: () => {
        this.cloturerEvenement();
    }
  },
  { separator: true }
  ,
  {
      label: "Supprimer",
      icon: 'pi pi-trash',
      command: () => {
          this.supprimerEvenement();
      }
  }
];

itemsActionsEvenementPrevisionnel : MenuItem[] =[
{
    label: "Exploiter l'évènement",
    icon: 'pi pi-refresh',
    command: () => {
        this.exploiterEvenementPrv();
    }
},
{ separator: true }
,
{
    label: "Supprimer l'évènement",
    icon: 'pi pi-trash',
    command: () => {
        this.supprimerEvenement();
    }
}
];


  errorLoadingEvenement : boolean = false;
  errorLoadingMessage : string = '';

  evenementvValidation :any = {...evenementValidation};
  originalEvenement : Evenement = {};
  originalChildsObj: any= {};
  selectedEvenement : Evenement = {};


  today : any;
  minDate : Date = new Date();
  type_organes : any[] = [];
  type_evenements : any[] =[];

  view: string = 'details';

  routeState : any;


  constructor(private evenementService: EvenementService,
    private evenementPrvService : EvenementPrevisionnelService,
    public sharedDataEvService : sharedEvenementDataService,
    private eventBusService : EventBusService,
    private messageService: MessageService, private confirmationService : ConfirmationService,
    private router: Router, private activatedRoute: ActivatedRoute,
    private location: Location , private dateService : DateService ,
    private convocationService : ConvocationService , private documentService : DocumentService ,
    public fileService : FileService) {

      //Traitement des permissions

      //TypeAccess to evenements
      let typeAccess:typeAccessOrgane ='';
      if(this.eventBusService.hasPrivilges(['evenement.details','evenementPrv.details']))
      {
       //Accés a tous les évènements (tous les sociétés ou seulement sa société)
        typeAccess = "allSocietes";

      }else if(this.eventBusService.hasPrivilges(['evenement.detailsOwn','evenementPrv.detailsOwn'])){
       //Accès à ses propres événements
       typeAccess = "membre";

      }else{
         // pas d'accéss
        this.location.back();
      }


     var idEvent = null;

      //Test router if he has id
    this.activatedRoute.params.subscribe(params => {

      idEvent = params['id'];

      console.log("idEvent : " + idEvent);

     if(idEvent && idEvent > 0)
      {
      //traitement details évenement
      //initialiser la vue de détails de l'évènement
      this.idEvenement = idEvent;
      this.view= 'details';
      this.activeIndexTabView = 0;

       //Initiliser shared data type_organes et types_évènements
      // setTimeout(()=>{
        this.sharedDataEvService.loadSharedDataEvenement(typeAccess);

        this.sharedDataEvService.typesOrganes.subscribe(data =>{ this.type_organes = data; });
        this.sharedDataEvService.typesEvenement.subscribe(data => {this.type_evenements= data; });
        this.sharedDataEvService.today.subscribe(data => {
          this.today= data;
          if(this.today && this.today!==''){
              this.minDate = new Date(this.today);
          }
          this.loadEvenementById();
        });


       // });


      //Traitement si il ya un message a aficher
      this.getRouterStateData();

      //reset odj, membres, seances, taches childs components
      this.destroyAndReloadODJ();
      this.destroyAndReloadMembres();
      this.destroyAndReloadSeances();
      this.destroyAndReloadTaches();
      this.destroyAndReloadTabIntervenants();


      }else{
      this.router.navigate(['/evenements/list']);
      }

    });


 }

 getRouterStateData(){

  if(this.router.getCurrentNavigation()?.extras.state && !(this.router.getCurrentNavigation()?.trigger ==='popstate')) {
    console.log("navigation object :");
    console.log(this.router.getCurrentNavigation());

    this.routeState = this.router.getCurrentNavigation()?.extras.state;

    //console.log("Route state :");
    //console.log(this.routeState);

    if (this.routeState){

      //console.log(this.routeState);
      if(this.routeState.type == 'message'){
        setTimeout(() => {
          this.showMessageToast(this.routeState.severity, this.routeState.summary ,this.routeState.detail);
        });

      }
    }

  }

 }

  //Reinit component Ordre du jour évènement
  isVisibleODJ$ = new BehaviorSubject(true);
  destroyAndReloadODJ() {
      this.isVisibleODJ$.next(false);
      setTimeout(() => {
          this.isVisibleODJ$.next(true);
      }, 1);
  }
  //Reinit component membres évènement
  isVisibleMembre$ = new BehaviorSubject(true);
  destroyAndReloadMembres() {
      this.isVisibleMembre$.next(false);
      setTimeout(() => {
          this.isVisibleMembre$.next(true);
      }, 1);
  }

  //Reinit component séances évènement
  isVisibleSeances$ = new BehaviorSubject(true);
  destroyAndReloadSeances() {
      this.isVisibleSeances$.next(false);
      setTimeout(() => {
          this.isVisibleSeances$.next(true);
      }, 1);
  }

   //Reinit component séances évènement
   isVisibleTaches$ = new BehaviorSubject(true);
   destroyAndReloadTaches() {
       this.isVisibleTaches$.next(false);
       setTimeout(() => {
           this.isVisibleTaches$.next(true);
       }, 1);
   }

   //Reinit component séances évènement
   isVisibleTabIntervenants$ = new BehaviorSubject(true);
   destroyAndReloadTabIntervenants() {
       this.isVisibleTabIntervenants$.next(false);
       setTimeout(() => {
           this.isVisibleTabIntervenants$.next(true);
       }, 1);
   }


ngOnDestroy(): void {

}

ngOnInit(): void {
  /*
  this.activatedRoute.params.subscribe(newParams => {
    // handle any initialization logic here.
    let idEvent: number= newParams['id'];
    console.log('ID EVENEMENT init', idEvent);
  });

  this.view = 'details';
  */


}

handleChangeTabs(event:any){
  if(this.activeIndexTabView === 2){
  this.destroyAndReloadMembres();
  console.log("dddddddddd")
  }

}

loadEvenementById() {


  if(this.idEvenement === null || this.idEvenement === 0 )
  return;

  this.isEvenementLoaded=false;
  setTimeout(()=>{
      // Chargement des évènements prévisionnels a la demande
      this.evenementService.getEvenementById(this.idEvenement).subscribe(

      (data) => {

          if(data){

              this.selectedEvenement = data;
              this.sharedDataEvService.loadEvenementPrirvileges(this.selectedEvenement.privilegeEvenements || []);
              this.loadselectedEvenementData();

              this.isEvenementLoaded=true;
              //Vérifier si la convocation est signé (Ajouter par zine hocine)
              this.getConvocationSigned();


          }
          else{
            this.isEvenementLoaded=true;
            this.router.navigate(['/evenements/list'],{ state: { type :'message', severity : 'error', summary : "Erreur" , detail : "Une erreur inattendue s'est produite!"}});
            console.log( "Une erreur inattendue s'est produite!");
          }
      },
      (error) => {
          //Erreur lors du chargement de l'évènement
          //timer pour le chargement complet des données
            this.isEvenementLoaded=true;
          this.router.navigate(['/evenements/list'],{ state: { type :'message', severity : 'error', summary : "Erreur" , detail : error.message}});

          console.log(error.message);
        }
      );


  },100);
}

loadselectedEvenementData(){

        //initialiser le type organe et évènement pour l'évènement séléctionné
        let typeOrgane =  this.type_organes.find((to) => {return to.id === this.selectedEvenement.typeOrganeId});
        let organe = (typeOrgane!== null) ? typeOrgane.organes.find((to:any) => {return to.id === this.selectedEvenement.organeId}) : null;
        let typeEvenement = this.type_evenements.find((te) => {return te.value.id === this.selectedEvenement.typeEvenementId});

        this.selectedEvenement.numero = this.selectedEvenement.numero?.replace('-','/');
        this.selectedEvenement.typeOrgane = typeOrgane;
        this.selectedEvenement.organe = organe;
        this.selectedEvenement.typeEvenement = {...typeEvenement};

        this.selectedEvenement.currentSeance = this.selectedEvenement.seances![this.selectedEvenement.seances!.length-1];
       // this.selectedEvenement.dateDebut = formatDate(evenement.currentSeance.dateDebut, 'yyyy-MM-dd HH:mm:ss', 'en-us');
       //this.selectedEvenement.dateFin = formatDate(evenement.currentSeance.dateFin, 'yyyy-MM-dd HH:mm:ss', 'en-us');

      /*   if(this.selectedEvenement.dateDebut!=null)
           this.selectedEvenement.dateDebut = new Date(this.selectedEvenement.dateDebut);
        if(this.selectedEvenement.dateFin !=null)
           this.selectedEvenement.dateFin = new Date(this.selectedEvenement.dateFin); */

        if(this.selectedEvenement.currentSeance.dateDebut!=null)
           this.selectedEvenement.dateDebut = new Date(this.selectedEvenement.currentSeance.dateDebut);
        if(this.selectedEvenement.currentSeance.dateFin !=null)
           this.selectedEvenement.dateFin = new Date(this.selectedEvenement.currentSeance.dateFin);

        // initialiser membreConvocation variables
        if(this.selectedEvenement.membreConvocation){
          this.reponseMembreDate = this.selectedEvenement.membreConvocation.etat_validation_date;
          if(this.selectedEvenement.membreConvocation.etat_validation_date == 'proposer'){
            this.propositionMembreDate = new Date(this.selectedEvenement.membreConvocation.propDate_date);
            this.motifPropositionMembre = this.selectedEvenement.membreConvocation.propDate_motif;
          }
        }
        //ajouter les initiales des membres
        if(this.selectedEvenement.listeMembres !==null && this.selectedEvenement.listeMembres!.length>0){
           this.selectedEvenement.listeMembres!.forEach((membre:any) => {
             membre.initiales = this.sharedDataEvService.getAvatarMembreLabel(membre.membre_nom, membre.membre_prenom );
            });
        }

        this.selectedEvenement.backgroundColor = this.sharedDataEvService.getColorEtatEvenement(this.selectedEvenement.etat);

        // initialiser items actions pour Evenement exploitation ou évenement prévisionnel
        this.loadselectedEvenementMenuActions();


}

loadselectedEvenementMenuActions(){

 try{

          if(this.selectedEvenement.previsionnel === true){

              this.itemsActionsEv =  [...this.itemsActionsEvenementPrevisionnel];


              //traitement privilèges actions evenementprevisionnel
              if(!( this.eventBusService.hasPrivilges(['evenementPrv.detailsOwn']) &&  this.sharedDataEvService.hasEvenementPrivilges(['evenement.delete'])))
                    this.itemsActionsEv[2].disabled = true;

              if(!( this.eventBusService.hasPrivilges(['evenementPrv.detailsOwn']) &&  this.sharedDataEvService.hasEvenementPrivilges(['evenement.exploiter_prv'])))
                    this.itemsActionsEv[0].disabled = true;

              if(this.selectedEvenement.etat === 'TRANSFORMER'){
                this.itemsActionsEv[2].disabled = true;
                this.itemsActionsEv[0].disabled = true;
              }

          }
          else{

            this.itemsActionsEv =  [...this.itemsActionsEvenement];

            //traitement privilèges actions evenement

           /*  if(!( this.eventBusService.hasPrivilges(['evenement.detailsOwn']) &&  this.sharedDataEvService.hasEvenementPrivilges(['evenement.envoyer_notification'])) )
                    this.itemsActionsEv[0].disabled = true; */

            if(!( this.eventBusService.hasPrivilges(['evenement.detailsOwn']) &&  this.sharedDataEvService.hasEvenementPrivilges(['evenement.annuler'])) )
                    this.itemsActionsEv[0].disabled = true;

            if(!( this.eventBusService.hasPrivilges(['evenement.detailsOwn']) &&  this.sharedDataEvService.hasEvenementPrivilges(['evenement.terminer'])) )
                    this.itemsActionsEv[1].disabled = true;

            if(!( this.eventBusService.hasPrivilges(['evenement.detailsOwn']) &&  this.sharedDataEvService.hasEvenementPrivilges(['evenement.cloturer'])))
                    this.itemsActionsEv[2].disabled = true;

            if(!( this.eventBusService.hasPrivilges(['evenement.detailsOwn']) &&  this.sharedDataEvService.hasEvenementPrivilges(['evenement.delete'])) || this.selectedEvenement.etat !== "CREATION")
                    this.itemsActionsEv[4].disabled = true;


              if(this.selectedEvenement.etat === "CREATION"){
                this.itemsActionsEv = this.RemoveElementFromObjectArray( this.itemsActionsEv, ["Terminer","Cloturer"] );
              }else  if(this.selectedEvenement.etat === "PUBLIER"){
                this.itemsActionsEv = this.RemoveElementFromObjectArray( this.itemsActionsEv, ["Terminer","Cloturer"] );
              }else if(this.selectedEvenement.etat === "EN COURS"){
                this.itemsActionsEv = this.RemoveElementFromObjectArray(this.itemsActionsEv,["Cloturer"]);
              }else if(this.selectedEvenement.etat === "TERMINER"){
                this.itemsActionsEv = this.RemoveElementFromObjectArray( this.itemsActionsEv, ["Terminer","Annuler"]);
              }else if(this.selectedEvenement.etat === "ANNULER"){
                this.itemsActionsEv = this.RemoveElementFromObjectArray( this.itemsActionsEv, ["Terminer","Cloturer","Annuler"]);
              }
            }

    }catch(ex){
      console.log(ex);

    }
 }

 RemoveElementFromObjectArray(objectArray : any, key: string[]) {
   /*  objectArray.forEach((value :any, index:number)=>{
        if(key.includes(value.label)) objectArray.splice(index,1);
    }); */

    return objectArray.filter((element:any) => {
      return !key.includes(element.label) ;
    });
   }



//***************************Traitement de la publication évènement *************************************** */
//**************************************************************************************************************** */

//param dialog publier
showDialogPublier : boolean = false;
titreDialogPublier : string = '';
labelbuttonPublier : string = '';
cssbuttonPublier : string = '';


//parametres publication

validationDate :boolean = false;
delaisValidationDate : any;
validationODJ : boolean = false;
delaisValidationODJ : any;


publierEvenementDialog(){

  //initialiser les délais
  this.delaisValidationDate = this.selectedEvenement.delaisEvenement?.reponseValidationDate;
  this.delaisValidationODJ = this.selectedEvenement.delaisEvenement?.reponseValidationPoints;

 if(this.selectedEvenement.etat === 'CREATION')
  {
    this.titreDialogPublier = "Publier l'évènement";
    this.labelbuttonPublier = "Publier";
    this.cssbuttonPublier  = 'p-button-danger';

    //param publication
    this.validationDate = false;
    this.validationODJ = false;


  }else{
    this.titreDialogPublier = "Paramètres de publication";
    this.labelbuttonPublier = "Enregistrer";
    this.cssbuttonPublier  = 'p-button-primary';

     //param publication
    this.validationDate = this.selectedEvenement.dateevPublier!;
    this.validationODJ = this.selectedEvenement.odjPublier!;

  }

  //show dialog
  this.showDialogPublier = true;
}

publierEvenement(){
  this.confirmationService.confirm({
    key: 'confirmation',
    message: (this.selectedEvenement.etat === 'CREATION') ?
        'Etes-vous sûr de vouloir publier cet évènement et le rendre visible aux membres?' :
        'Etes-vous sûr de vouloir changer les paramètres de publication de cet évènement?',
    accept: () => {
        //Actual logic to perform a confirmation
        this.onPublierClick();
    }
});

}

onPublierClick(){

  try{

    // Traitement de la terminaison de l'évènement séléctionné
    let idSelectedEvent = this.selectedEvenement.id?.toString();

    this.evenementService.publierEvenement(idSelectedEvent,this.validationDate, this.delaisValidationDate, this.validationODJ, this.delaisValidationODJ).subscribe(
      (data) => {

          if(this.selectedEvenement.etat === 'CREATION')
          this.showSuccessToast("Publication", "Evènement publier avec succes." );
          else
          this.showSuccessToast("Modification", "Les paramètres de publication ont été modifiés avec succes.");

          this.showDialogPublier = false;

          //reload evènement
          this.loadEvenementById();


      },
      (error) => {

          console.log(error);
          this.showErrorToast("Erreur", error.message);
      }

  );


  }catch(ex){
    console.log(ex);
    this.showErrorToast("Erreur !", "Une erreur est survenu lors du changement d'état de l'évènement, réessayer a nouveau ou contacter l'administrateur.");

  }

}

getDelaisValidationDate(){
  try
  {
   return this.selectedEvenement.delaisEvenement?.reponseValidationDate;

  }
  catch(ex){
    return null;
  }
}

getDelaisValidationODJ(){
try
{
 return this.selectedEvenement.delaisEvenement?.reponseValidationPoints;

}
catch(ex){
  return null;
}
}

getBackColorCardPB(){

  if(this.selectedEvenement.etat === 'CREATION'){
    return 'background-color: #f5d4d4';
  }else if(this.selectedEvenement.etat === 'PUBLIER' || this.selectedEvenement.etat === 'EN COURS'){
    return 'background-color : #b3e5fc';

  }else if(this.selectedEvenement.etat === 'ANNULER'){
    return 'background-color : #f5d4d4';
  }
  else{
    return 'background-color:#f8f9fa';
  }

}

getBackColorButtonPB(){

  if(this.selectedEvenement.etat === 'PUBLIER'){
    return 'p-button-primary';
  }else
  {
    return "p-button-danger";

  }

}

//************************************************************************************************************* */
//****************************Traitement validation date membre ************************************************************* */

reponseMembreDate : string = '';
propositionMembreDate? : Date = new Date();
motifPropositionMembre : string = '';
reponseDateOptions :any = [
  { name: 'Valider la date', reponseMembreDate: 'valider' },
  { name: 'Proposer une autre date', reponseMembreDate: 'proposer' }
];

saveValidationMembreDate(){

  this.confirmationService.confirm({
    key: 'confirmation',
    message: (this.reponseMembreDate === 'valider') ?
      "Etes-vous sûr de vouloir enregistrer votre réponse de validation de la date de l'évènement (le "+ this.dateService.getFormattedDatePipe(this.selectedEvenement.dateDebut!) + ") ?" :
      "Etes vous sure de vouloir enregistrer votre proposition de date pour le " + this.dateService.getFormattedDatePipe(this.propositionMembreDate!),
    accept: () => {
                  //Actual logic to perform a confirmation


              // Traitement de la terminaison de l'évènement séléctionné
              let idSelectedEvent = this.selectedEvenement.id?.toString();
              this.evenementService.enregistrerReponseValidationDateMembre(idSelectedEvent,this.reponseMembreDate, formatDate(this.propositionMembreDate!, 'yyyy-MM-dd HH:mm:ss', 'en-us'), this.motifPropositionMembre).subscribe(
                (data) => {

                    this.showSuccessToast("Modification", "Votre réponse a été enregistrer avec success.");

                    //reload evènement
                    this.loadEvenementById();


                },
                (error) => {

                    console.log(error);
                    this.showErrorToast("Erreur", error.message);
                }
              )
    }
  })


}





//************************************************************************************************************* */
//***********************Formattage date évènement ************************************************************* */

getFormattedDateEvent(from : any, to:any){

  let dateFrom = formatDate(from, 'dd MMMM yyyy', 'en');
  let dateTo = formatDate(to, 'dd MMMM yyyy', 'en');
  let timeFrom = formatDate(from, 'HH:mm', 'en');
  let timeTo = formatDate(to, 'HH:mm', 'en');
  if(dateFrom === dateTo){
     if(timeFrom === timeTo)
      return dateFrom + ' | ' + timeFrom;
     else
     return dateFrom + ' | ' + timeFrom + ' -' + timeTo;
  }else{

    return dateFrom + ' - '+ dateTo + ' | '+ timeFrom;
  }

}

/**************************************************************************************************** */
/*************** Traitement des la modification de l'évènement  ********************************************************/
/**************************************************************************************************** */
handleSaveEvenement() {
  // traitement de la sauvgarde de l'évènement

  if (!this.validateEvenement()) {

      //Traitement de la validation des données

      return;
  }
  else  {
              // get societeId, typeOrganeId and typeEvenementId

              let reqEvenement : any = {...this.selectedEvenement}

              try{

              reqEvenement.typeOrganeId = this.selectedEvenement.typeOrgane.id;
              reqEvenement.organeId= this.selectedEvenement.organe.id;
              if(this.selectedEvenement.typeEvenement.value == null ||  this.selectedEvenement.typeOrgane.abreviation === 'CA')
                reqEvenement.typeEvenementId = this.selectedEvenement.typeEvenementId;
              else
              reqEvenement.typeEvenementId = this.selectedEvenement.typeEvenement.value.id;

              reqEvenement.dateDebut = formatDate(reqEvenement.dateDebut , 'yyyy-MM-dd HH:mm:ss', 'en-us');
              reqEvenement.dateFin = formatDate(reqEvenement.dateFin , 'yyyy-MM-dd HH:mm:ss', 'en-us');

              console.log(reqEvenement);

              }catch(ex){
                console.log("Erreur validation des données de l'évènement!");
                console.log(ex);
              }

              //console.log(this.newEvenement);
              //return;

              //Exploitation du service save new evenement
              this.evenementService.updateEvenement(reqEvenement).subscribe(
                  (data) => {

                          if(data){

                              this.selectedEvenement = data;
                              this.loadselectedEvenementData();
                              this.view = 'details';
                              this.showSuccessToast("Modification réussie", "L'évènement a été modifié avec success.");
                          }
                          else{
                              console.log(data);
                              this.showErrorToast("Erreur!", "Une erreur inattendue s'est produite!");
                          }
                  },
                  (error) => {
                      console.log(error);
                      this.showErrorToast("Erreur modification", error.message);

                  }

              );

  }


}

onEditClick(){


  this.originalEvenement = {...this.selectedEvenement};
  this.originalChildsObj.dateDebut = new Date(this.selectedEvenement.dateDebut!);
  this.originalChildsObj.dateFin = new Date(this.selectedEvenement.dateFin!);
  this.originalChildsObj.typeEvenement = {...this.selectedEvenement.typeEvenement};

  console.log(this.originalChildsObj);
  this.view = 'edit';

}

handleExit() {


 this.selectedEvenement = {...this.originalEvenement};
 this.selectedEvenement.dateDebut = new Date(this.originalChildsObj.dateDebut!);
 this.selectedEvenement.dateFin = new Date(this.originalChildsObj.dateFin!);
 this.selectedEvenement.typeEvenement =  {...this.originalChildsObj.typeEvenement};

 this.view = 'details';

}


validateEvenement() {

  return true;
}

notifierMembresDialog(){

}

// ************************************************ *************************************//
 // *************************** DateDebut et DateFin controle **************************************//
 // ************************************************ *************************************//

 onChangeDateDebut(event:any){

  if(this.selectedEvenement.dateDebut && this.selectedEvenement.dateFin ){
  console.log(this.selectedEvenement.dateDebut);
  console.log(this.selectedEvenement.dateFin);
  if(this.selectedEvenement.dateDebut.getTime() > this.selectedEvenement.dateFin.getTime()){

    console.log("condition here")
    this.selectedEvenement.dateFin.setFullYear(this.selectedEvenement.dateDebut.getFullYear());
    this.selectedEvenement.dateFin.setMonth(this.selectedEvenement.dateDebut.getMonth());
    this.selectedEvenement.dateFin.setDate(this.selectedEvenement.dateDebut.getDate());
    this.selectedEvenement.dateFin = new Date(this.selectedEvenement.dateFin);
  }
}

}

onChangeDateFin(event:any){

  if(this.selectedEvenement.dateDebut && this.selectedEvenement.dateFin ){

  console.log(this.selectedEvenement.dateDebut);
  console.log(this.selectedEvenement.dateFin);
  if(this.selectedEvenement.dateDebut.getTime() > this.selectedEvenement.dateFin.getTime()){

    this.selectedEvenement.dateFin.setFullYear(this.selectedEvenement.dateDebut.getFullYear());
    this.selectedEvenement.dateFin.setMonth(this.selectedEvenement.dateDebut.getMonth());
    this.selectedEvenement.dateFin.setDate(this.selectedEvenement.dateDebut.getDate());
    this.selectedEvenement.dateFin.setHours(this.selectedEvenement.dateDebut.getHours());
    this.selectedEvenement.dateFin.setMinutes(this.selectedEvenement.dateDebut.getMinutes());

    this.selectedEvenement.dateFin = new Date(this.selectedEvenement.dateFin);
  }
}

}

  // ************************************************ *************************************//


//************************************************************************************************************ */
//******************************** Cloturer évènement **********************************************************/


cloturerEvenement(){


  //Confirmer la terminaison de l'évènement
  this.confirmationService.confirm({
    key: 'confirmation',
    message: 'êtes-vous sûr de vouloir cloturer cet évènement?',
    accept: () => {
        //Actual logic to perform a confirmation
        this.onCloturerClick();
    }

});

}

onCloturerClick() {

  try{

      // Traitement de la cloture de l'évènement séléctionné
      let idSelectedEvent = this.selectedEvenement.id?.toString();
      this.evenementService.updateEtatEvenement(idSelectedEvent, "CLOTURER" , '').subscribe(
          (data) => {

             //this.router.navigate(['/evenements/list'],{ state: { type :'message', severity : 'success', summary : "Modification" , detail : "Evènement cloturer avec succes."}});
              this.showSuccessToast("Modification", data.message );
                //reload evènement
           this.loadEvenementById();

          },
          (error) => {

              console.log(error);
              this.showErrorToast("Erreur de modification", error.message);
          }

      );


  }catch(ex){

      console.log(ex);
      this.showErrorToast("Erreur !", "Une erreur est survenu lors du changement d'état de l'évènement, réessayer a nouveau ou contacter l'administrateur.");

  }
  }


//************************************************************************************************************ */
//******************************** terminer évènement **********************************************************/


terminerEvenement(){


  //Confirmer la terminaison de l'évènement
  this.confirmationService.confirm({
    key: 'confirmation',
    message: 'êtes-vous sûr de vouloir terminer cet évènement?',
    accept: () => {
        //Actual logic to perform a confirmation
        this.onTerminerClick();
    }

});

}

onTerminerClick() {

  try{

      // Traitement de la terminaison de l'évènement séléctionné
      let idSelectedEvent = this.selectedEvenement.id?.toString();

      this.evenementService.updateEtatEvenement(idSelectedEvent, "TERMINER" , '').subscribe(
        (data) => {

         //  this.router.navigate(['/evenements/list'],{ state: { type :'message', severity : 'success', summary : "Modification" , detail : "Evènement terminer avec succes."}});
            this.showSuccessToast("Modification", data.message );

            //reload evènement
           this.loadEvenementById();

        },
        (error) => {

            console.log(error);
            this.showErrorToast("Erreur de modification", error.message);
        }

    );


    }catch(ex){
      console.log(ex);
      this.showErrorToast("Erreur !", "Une erreur est survenu lors du changement d'état de l'évènement, réessayer a nouveau ou contacter l'administrateur.");

    }
  }



//********************************************************************************************************** */
//*************************Annuler évènement **************************************************************** */

showDialogAnnuler : boolean = false;
motifAnnulation : String = '';
notifierAnnulation : boolean = false;

annulerEvenementDialog(){

  this.showDialogAnnuler = true;
  this.notifierAnnulation = false;
  this.motifAnnulation = '';

}

annulerEvenement(){
  this.confirmationService.confirm({
    key: 'confirmation',
    message: 'êtes-vous sûr de vouloir annuler cet évènement ',
    accept: () => {
        //Actual logic to perform a confirmation
        this.onAnnulerClick();
    }
});

}

onAnnulerClick(){

  try{

    // Traitement de la terminaison de l'évènement séléctionné
    let idSelectedEvent = this.selectedEvenement.id?.toString();

    this.evenementService.updateEtatEvenement(idSelectedEvent, "ANNULER" , this.motifAnnulation).subscribe(
      (data) => {

          this.showSuccessToast("Annulation", "Evènement annuler avec succes." );
          this.showDialogAnnuler = false;
           //reload evènement
           this.loadEvenementById();

      },
      (error) => {

          console.log(error);
          this.showErrorToast("Erreur d'annulation", error.message);
      }

  );


  }catch(ex){
    console.log(ex);
    this.showErrorToast("Erreur !", "Une erreur est survenu lors du changement d'état de l'évènement, réessayer a nouveau ou contacter l'administrateur.");

  }

}



//*******************************************Supprimer évènement *************************************************** */
//******************************************************************************************************************* */

supprimerEvenement(){

  let typeEv = this.selectedEvenement.previsionnel === true ? ' prévisionnel ' : '';
  //Confirmer la suppression de l'évènement
  this.confirmationService.confirm({
    key: 'confirmation',
    message: 'êtes-vous sûr de vouloir supprimer cet évènement '+ typeEv +'?',
    accept: () => {
        //Actual logic to perform a confirmation
        this.onDeleteClick();
    }

});

}

onDeleteClick() {

try{

    // Traitement de la suppression de l'évènement prévisonnel séléctionné
    let idSelectedEvent = this.selectedEvenement.id?.toString();
    let typeEv = this.selectedEvenement.previsionnel!;
    this.evenementService.deleteEvenement(idSelectedEvent, typeEv).subscribe(
        (data) => {
          this.idEvenement= 0;
          this.router.navigate(['/evenements/list'],{ state: { type :'message', severity : 'success', summary : "Suppression" , detail : data.message }});
            this.showSuccessToast("Suppression", data.message );

        },
        (error) => {

            console.log(error);
            this.showErrorToast("Erreur de suppression", error.message);
        }

    );


}catch(ex){

    console.log(ex);
    this.showErrorToast("Erreur !", "Une erreur est survenu lors de la suppression de l'évènement, réessayer a nouveau ou contacter l'administrateur.");

}
}



//**************************************************************************************************************** */
//*******************************Exploiter évènement ************************************************************ */
exploiterEvenementPrv(){

//Confirmer la suppression de l'évènement prévisonnel
this.confirmationService.confirm({
  key: 'confirmation',
  message: 'êtes-vous sûr de vouloir exploiter cet évènement prévisionnel?',
  accept: () => {
      //Actual logic to perform a confirmation
      this.onExploiterPrevisionnelClick();
  }

});
}

onExploiterPrevisionnelClick(){
try{

    // Traitement de l'exploitation de l'évènement prévisonnel séléctionné (Le transformer en un évènement réel)
    let idSelectedEvenet = this.selectedEvenement.id?.toString();

     //Transformation format dateDebut et dateFin
     let dateDebut = formatDate(this.selectedEvenement.dateDebut!, 'yyyy-MM-dd HH:mm:ss', 'en-us');
     let dateFin = formatDate(this.selectedEvenement.dateFin!, 'yyyy-MM-dd HH:mm:ss', 'en-us');

     this.evenementPrvService.exploiterEvenementPrevisionnel(idSelectedEvenet, {dateFrom : dateDebut, dateTo: dateFin}).subscribe(
        (data) => {

            this.showSuccessToast("Transformation",  "L'évènement a été transformer pour exploitation aves success." );
             //reload evènement
           this.loadEvenementById();

        },
        (error:any) => {

            console.log(error);
            this.showErrorToast("Erreur de transformation", error.message);
        }

    );


}catch(ex){

    this.showErrorToast("Erreur !", "Une erreur est survenu lors de la transformation de l'évènement, réessayer a nouveau ou contacter l'administrateur.");

}

}

// ******************************  Traiter les permissions d'accéss au tab panels (membres, odj, seances, taches .....)

hasAccessTabMembres(){

  if(this.selectedEvenement.previsionnel===true)
     return this.eventBusService.hasPrivilges(['evenementPrv.details']) || this.sharedDataEvService.hasEvenementPrivilges(['evenement.membres.access']);
  else
  return this.eventBusService.hasPrivilges(['evenement.details']) || this.sharedDataEvService.hasEvenementPrivilges(['evenement.membres.access']);

}

hasAccessTabRemplacement(){

  if(this.selectedEvenement.previsionnel===true)
     return this.eventBusService.hasPrivilges(['evenementPrv.details']) || this.sharedDataEvService.hasEvenementPrivilges(['evenement.remplacement.access']);
  else
  return this.eventBusService.hasPrivilges(['evenement.details']) || this.sharedDataEvService.hasEvenementPrivilges(['evenement.remplacement.access']);

}

hasAccessTabReponses(){

  return !this.selectedEvenement.previsionnel &&
    (this.selectedEvenement.dateevPublier || this.selectedEvenement.odjPublier) &&
    this.sharedDataEvService.hasEvenementPrivilges(['evenement.reponses.access']);


}



hasAccessTabODJ(){
  if(this.selectedEvenement.previsionnel===true)
  return this.eventBusService.hasPrivilges(['evenementPrv.details']) || this.sharedDataEvService.hasEvenementPrivilges(['evenement.odj.access']);
else
  return this.eventBusService.hasPrivilges(['evenement.details']) || this.sharedDataEvService.hasEvenementPrivilges(['evenement.odj.access']);
}

hasAccessTabSeances(){
  if(this.selectedEvenement.previsionnel===true)
  return this.eventBusService.hasPrivilges(['evenementPrv.details']) || this.sharedDataEvService.hasEvenementPrivilges(['evenement.seances.access']);
else
  return this.eventBusService.hasPrivilges(['evenement.details']) || this.sharedDataEvService.hasEvenementPrivilges(['evenement.seances.access']);
}

hasAccessTabTaches(){
  if(this.selectedEvenement.previsionnel===true)
  return this.eventBusService.hasPrivilges(['evenementPrv.details']) || this.sharedDataEvService.hasEvenementPrivilges(['evenement.taches.access']);
else
  return this.eventBusService.hasPrivilges(['evenement.details']) || this.sharedDataEvService.hasEvenementPrivilges(['evenement.taches.access']);
}

hasAccessTabIntervenants(){



  return true;
}



//******************************************************************************************* */
//**************************** */ Traitement des services messages ******************************/

showErrorToast(summary:string, detail:string){

  this.showMessageToast('error', summary, detail);

}
showSuccessToast(summary:string, detail:string){

  this.showMessageToast('success', summary, detail);

}
showMessageToast(severity:string, summary:string, detail:string ){

  this.messageService.add({ key: 'tst', severity: severity , summary: summary , detail: detail });

}


////////////////////////////////////////////// Récupérer la convocation signée /////////////////////////////////////////////////////

 convocationFile !: FileResponse ;

getConvocationSigned () {
  this.convocationService.getConvocationSigne(this.selectedEvenement.id!).subscribe(
    {
        next : (data : FileResponse) => {
          if(data) {
            this.convocationFile = data ;
          }
        } ,
        error : (err : ApiResponse) => {

        }
    }
  )
}

//Télécharger un fichier existant
downloadFile (idDocument : number ,name ?: string ) {
  this.documentService.downloadFile(idDocument).subscribe(
    {
      next : (data : Blob) =>{
        let url = window.URL.createObjectURL(data);
        let a = document.createElement('a');
        a.download = name! ;
        document.body.appendChild(a);
        a.href = url;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    }
  )
}



}
