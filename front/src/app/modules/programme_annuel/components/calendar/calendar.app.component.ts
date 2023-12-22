import { Component, OnDestroy, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Location } from '@angular/common';
import { EvenementPrevisionnelService } from '../../services/evenementPrevisionnel.service';
// @fullcalendar plugins
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list' ;
import multiMonthPlugin from '@fullcalendar/multimonth'


import { evenementPrevisionel, evenementPrvValidation,evenementPrvFilters, newEvenementPrevisionnel, evenementPrvView } from '../../models/evenement_previsionel';
import { formatDate } from '@angular/common';
import {  TypeOrgane, Jours,  numeroMoisAnnee, numerosMoisSemestre, numerosMoisTrimestre, periodicite, typePeriodiciteMois, typeAccessOrgane } from 'src/app/modules/evenements/models/evenement';
import { MessageService, MenuItem, ConfirmationService } from 'primeng/api';
import { sharedEvenementDataService } from 'src/app/modules/evenements/services/sharedEvenementData.service';
import { HierarchyService } from 'src/app/modules/hierarchy/services/hierarchy.service';
import { Societe } from 'src/app/modules/hierarchy/model/hierarchy';
import { EventBusService } from 'src/app/shared/services/event-bus.service';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './calendar.app.component.html',
    styleUrls: ['./calendar.app.component.scss'],
    providers: [MessageService,ConfirmationService]
})
export class CalendarAppComponent implements OnInit, OnDestroy {

    today: string = '';

    userSocieteId : number = 0;

    so_subscription : Subscription | undefined;
    societes : any[] = [];

    to_subscription : Subscription | undefined;
    type_organes : any[] = [];
    type_organes_canCreate : any[] = [];
    type_evenements : any[] =[];
    remuneration : any[] = [{label : 'Rémunéré', value : 'true'},
                            {label : 'Non rémunéré', value : 'false'}
                          ];

    evenementPrvValidation :any = evenementPrvValidation;
    evenementPrvFilters:any= {...evenementPrvFilters};
    evenementPrvView:any = evenementPrvView;

    planificationOptions :any = [
        { name: 'Single', isperiodique: false },
        { name: 'Periodique', isperiodique: true }
    ];

    buttonsItems: MenuItem[] = [];

    events: any[] = [];
    evenementsPrevisionnels : evenementPrevisionel[] =[];


    calendarOptions: any = {
        initialView: 'dayGridMonth'
    };

    showDialog: boolean = false;
    dateClicked: boolean = false;
    edit: boolean = false;
    view: string = '';


    changedEvent: any;
    changedEventPrv : evenementPrevisionel = {};

    newEvent : any;
    newEventPrv : any = {...newEvenementPrevisionnel};


    clickedEvent: any = null;


    newPeriodicite : any = {};

    periodicite :any[] = [...periodicite];

    Jours :any[] = [...Jours];
    typePeriodiciteMois :any[] = [...typePeriodiciteMois];

    numerosMoisTrimestre :any[] = [...numerosMoisTrimestre];
    numerosMoisSemestre :any[] = [...numerosMoisSemestre];
    numeroMoisAnnee:any[] = [...numeroMoisAnnee];

    formatPeriodeFrom = 'dd/mm/yy';
    formatPeriodeTo = 'dd/mm/yy';

    dateInfoStart : any;
    dateInfoEnd :any;

    isLoadingCalendar:boolean = true;
    nombreResultatEvs:number =0;

    constructor(private evenementPrvService: EvenementPrevisionnelService, private eventBusService : EventBusService,public sharedDataEvService:sharedEvenementDataService,private hierarchyService : HierarchyService, private messageService: MessageService, private confirmationService : ConfirmationService, private location: Location) { }
  
    ngOnDestroy(): void {

      this.evenementPrvView.listFilters = [... this.listSelectedFilters];
      this.to_subscription?.unsubscribe();
      this.so_subscription?.unsubscribe();
    }

