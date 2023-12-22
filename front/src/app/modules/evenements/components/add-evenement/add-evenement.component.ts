import { Component, OnDestroy, OnInit } from '@angular/core';

import { MessageService, ConfirmationService } from 'primeng/api';
import { Jours, evenementValidation, newEvenement, numeroMoisAnnee, numerosMoisSemestre, numerosMoisTrimestre, periodicite, typeAccessOrgane, typePeriodiciteMois } from '../../models/evenement';
import { formatDate } from '@angular/common';
import { EvenementService } from '../../services/evenement.service';
import { sharedEvenementDataService } from '../../services/sharedEvenementData.service';
import { Router, ActivatedRoute  } from '@angular/router';
import { OrganeService } from 'src/app/modules/organes/services/organe.service';
import { EventBusService } from 'src/app/shared/services/event-bus.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-evenement',
  templateUrl: './add-evenement.component.html',
  styleUrls: ['./add-evenement.component.scss', '../../shared/sharedEvenements_style.scss'],
  providers: [MessageService,ConfirmationService]
})
export class AddEvenementComponent implements OnInit, OnDestroy {


  userSocieteId : number = 0;

  evenementvValidation :any = evenementValidation;
  isEvenementLoaded : boolean = false;
  newEvenement : any = {...newEvenement};
  reqEvenement : any = {};



  planificationOptions :any = [
    { name: 'Single', isperiodique: false },
    { name: 'Periodique', isperiodique: true }
];

today: string = '';
minDate : Date = new Date();

type_organes : any[] = [];
type_evenements : any[] =[];

newPeriodicite : any = {};

periodicite :any[] = [...periodicite];

Jours :any[] = [...Jours];
typePeriodiciteMois :any[] = [...typePeriodiciteMois];

numerosMoisTrimestre :any[] = [...numerosMoisTrimestre];
numerosMoisSemestre :any[] = [...numerosMoisSemestre];
numeroMoisAnnee:any[] = [...numeroMoisAnnee];

formatPeriodeFrom = 'dd/mm/yy';
  formatPeriodeTo = 'dd/mm/yy';

routeState : any;

constructor(private evenementService: EvenementService,private organeService : OrganeService,private eventBusService : EventBusService, private sharedDataEvService : sharedEvenementDataService, private messageService: MessageService, private confirmationService : ConfirmationService,  private router: Router, private activatedRoute: ActivatedRoute, private location: Location) {


  this.sharedDataEvService.hasPrivilegeCreateInOrgane().subscribe((data) => {
    //ok has the privilège to create évènement.
   },
    (error) => {
      this.location.back();
    }
  );


  //récupérer la date today
  this.sharedDataEvService.today.subscribe(data => {
    this.today = data;
    /* console.log("this.today :" + data); */
    if(this.today && this.today!==''){
      this.minDate = new Date(this.today);
    }

  });



  // test extars params like date debut et fin
  if (this.router.getCurrentNavigation()?.extras.state) {


    this.routeState = this.router.getCurrentNavigation()?.extras.state;

    if (this.routeState) {
      this.newEvenement.dateDebut = this.routeState.dateDebut ? this.routeState.dateDebut  : '';
      this.newEvenement.dateFin = this.routeState.dateFin ? this.routeState.dateFin  : '';
    }

    if(this.newEvenement.dateDebut !='' && this.newEvenement.dateFin !=''){
      this.newEvenement.dateDebut.setHours(8,0);
      this.newEvenement.dateFin.setHours(16, 30);
    }

  }else{

    // i am in the
    setTimeout(() => {
        //initialiser la date debut et fin de l'èvenement
        this.newEvenement.dateDebut = new Date(this.today);
        this.newEvenement.dateDebut.setHours(8,0);

        this.newEvenement.dateFin = new Date(this.today);
        this.newEvenement.dateFin.setHours(16,30);
     }, 100);

  }



 }
  ngOnDestroy(): void {
    //throw new Error('Method not implemented.');
    //this.newEvenement = newEvenement;
  }

  ngOnInit(): void {


     //initialiser la société dans laquel l'utilisateur est entrain de travailler -- (To get from app component)
     //this.userSocieteId =1;
      let typeAccessMembre : typeAccessOrgane = "canCreate";
      this.sharedDataEvService.loadSharedDataEvenement(typeAccessMembre);
      //Initiliser shared data type_organes et types_évènements
      this.sharedDataEvService.typesOrganes.subscribe(data => {this.type_organes = data; });
      this.sharedDataEvService.typesEvenement.subscribe(data => this.type_evenements= data );

    //console.log(this.periodicite);
    //initialiser la vue periodicite
     this.newPeriodicite = {
                        type : {id : 1, designation : 'Hébdomadaire', value : 'week'},
                        designationJour : {id : 7, designation : 'Dimanche', value : 'SUNDAY'},
                        numeroJour : null,
                        typePeriodiciteMois : {id : 1, designation : 'Numéro de jour', value : 'dayNumber'},
                        numeroMoisTrimestre : {id : 1, designation : 'Premier mois', value : '1'},
                        numeroMoisSemestre : {id : 1, designation : 'Premier mois', value : '1'},
                        numeroMoisAnnuel :  {id : 1, designation : 'Janvier', value : '1'},
                        designationJourMois : this.today,
                        ignoreWeekends : true,
                        ingnoreFeriers : true};

    setTimeout(() => {
            this.isEvenementLoaded=true;
     }, 100);

  }