    ngOnInit(): void {

        //initialiser la société dans laquel l'utilisateur est entrain de travailler -- (To get from app component)
        this.userSocieteId =0;
        let typeAccessOrg:typeAccessOrgane = '';
        if(this.eventBusService.hasPrivilges(['evenementPrv.list']))
        {
         //Accés a tous les évènements (tous les sociétés ou seulement sa société)
         this.evenementPrvFilters.typeAcces = 'all';
         typeAccessOrg = "allSocietes";
         this.sharedDataEvService.loadSharedDataEvenement(typeAccessOrg);

        }else if(this.eventBusService.hasPrivilges(['evenementPrv.listOwn'])){
         //Accès à ses propres événements         
         this.evenementPrvFilters.typeAcces = 'own';
         typeAccessOrg = "membre"
         this.sharedDataEvService.loadSharedDataEvenement(typeAccessOrg);

        }else{
         // pas d'accéss
         this.location.back();
        }




        //Initiliser shared data
        this.to_subscription =  this.sharedDataEvService.typesOrganes.subscribe(data => this.type_organes = data);       
        this.sharedDataEvService.typesEvenement.subscribe(data => this.type_evenements= data);
        this.so_subscription =  this.sharedDataEvService.societes.subscribe(data => {this.societes = data;} );
        this.sharedDataEvService.today.subscribe(data => {
            this.today = data;
            this.initCalendar();
        });
        //this.hierarchyService.getAllSociete().subscribe((data:Societe[]) => this.societes = data);

        //initialiser la liste des filtres sauvgardés
        this.listSelectedFilters = [...this.evenementPrvView.listFilters]; 
        console.log("listSelectedFilters");
        console.log(this.listSelectedFilters);
        console.log("this.evenementView");
        console.log(this.evenementPrvView);
        

       //initialiser la vue periodicite
        this.initPeriodicite();


        //initialiser les bouttons actions de l'évènement séléctionner
       /*  this.buttonsItems = [
            {
                label: 'Exploiter',
                icon: 'pi pi-refresh',
                disabled : true ,
                command: () => {
                    this.confirmationExploitation();
                }
            },{
                label:  'Supprimer',
                icon: 'pi pi-trash',
                disabled : true ,
                command: () => {
                    this.confirmationDelete();
                }
            }
           ]; */


    }

    initCalendar(){
         //initialiser les options du calendrier fullcalendar
         this.calendarOptions = {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin,multiMonthPlugin, listPlugin],
            height: 720,
            initialDate: this.today,
            timezone : 'Africa/Algiers',
            locale: 'fr',
            displayEventTime : false,
            isLoading: this.isLoadingCalendar,
            multiMonthMaxColumns: 2,
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,multiMonthYear,listYear',

            },
            views: {
                timeGrid: {
                    // options apply to timeGridWeek and timeGridDay views
                    allDayText : 'Toute la journée',
                    moreLinkText: 'en plus',
                    noEventsText: 'Aucun évènement à afficher',

                },
                list : {
                    allDayText : 'Toute la journée',
                    moreLinkText: 'en plus',
                    noEventsText: 'Aucun évènement à afficher',
                },
                dayGrid :{
                    showNonCurrentDates : false,
                    allDayText : 'Toute la journée',
                    moreLinkText: 'en plus',
                    noEventsText: 'Aucun évènement à afficher',
                },
                multiMonth : {
                  allDayText : 'Toute la journée',
                    moreLinkText: 'en plus',
                    noEventsText: 'Aucun évènement à afficher',
                }

            },

            buttonText: {
                today:    "Aujourd'hui",
                month:    'Mois',
                week:     'Semaine',
                day:      'Journée',
                list:     'liste',
                year :    'Année'
           },
            editable: true,
            selectable: true,
            droppable: true,
            selectMirror: true,
            dayMaxEvents: true,
            eventClick: (e: MouseEvent) => this.onEventClick(e),
            select: (e: MouseEvent) => this.onDateSelect(e),
            datesSet : (e : any) => this.datesViewChanges(e),
            eventDrop :(e : any) => this.onEventDrop(e),
            eventDidMount : (e : any) => this.eventDidMount(e)

        };
    }

    initPeriodicite(){

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

    }


    eventDidMount(info : any) {
        return;
        info.el.innerHTML += '<span><i class="pi pi-fw pi-comments text-700 mr-2"></i> </span>';
        var eventElement = info.el;
        let descriptionElement = document.createElement('div');
        descriptionElement.innerHTML = info.event.extendedProps.description;
        eventElement.appendChild(descriptionElement);
    }

    show(){

    }


    onEventClick(e: any) {

      if((!this.eventBusService.hasPrivilges(['evenementPrv.details','evenementPrv.detailsOwn']))){
        this.showErrorToast("Erreur accés","Vous n'avez pas les permissions nécessaires pour accéder au détails !");
        return;
      }

      //Récuperer le détails de l'évènement prévisionnel
      this.evenementPrvService.getEvenementPrevisionnelById(e.event.id).subscribe(
        (data) => {


            // A traiter le rechergement du l'évènement prévisionnel transformer


              //initialiser l'évènement séléctionné dans calendar et afficher son détails sur dialog
          this.clickedEvent = this.getEventCalendarFromEvenement(data);

          //let plainEvent = e.event.toPlainObject({ collapseExtendedProps: true, collapseColor: true });

          this.sharedDataEvService.loadEvenementPrirvileges(this.clickedEvent.privilegeEvenements || []);


          this.view = 'display';
          this.showDialog = true;

          this.changedEvent = {...this.clickedEvent };

          this.changedEvent.start = new Date(formatDate(this.clickedEvent.start, 'yyyy-MM-dd HH:mm:ss', 'en-us'));
          this.changedEvent.end = new Date(formatDate(this.clickedEvent.end, 'yyyy-MM-dd HH:mm:ss', 'en-us'));





        },
        (error) => {

            console.log(error);
            this.showErrorToast("Erreur", error.message);
            return;
        }

    );


          /*  //initialiser l'évènement séléctionné dans calendar et afficher son détails sur dialog
           this.clickedEvent = e.event;

           let plainEvent = e.event.toPlainObject({ collapseExtendedProps: true, collapseColor: true });

           this.sharedDataEvService.loadEvenementPrirvileges(plainEvent.privilegeEvenements || []);


           this.view = 'display';
           this.showDialog = true;

           this.changedEvent = { ...plainEvent, ...this.clickedEvent };

           this.changedEvent.start = this.clickedEvent.start;
           this.changedEvent.end = this.clickedEvent.end; */






    }

    onDateSelect(e: any) {

       /*  if((!this.eventBusService.hasPrivilges(['evenementPrv.createOwn']) && !this.sharedDataEvService.hasEvenementPrivilges(['evenement.create']))){
            this.showErrorToast("Erreur accés","Vous n'avez pas les permissions nécessaires pour ajouter un évènement prévisionnel !");
              return;
         } */

         this.sharedDataEvService.hasPrivilegeCreateInOrgane().subscribe(
            (data) => {

                //unsbuscribe from type_organes and sociétés subscription
                this.to_subscription?.unsubscribe();
                this.so_subscription?.unsubscribe();
                
                //charger les organes dont il a le privilèges de création des évènement
                let typeAccessCreate:typeAccessOrgane = "canCreate"
                this.sharedDataEvService.loadSharedDataEvenement(typeAccessCreate);
                this.to_subscription = this.sharedDataEvService.typesOrganes.subscribe(data => this.type_organes_canCreate = data);


                //Initiliser dialog pour créer un nouveau évènement prévisionnel
                this.newEventPrv = {...newEvenementPrevisionnel};
                this.newEventPrv.societeid = this.userSocieteId;

                this.view = 'new'
                this.showDialog = true;

                // Traitement de la date end initiale (Date fin moins 1 minute)
                if(e.end.getHours() === 0 && e.end.getMinutes() === 0 )
                e.end.setMinutes(e.end.getMinutes() - 1);

                // initialiser new event calendar
                this.newEvent = { ...e, ...this.newEventPrv };

        },
        (error) => {
           return;
        });



    }

    // ************************************************ *************************************//
 // *************************** DateDebut et DateFin controle **************************************//
 // ************************************************ *************************************//

 onChangeDateDebut(start:any, end:any, type:any){

    if(start && end){
    console.log(start);
    console.log(end);
    if(start.getTime() > end.getTime()){


      end.setFullYear(start.getFullYear());
      end.setMonth(start.getMonth());
      end.setDate(start.getDate());

      if(type === 'new')
      this.newEvent.end = new Date(end);
      else if(type === 'edit')
      this.changedEvent.end = new Date(end);


    }
  }

  }

  onChangeDateFin(start:any, end :any, type:any){

    if(start && end ){

    console.log(start);
    console.log(end);
    if(start.getTime() > end.getTime()){


      end.setFullYear(start.getFullYear());
      end.setMonth(start.getMonth());
      end.setDate(start.getDate());
      end.setHours(start.getHours());
      end.setMinutes(start.getMinutes());

      if(type === 'new')
      this.newEvent.end = new Date(end);
      else if(type === 'edit')
      this.changedEvent.end = new Date(end);

    }
  }

  }

  onChangePeriodeDebut(event:any){

    console.log(this.newEvent.periodeFrom);
    console.log(this.newEvent.periodeTo);
    if(this.newEvent.periodeFrom.getTime() > this.newEvent.periodeTo.getTime()){


      this.newEvent.periodeTo.setFullYear(this.newEvent.periodeFrom.getFullYear());
      this.newEvent.periodeTo.setMonth(this.newEvent.periodeFrom.getMonth());
      this.newEvent.periodeTo.setDate(this.newEvent.periodeFrom.getDate());
      this.newEvent.periodeTo = new Date(this.newEvent.periodeTo);
    }

  }

  onChangePeriodeFin(event:any){

    console.log(this.newEvent.periodeFrom);
    console.log(this.newEvent.periodeTo);
    if(this.newEvent.periodeFrom.getTime() > this.newEvent.periodeTo.getTime()){


      this.newEvent.periodeTo.setFullYear(this.newEvent.periodeFrom.getFullYear());
      this.newEvent.periodeTo.setMonth(this.newEvent.periodeFrom.getMonth());
      this.newEvent.periodeTo.setDate(this.newEvent.periodeFrom.getDate());
      //this.newEvent.dateFin.setHours(this.newEvent.periodeFrom.getHours());
      //this.newEvent.dateFin.setMinutes(this.newEvent.periodeFrom.getMinutes());

      this.newEvent.periodeTo = new Date(this.newEvent.periodeTo);
    }

  }