  // *************************** DateDebut et DateFin controle **************************************//
  onChangeDateDebut(event:any){


    if(this.newEvenement.dateDebut.getTime() > this.newEvenement.dateFin.getTime()){


      this.newEvenement.dateFin.setFullYear(this.newEvenement.dateDebut.getFullYear());
      this.newEvenement.dateFin.setMonth(this.newEvenement.dateDebut.getMonth());
      this.newEvenement.dateFin.setDate(this.newEvenement.dateDebut.getDate());
      this.newEvenement.dateFin = new Date(this.newEvenement.dateFin);
    }

  }

  onChangeDateFin(event:any){


    if(this.newEvenement.dateDebut.getTime() > this.newEvenement.dateFin.getTime()){


      this.newEvenement.dateFin.setFullYear(this.newEvenement.dateDebut.getFullYear());
      this.newEvenement.dateFin.setMonth(this.newEvenement.dateDebut.getMonth());
      this.newEvenement.dateFin.setDate(this.newEvenement.dateDebut.getDate());
      this.newEvenement.dateFin.setHours(this.newEvenement.dateDebut.getHours());
      this.newEvenement.dateFin.setMinutes(this.newEvenement.dateDebut.getMinutes());

      this.newEvenement.dateFin = new Date(this.newEvenement.dateFin);
    }

  }

  onChangePeriodeDebut(event:any){


    if(this.newEvenement.periodeFrom.getTime() > this.newEvenement.periodeTo.getTime()){


      this.newEvenement.periodeTo.setFullYear(this.newEvenement.periodeFrom.getFullYear());
      this.newEvenement.periodeTo.setMonth(this.newEvenement.periodeFrom.getMonth());
      this.newEvenement.periodeTo.setDate(this.newEvenement.periodeFrom.getDate());
      this.newEvenement.periodeTo = new Date(this.newEvenement.periodeTo);
    }

  }

  onChangePeriodeFin(event:any){


    if(this.newEvenement.periodeFrom.getTime() > this.newEvenement.periodeTo.getTime()){


      this.newEvenement.periodeTo.setFullYear(this.newEvenement.periodeFrom.getFullYear());
      this.newEvenement.periodeTo.setMonth(this.newEvenement.periodeFrom.getMonth());
      this.newEvenement.periodeTo.setDate(this.newEvenement.periodeFrom.getDate());
      //this.newEvenement.dateFin.setHours(this.newEvenement.periodeFrom.getHours());
      //this.newEvenement.dateFin.setMinutes(this.newEvenement.periodeFrom.getMinutes());

      this.newEvenement.periodeTo = new Date(this.newEvenement.periodeTo);
    }

  }

    // ************************************************ *************************************//
  validationData : boolean = false;

  handleSave() {
    // traitement de la sauvgarde de l'évènement

    if (!this.validate()) {

       this.validationData =true;

        //Traitement de la validation des données
        this.showMessageToast("warn", "Important", "Veuillez renseigner les donnés obligatoires de l'évènement avant d'enregistrer!");
        return;
    }
    else  {
                // get societeId, typeOrganeId and typeEvenementId
                this.reqEvenement ={...this.newEvenement}

                try{
                this.reqEvenement.societeId = this.userSocieteId;
                this.reqEvenement.previsionnel = !this.reqEvenement.previsionnel;
                this.reqEvenement.typeOrganeId = this.reqEvenement.typeOrgane.id;
                this.reqEvenement.organeId = this.reqEvenement.organe.id;
                if(this.reqEvenement.typeOrgane?.abreviation !== 'CA'){
                   this.reqEvenement.typeEvenementId = this.reqEvenement.typeEvenement.id;
                }else{
                  this.reqEvenement.typeEvenementId = 0;
                }
                this.reqEvenement.dateDebut = formatDate(this.reqEvenement.dateDebut, 'yyyy-MM-dd HH:mm:ss', 'en-us');
                this.reqEvenement.dateFin = formatDate(this.reqEvenement.dateFin, 'yyyy-MM-dd HH:mm:ss', 'en-us');

                this.reqEvenement.periodicite = null;

                if(this.reqEvenement.isperiodique === true){

                  this.reqEvenement.periodicite =  {...this.newPeriodicite};

                  if( this.newPeriodicite.type.value === 'weekly'){
                    this.reqEvenement.periodeFrom = formatDate(this.reqEvenement.periodeFrom, 'yyyy-MM-dd', 'en-us');
                    this.reqEvenement.periodeTo = formatDate(this.reqEvenement.periodeTo, 'yyyy-MM-dd', 'en-us');
                  }else if(this.newPeriodicite.type.value === ('monthly' )){
                    this.reqEvenement.periodeFrom = formatDate(this.reqEvenement.periodeFrom, 'yyyy-MM', 'en-us');
                    this.reqEvenement.periodeTo = formatDate(this.reqEvenement.periodeTo, 'yyyy-MM', 'en-us');

                  }else if(this.newPeriodicite.type.value === 'trimestrial' || 'semestrial' || 'Annual'){

                    this.reqEvenement.periodeFrom = formatDate(this.reqEvenement.periodeFrom, 'yyyy', 'en-us');
                    this.reqEvenement.periodeTo = formatDate(this.reqEvenement.periodeTo, 'yyyy', 'en-us');
                    this.reqEvenement.periodicite.designationJourMois = formatDate(this.reqEvenement.periodicite.designationJourMois, 'MM-dd', 'en-us' );
                  }
                }

                }catch(ex){
                  console.log("Erreur validation des données de l'évènement!");
                }



                //Exploitation du service save new evenement
                this.evenementService.saveEvenement(this.reqEvenement).subscribe(
                    (data) => {
                            if(data){

                              let detailMessage = '';

                              if(this.reqEvenement.isperiodique === true){
                                  if(data.message === '0'){
                                    // O évènement periodique ajouté
                                    this.showMessageToast('warn',"Enregistrement", "Aucun évènement n'a été enregistré !" );

                                  }else
                                  {
                                    //Au moins 1 évènement periodique ajouté
                                    detailMessage = data.message +" évènements ont été enregistrés avec success.";
                                     // Go back to liste evenements
                                    this.router.navigate(['/evenements/list'],{ state: { type :'message', severity : 'success' , summary : '"Enregistrement"' , detail : detailMessage}});
                                  }



                              }else
                              {
                                 //get idEvenement
                                 let idEvenement = data.id;
                                 //Evènement single ajouté avec success
                                 detailMessage = "L'évènement a été enregistré avec success.";
                                 this.router.navigate(['/evenements/edit/'+ idEvenement],{ state: { type :'message', severity : 'success', summary : '"Enregistrement"' , detail : detailMessage}});

                              }

                            }
                          else{
                              this.showErrorToast("Erreur!", "Une erreur inattendue s'est produite!");
                        }
                    },
                    (error) => {
                        console.log(error);
                        this.showErrorToast("Erreur d'enregistrement", error.message);

                    }

                );

    }


}

handleExit() {

  this.router.navigate(['/evenements/list']);

}

validate() {

  if(this.newEvenement.titre.trim() !== ''
     && this.newEvenement.typeOrgane !== null
     && this.newEvenement.organe !== null
     && (this.newEvenement.typeEvenement !==null || this.newEvenement.typeOrgane?.abreviation === 'CA')){

     if(!this.newEvenement.isperiodique && this.newEvenement.dateDebut!==null && this.newEvenement.dateFin!==null )
        return true;
      else if(this.newEvenement.isperiodique && this.newEvenement.periodeFrom!=null && this.newEvenement.periodeTo!=null)
          return true;


  }else{
    return false
  }

  return false;

}

public chkbIgnoreWeekendsChange(){

  //Traitement weekends ingnoré ou inclus
  if(this.newPeriodicite.ignoreWeekends){

    //retirer le vendredi et samedi de la liste
    this.Jours = this.Jours.filter( (obj:any) =>(obj.id !== 5 && obj.id !==6) );

  }else{
    // inclure les jours weekends a la liste
      this.Jours.push( {id : 5, designation : 'Vendredi', value : 'FRIDAY'},
                       {id : 6, designation : 'Samedi', value : 'SATURDAY'});

  }
}

onPeriodiciteChange(event:any){


  switch(this.newPeriodicite.type.value)
  {
    case "weekly" :
    {// chaque semaine

     this.formatPeriodeFrom = 'dd/mm/yy';
     this.formatPeriodeTo = 'dd/mm/yy';
     break;
    }
    case "monthly" :
    {// chaque mois

      this.formatPeriodeFrom = 'mm/yy';
      this.formatPeriodeTo = 'mm/yy';
      break;
    }
    case 'trimestrial' :
    {// chaque trimestre
      this.formatPeriodeFrom = 'yy';
     this.formatPeriodeTo = 'yy';
      break;
    }
    case 'semestrial':
    {// chaque semestre
      this.formatPeriodeFrom = 'yy';
     this.formatPeriodeTo = 'yy';
      break;
    }
    case 'Annual' :
    {// chaque annuel
      this.formatPeriodeFrom = 'yy';
     this.formatPeriodeTo = 'yy';
      break;
    }

   }


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