/*   onChangeDateDebut(start:any, end:any){

    if(start && end){
    console.log(start);
    console.log(end);
    if(start.getTime() > end.getTime()){


      this.newEvent.end.setFullYear(this.newEvent.start.getFullYear());
      this.newEvent.end.setMonth(this.newEvent.start.getMonth());
      this.newEvent.end.setDate(this.newEvent.start.getDate());
      this.newEvent.end = new Date(this.newEvent.end);
    }
  }

  }

  onChangeDateFin(start:any, end :any){

    if(this.newEvent.start && this.newEvent.end ){

    console.log(this.newEvent.start);
    console.log(this.newEvent.end);
    if(this.newEvent.start.getTime() > this.newEvent.end.getTime()){


      this.newEvent.end.setFullYear(this.newEvent.start.getFullYear());
      this.newEvent.end.setMonth(this.newEvent.start.getMonth());
      this.newEvent.end.setDate(this.newEvent.start.getDate());
      this.newEvent.end.setHours(this.newEvent.start.getHours());
      this.newEvent.end.setMinutes(this.newEvent.start.getMinutes());

      this.newEvent.end = new Date(this.newEvent.end);
    }
  }

  } */

  //*************************************************************************************************** */


  handleSave() {
        // traitement de la sauvgarde de l'évènement prévisionnel

        if (!this.validate()) {

              //Traitement de la validation des données
               this.showMessageToast("warn", "Important", "Veuillez renseigner les donnés obligatoires de l'évènement avant d'enregistrer!");
              return;
        }
        else        {

                if(this.view === 'new') {

                    //Initialiser l'objet evenementPrv new
                    this.newEventPrv = {...newEvenementPrevisionnel};

                    // Traitement de l'ajout
                    this.newEventPrv= this.getEvenementFromEventCalendar(this.newEventPrv,this.newEvent);

                    if(this.newEventPrv == null)
                    {
                        // en cas ou il y'a erreur de transformation du event calendar vers évènement
                        this.showErrorToast("Erreur validation!", "Veuillez valider les données de l'évènement avant de l'enregistrer!");
                        return;
                    }

                    this.evenementPrvService.saveEvenementPrevisionnel(this.newEventPrv).subscribe(
                        (data) => {
                                console.log("data");
                                console.log(data);

                                if(data){
                                    if(Array.isArray(data) )
                                    {
                                        if(data.length>0){
                                            data.forEach( (evenement:any)  => {

                                                this.events = [...this.events, { ...this.getEventCalendarFromEvenement(evenement) }];

                                            });
                                        let message = (data.length ===1)? "1 évènement a été enregistré avec success.": data.length +" évènements ont été enregistrés avec success."
                                        this.showSuccessToast("Enregistrement", message);
                                        this.showDialog = false;
                                        this.calendarOptions = { ...this.calendarOptions, ...{ events: this.events } };
                                        this.clickedEvent = null;

                                       }else{

                                        this.showMessageToast("warn","Message", "Aucun évènement n'a été enregisté!");

                                       }
                                    }else{

                                        this.events = [...this.events, { ...this.getEventCalendarFromEvenement(data) }];
                                        this.showSuccessToast("Enregistrement",  "L'évènement a été enregistré aves success." );
                                        this.showDialog = false;
                                        this.calendarOptions = { ...this.calendarOptions, ...{ events: this.events } };
                                        this.clickedEvent = null;
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
                else if( this.view === 'edit')
                {
                        if(!this.sharedDataEvService.hasEvenementPrivilges(['evenement.update']))
                        {
                            this.showErrorToast("Erreur permission","Vous n'aver pas les permissions nécessaires pour modifier cet évènement prévisionnel !" );
                            return;
                         }
                        //Initialiser l'objet evenementPrv new
                        this.changedEventPrv = {};

                        //Traitement de la modification
                        this.changedEventPrv = this.getEvenementFromEventCalendar(this.changedEventPrv,this.changedEvent);

                        if(this.changedEventPrv == null)
                        {
                            // en cas ou il y'a erreur de transformation du event calendar vers évènement
                            this.showErrorToast("Erreur validation!", "Veuillez valider les données de l'évènement avant de l'enregistrer !");

                            return false;
                        }

                        this.evenementPrvService.updateEvenementPrevisionnel(this.changedEventPrv).subscribe(
                            (data) => {
                            if(data){

                                            this.events = this.events.filter(i => i.id.toString() !== this.changedEvent.id.toString());

                                            this.events = [...this.events, { ...this.getEventCalendarFromEvenement(data) }];


                                            this.showSuccessToast("Modification",  "L'évènement a été modifié aves success." );

                                            this.showDialog = false;
                                            this.calendarOptions = { ...this.calendarOptions, ...{ events: this.events } };
                                            this.changedEvent = null;
                                            this.clickedEvent = null;

                                            return true;


                            }
                            else{
                                this.showErrorToast("Erreur de modification!", "Une erreur inattendue s'est produite!");
                                return false;
                            }
                            },
                            (error) => {

                                console.log(error);
                                this.showErrorToast("Erreur de modification", error.message);
                                return false;
                            }

                        );

              }

          return false;

        }


    }



    onEditClick() {
        //Click du boutton modifier de l'évènement séléctionner
        if(this.changedEvent.etat === 'TRANSFORMER')
        this.showErrorToast("Erreur", "Impossible de modifier cet évènement prévisionnel car il est déja exploiter!");
        else
        this.view = 'edit';
    }

    confirmationDelete(){

        //Confirmer la suppression de l'évènement prévisonnel
        this.confirmationService.confirm({
            key: 'confirmation',
            message: 'Êtes-vous sûr de vouloir supprimer cet évènement prévisionnel?',
            accept: () => {
                //Actual logic to perform a confirmation
                this.onDeleteClick();
            }

        });

    }

    confirmationExploitation(){

        //Confirmer la suppression de l'évènement prévisonnel
        this.confirmationService.confirm({
            key: 'confirmation',
            message: 'Êtes-vous sûr de vouloir exploiter cet évènement prévisionnel?',
            accept: () => {
                //Actual logic to perform a confirmation
                this.onExploiterClick();
            }

        });

    }

    onDeleteClick() {

        try{

            // Traitement de la suppression de l'évènement prévisonnel séléctionné
            let idSelectedEvent = this.clickedEvent.id.toString();
            this.evenementPrvService.deleteEvenementPrevisionnel(idSelectedEvent).subscribe(
                (data) => {


                    this.events = this.events.filter(i => i.id.toString() !== this.clickedEvent.id.toString());

                    this.showSuccessToast("Suppression", data.message );

                    this.calendarOptions = { ...this.calendarOptions, ...{ events: this.events } };
                    this.showDialog = false;

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

    onExploiterClick(){
        try{

            // Traitement de l'exploitation de l'évènement prévisonnel séléctionné (Le transformer en un évènement réel)
            let idSelectedEvenet = this.clickedEvent.id.toString();
            let dateDebut = this.changedEvent.start;
            let dateFin =   this.changedEvent.end;

             //Transformation format dateDebut et dateFin
             dateDebut = formatDate(dateDebut, 'yyyy-MM-dd HH:mm:ss', 'en-us');
             dateFin = formatDate(dateFin, 'yyyy-MM-dd HH:mm:ss', 'en-us');

             this.evenementPrvService.exploiterEvenementPrevisionnel(idSelectedEvenet, {dateFrom : dateDebut, dateTo: dateFin}).subscribe(
                (data) => {


                    // A traiter le rechergement du l'évènement prévisionnel transformer

                    //1- le retirer de la liste events
                    this.events = this.events.filter(i => i.id.toString() !== this.clickedEvent.id.toString());

                    //2- récupérer l'évènement prv de data.data
                    this.events = [...this.events, { ...this.getEventCalendarFromEvenement(data) }];

                    this.calendarOptions = { ...this.calendarOptions, ...{ events: this.events } };
                    this.showDialog = false;
                    this.changedEvent = null;
                    this.clickedEvent=null;

                    this.showSuccessToast("Exploitation",  "L'évènement a été transformer pour exploitation avec success." );


                },
                (error) => {

                    console.log(error);
                    this.showErrorToast("Erreur de transformation", error.message);
                }

            );


        }catch(ex){

            this.showErrorToast("Erreur !", "Une erreur est survenu lors de la transformation de l'évènement, réessayer a nouveau ou contacter l'administrateur.");

        }

    }

    validate() {

         //Validation des données de l'évènement prévionnel
         if(this.view === 'new'){

                    if(this.newEvent.titre.trim() !== ''
                    && this.newEvent.typeOrgane !== null
                    && this.newEvent.organe !== null
                    && (this.newEvent.typeEvenement !==null || this.newEvent.typeOrgane?.abreviation === 'CA')){

                    if(!this.newEvent.isperiodique && this.newEvent.dateDebut!==null && this.newEvent.dateFin!==null )
                        return true;
                    else if(this.newEvent.isperiodique && this.newEvent.periodeFrom!=null && this.newEvent.periodeTo!=null)
                        return true;


                }else{
                    return false
                }


         }else if(this.view === 'edit'){
            if(this.changedEvent.titre.trim() !== ''
            && this.changedEvent.typeOrgane !== null
            && this.changedEvent.organe !== null
            && (this.changedEvent.typeEvenement !==null || this.changedEvent.typeOrgane?.abreviation === 'CA')
            && this.changedEvent.dateDebut!==null
            && this.changedEvent.dateFin!==null){
                 return true;

        }else{
            return false
        }
      }

     return false;

    }

    handleExit(){

      if(this.view === 'new')
          this.showDialog = false;
      else if(this.view === 'edit')
          this.view = 'display';
    }

    datesViewChanges(dateInfo:any){
        // Traitement du chargement des évènement prévisonnel lors du changement de la plage de dates du calendrier
        //console.log(dateInfo);
        /* this.isLoadingCalendar = true; */

        if(dateInfo)
        {
            this.dateInfoStart = formatDate(dateInfo.start, 'yyyy-MM-dd HH:mm:ss', 'en-us');
            this.dateInfoEnd = formatDate(dateInfo.end, 'yyyy-MM-dd HH:mm:ss', 'en-us');
            console.log("date view changes :");
            console.log( this.dateInfoStart);
            console.log( this.dateInfoEnd);

            if((this.evenementPrvFilters.dateFrom === '' && this.evenementPrvFilters.dateTo === '')){

                this.evenementPrvFilters.dateFrom= formatDate(dateInfo.start, 'yyyy-MM-dd HH:mm:ss', 'en-us');
                this.evenementPrvFilters.dateTo = formatDate(dateInfo.end, 'yyyy-MM-dd HH:mm:ss', 'en-us');
                this.loadEvenementPrevisionnels();



            }else if( formatDate(this.evenementPrvFilters.dateFrom ,'yyyy-MM-dd','en_US') >  formatDate(dateInfo.start,'yyyy-MM-dd','en_US')
                        || formatDate(this.evenementPrvFilters.dateTo,'yyyy-MM-dd','en_US') <  formatDate(dateInfo.end,'yyyy-MM-dd','en_US')  ){

                            this.evenementPrvFilters.dateFrom= formatDate(dateInfo.start, 'yyyy-MM-dd HH:mm:ss', 'en-us');
                            this.evenementPrvFilters.dateTo = formatDate(dateInfo.end, 'yyyy-MM-dd HH:mm:ss', 'en-us');
                            this.loadEvenementPrevisionnels();

            }else{

               console.log("Nothing to load again");

            }
        }

     /*   setTimeout(()=>{
        this.isLoadingCalendar = false;
       }, 250); */

    }

    onEventDrop(info:any) {

        try{

            let idEvenement = info.event.id.toString();
            let dateDebut = info.event.start;
            let dateFin = info.event.end;


            // Traitement dateFin null
             if(dateFin == null){
                dateFin = dateDebut;
                if(info.oldEvent.end == null){
                    dateFin.setHours(dateFin.getHours() + 23);
                    dateFin.setMinutes(dateFin.getMinutes() + 59);

                }else{
                dateFin.setHours(info.oldEvent.end.getHours());
                dateFin.setMinutes(info.oldEvent.end.getMinutes());
                }
             }

             //Transformation format dateDebut et dateFin
             dateDebut = formatDate(dateDebut, 'yyyy-MM-dd HH:mm:ss', 'en-us');
             dateFin = formatDate(dateFin, 'yyyy-MM-dd HH:mm:ss', 'en-us');

          // Traitement de la modification de date de l'évènement prévisonnel séléctionné
          this.evenementPrvService.updateDateEvenementPrevisionnel(idEvenement, {dateFrom : dateDebut, dateTo: dateFin}).subscribe(
              (data) => {

                  this.events = this.events.filter(i => i.id.toString() !== idEvenement.toString());

                                            this.events = [...this.events, { ...this.getEventCalendarFromEvenement(data) }];

                                            this.calendarOptions = { ...this.calendarOptions, ...{ events: this.events } };



              },
              (error) => {
                  info.revert();
                  console.log(error);
                  this.showErrorToast("Erreur de modification de date", error.message);
              }

          );

       }catch(ex){
        console.log(ex);
        info.revert();
       }
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



    loadEvenementPrevisionnels() {

        this.evenementPrvFilters.societeid=  0;
        this.evenementPrvFilters.type_organeid =0;
        this.evenementPrvFilters.organeid = 0;
        this.evenementPrvFilters.type_evenementid = 0;
        this.evenementPrvFilters.dateFrom = this.dateInfoStart;
        this.evenementPrvFilters.dateTo = this.dateInfoEnd;
        this.evenementPrvFilters.isRemunerer ="";
        this.evenementPrvFilters.isPeriodique = "";
        this.evenementPrvFilters.keyword = "";

      //chargement des filtres
      if(this.listSelectedFilters.length>0){

        this.listSelectedFilters.forEach((value,index)=>{
          switch(value.value) {
            case 'selected_societe' :
              this.evenementPrvFilters.societeid = value.id ;
              break;
            case 'selected_typeorgane' :
              this.evenementPrvFilters.type_organeid = value.id ;
              break;
            case 'selected_organe' :
              this.evenementPrvFilters.organeid = value.id ;
              break;
            case 'selected_typeEvenement':
              this.evenementPrvFilters.type_evenementid = value.id ;
              break;
            case 'selected_remuneration':
                this.evenementPrvFilters.isRemunerer = value.isRemunerer ;
                break;

            case 'selectedDateFrom' :
              let datefl = (value.label.split(":")[1].trim()).split('/');
              let newDatefl = datefl[1] + '/' +datefl[0] +'/' +datefl[2];
              this.evenementPrvFilters.dateFrom = formatDate(new Date(newDatefl), 'yyyy-MM-dd HH:mm:ss', 'en-us');
              break;
            case 'selectedDateTo' :
              let dateT = (value.label.split(":")[1].trim()).split('/');
              let newDateT = dateT[1] + '/' +dateT[0] +'/' +dateT[2];
              this.evenementPrvFilters.dateTo = formatDate(new Date(newDateT), 'yyyy-MM-dd HH:mm:ss', 'en-us');
              break;
            case 'selected_periodicite' :
              this.evenementPrvFilters.isPeriodique = value.label;
              break;
            case 'selectedSearch' :
              this.evenementPrvFilters.keyword = value.label.split(":")[1].trim();
              break;


          }
        });
      }

      this.isLoadingCalendar = true;
      setTimeout(()=>{
        // Chargement des évènements prévisionnels a la demande
        this.evenementPrvService.getEvenementsPrevisionnels(this.evenementPrvFilters).subscribe(

        (data) => {

            if(data){

                       this.events = [];
                        if(Array.isArray(data) )
                        {


                            data.forEach( (evenement:any)  => {
                            // console.log(evenement);

                                this.events = [...this.events, { ...this.getEventCalendarFromEvenement(evenement) }];

                            });

                        }else{

                                this.events = [...this.events, { ...this.getEventCalendarFromEvenement(data) }];
                        }

                        this.nombreResultatEvs = this.events.length;


                        this.calendarOptions = { ...this.calendarOptions, ...{ events: this.events } };

                        //console.log(this.events);
                        this.isLoadingCalendar = false;


            }
            else{
                console.log( "Une erreur inattendue s'est produite!");
                this.isLoadingCalendar = false;
            }
        },
        (error) => {

            //Erreur lors du chargement des évènements prévisionnels
            this.isLoadingCalendar = false;
            this.events= [];
            console.log(error);
          }
        );

      },100);

    }

    onChangeTypeOrgane(event:any) {

        // Traitement en cas de chagement du type organe séléctionné

        //this.changedEvent.changedEventPrv.typeOrgane = event;
       /*  console.log('type organe id : ' +  this.changedEvent.changedEventPrv.typeOrgane.id );
        console.log(event);
        console.log(event.value); */
    }

    handleTestCodeConsole(){
       // console.log(this.changedEvent.start);
        //console.log(this.changedEvent.end);
    }

    getEventCalendarFromEvenement(evenement : any)
    {
        // Transformation du model évènement vers model event du calendrier

        try{

        let typeOrgane =  this.type_organes.find((to) => {return to.id === evenement.typeOrganeId});
        let organe = typeOrgane.organes.find((to:any) => {return to.id === evenement.organeId});
        let typeEvenement = this.type_evenements.find((te) => {return te.value.id === evenement.typeEvenementId});
        let abrvTypeOrgane = typeOrgane?.abreviation;
        let title = abrvTypeOrgane +' ' + evenement.societeCode + ' - ' + evenement.titre
         //ajouter les initiales des membres
         if(evenement.listeMembres !==null && evenement.listeMembres!.length>0){
            evenement.listeMembres!.forEach((membre:any) => {
            membre.initiales = this.sharedDataEvService.getAvatarMembreLabel(membre.membre_nom, membre.membre_prenom );
           });
       }

       let colorEtat = this.sharedDataEvService.getColorEtatEvenement(evenement.etat);

        let eventCalendar = {...evenement, start : evenement.dateDebut, end : evenement.dateFin, title : title,
                                       typeOrgane : typeOrgane,
                                       organe : organe,
                                       typeEvenement : typeEvenement,
                                       /* backgroundColor : '',
                                       borderColor : typeOrgane?.backgroundColor ,
                                       textColor : '', */
                                       backgroundColor : colorEtat,
                                       borderColor : colorEtat,
                                       textColor : 'white',
                                       display : 'block' };

                                    /*    let eventCalendar = {...evenement, start : evenement.dateDebut, end : evenement.dateFin, title : title,
                                        typeOrgane : typeOrgane,
                                        organe : organe,
                                        typeEvenement : typeEvenement,
                                        backgroundColor : typeOrgane?.backgroundColor,
                                        borderColor : typeOrgane?.borderColor ,
                                        textColor : typeOrgane?.textColor,
                                        display : 'block' }; */




        return eventCalendar;
        }catch(ex){

            console.error(ex);
            return null;

        }

    }

    getEvenementFromEventCalendar(evenement:any, eventCalendar : any)
    {
        console.log("eventCalendar");
        console.log(eventCalendar);
        // Transformation du model event du calendrier  vers model évènement
        try{

        Object.entries(evenement).forEach(([key, value]) => { evenement[key] = eventCalendar[key]});

        evenement.id = eventCalendar.id;
        evenement.titre = eventCalendar.titre;
        evenement.description = eventCalendar.description ;
        evenement.emplacement = eventCalendar.emplacement;

       // get la société id de l'utilisateur
        evenement.societeid = eventCalendar.societeid;


        if(eventCalendar.end.getHours() === 0 && eventCalendar.end.getMinutes() === 0 ){
            eventCalendar.end.setHours(eventCalendar.end.getHours() + 23);
            eventCalendar.end.setMinutes(eventCalendar.end.getMinutes() + 59);
        }
        evenement.dateDebut = formatDate(eventCalendar.start, 'yyyy-MM-dd HH:mm:ss', 'en-us');
        evenement.dateFin = formatDate(eventCalendar.end, 'yyyy-MM-dd HH:mm:ss', 'en-us');


        evenement.typeOrganeId = eventCalendar.typeOrgane.id;
        evenement.organeId = eventCalendar.organe.id;

        if(this.view === 'new'){

            if(eventCalendar.typeOrgane?.abreviation !== 'CA'){
                evenement.typeEvenementId = eventCalendar.typeEvenement.id;
             }else{
                evenement.typeEvenementId  = 0;
             }


         evenement.periodicite = null;
         if(evenement.isperiodique === true){

           evenement.periodicite =  {...this.newPeriodicite};

           if( this.newPeriodicite.type.value === 'weekly'){
             evenement.periodeFrom = formatDate(eventCalendar.periodeFrom, 'yyyy-MM-dd', 'en-us');
             evenement.periodeTo = formatDate(eventCalendar.periodeTo, 'yyyy-MM-dd', 'en-us');
           }else if(this.newPeriodicite.type.value === ('monthly' )){
             evenement.periodeFrom = formatDate(eventCalendar.periodeFrom, 'yyyy-MM', 'en-us');
             evenement.periodeTo = formatDate(eventCalendar.periodeTo, 'yyyy-MM', 'en-us');

           }else if(this.newPeriodicite.type.value === 'trimestrial' || 'semestrial' || 'Annual'){

             evenement.periodeFrom = formatDate(eventCalendar.periodeFrom, 'yyyy', 'en-us');
             evenement.periodeTo = formatDate(eventCalendar.periodeTo, 'yyyy', 'en-us');
             evenement.periodicite.designationJourMois = formatDate(eventCalendar.periodicite.designationJourMois, 'MM-dd', 'en-us' );
           }
         }
        }
        else{
        //evenement.typeEvenementId=eventCalendar.typeEvenement.value.id;

        if(eventCalendar.typeEvenement === null ||
            eventCalendar.typeEvenement === undefined
            ||  eventCalendar.typeEvenement.value === null
             ||  eventCalendar.typeOrgane.abreviation === 'CA')
               evenement.typeEvenementId =  eventCalendar.typeEvenementId;
         else
             evenement.typeEvenementId=  eventCalendar.typeEvenement.value.id;
        }

        evenement.remuneration = eventCalendar.remuneration;


        return evenement;

        }catch(ex){
            console.error(ex);
            console.log("Erreurs survenu lors de la transformation d'un event calendrier vers un évènement GOGS !");
            return null;

        }

    }

  // ******************************  Traiter les permissions d'accéss au tab panels (membres, odj, seances, taches .....)

hasAccessTabMembres(){

       return this.eventBusService.hasPrivilges(['evenementPrv.details']) || this.sharedDataEvService.hasEvenementPrivilges(['evenement.membres.access']);

  }

  hasAccessTabODJ(){

    return this.eventBusService.hasPrivilges(['evenementPrv.details']) || this.sharedDataEvService.hasEvenementPrivilges(['evenement.odj.access']);

  }
  ////////////////////////////////////////////

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

sidebarVisible:boolean = false;

toggleFilters(){
this.sidebarVisible = true;
}

filtrer(){
this.sidebarVisible = false;
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

if(this.listSelectedFilters.length>0)
this.loadEvenementPrevisionnels();
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
this.loadEvenementPrevisionnels();

}

removeChipFilter(itemFilter : any){

//this.listSelectedFilters = this.listSelectedFilters.find(se => {return se.value !== itemFilter.value} );
console.log(this.listSelectedFilters);
this.listSelectedFilters.forEach((value,index)=>{
          if(value.value === itemFilter.value) {
             this.listSelectedFilters.splice(index,1);
             this.clearChipFilter(value.value);

          }
 });
 console.log(this.listSelectedFilters);
this.loadEvenementPrevisionnels();

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


    // Traitement des services messages

    showErrorToast(summary:string, detail:string){

        this.showMessageToast('error', summary, detail);

    }
    showSuccessToast(summary:string, detail:string){

        this.showMessageToast('success', summary, detail);

    }
    showMessageToast(severity:string, summary:string, detail:string ){

        this.messageService.add({ key: 'tstprv', severity: severity , summary: summary , detail: detail });

    }




}
