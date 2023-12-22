import { Component, Input, OnInit, SimpleChange } from '@angular/core';

import {  Evenement, TypeOrgane, evenementFilters, evenementValidation } from 'src/app/modules/evenements/models/evenement';
import { MessageService, MenuItem, ConfirmationService } from 'primeng/api';
import { EvenementService } from '../../services/evenement.service';
import { sharedEvenementDataService } from '../../services/sharedEvenementData.service';
import { DatePipe, formatDate } from '@angular/common';
// @fullcalendar plugins
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import multiMonthPlugin from '@fullcalendar/multimonth'

import {Router } from '@angular/router';
import { ListEvenementsComponent } from '../list-evenements/list-evenements.component';
import { EventBusService } from 'src/app/shared/services/event-bus.service';



@Component({
  selector: 'app-calendrier-evenements',
  templateUrl: './calendrier-evenements.component.html',
  styleUrls: ['./calendrier-evenements.component.scss']
})
export class CalendrierEvenementsComponent  implements OnInit{

    @Input() evenementFilters : any;

    today: string = '';
    type_organes? : any[] | [];
    type_evenements? : any[] | [];

    evenementValidation :any = evenementValidation;
    //evenementFilters:any= evenementFilters;

    events: any[] = [];
    evenements : Evenement[] =[];

    calendarOptions: any = {
      initialView: 'dayGridMonth'
    };

    clickedEvent: any = null;

    isLoadingCalendar:boolean = true;

    constructor(public listEv : ListEvenementsComponent, private evenementService: EvenementService,private eventBusService:EventBusService, public sharedDataEvService : sharedEvenementDataService, private router: Router, private messageService: MessageService,  private datepipe:DatePipe){

    }


  ngOnInit(): void {

    //Initiliser shared data
    this.sharedDataEvService.today.subscribe(data => {
        this.today = data;
        this.initCalendar();
    });
    this.sharedDataEvService.typesOrganes.subscribe(data => this.type_organes = data);
    this.sharedDataEvService.typesEvenement.subscribe(data => { this.type_evenements= data;});

  }

  initCalendar(){

      //initialiser les options du calendrier fullcalendar
      this.calendarOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, multiMonthPlugin],
        height: 720,
        initialDate: this.today,
        timezone : 'Africa/Algiers',
        locale: 'fr',
        multiMonthMaxColumns: 2,
        isLoading: this.isLoadingCalendar,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,multiMonthYear',

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
        eventDrop :(e : any) => this.onEventDrop(e)
    };

  }

  onEventClick(e: any) {

    this.clickedEvent = e.event;
    this.router.navigate(['/evenements/edit/', this.clickedEvent.id]);


  }


  onDateSelect(e: any) {


    //verification que la date séléctionné n'est pas inferieur a la date today
    if( new Date(e.start.getFullYear(), e.start.getMonth(), e.start.getDate()).setHours(0,0,0,0)
        < new Date(this.today).setHours(0, 0, 0, 0))
    return;

     this.sharedDataEvService.hasPrivilegeCreateInOrgane().subscribe(
        (data) => {
                  // Traitement de la date end initiale (Date fin moins 1 minute)
                if(e.end.getHours() === 0 && e.end.getMinutes() === 0 )
                    e.end.setMinutes(e.end.getMinutes() - 1);

                // passer dateDebut et fin au component d'ajout
                /* const navigationExtras: NavigationExtras = {
                    state: {
                    dateDebut: e.start,
                    dateFin : e.end,
                    }
                }; */
                this.router.navigate(['/evenements/add'],{ state: { dateDebut: e.start, dateFin : e.end,}});

         },
        (error) => {
          return;
        }
      );


  }

  datesViewChanges(dateInfo:any){

     // Traitement du chargement des évènement prévisonnel lors du changement de la plage de dates du calendrier
    /*  console.log("Dateview change access");
     console.log(dateInfo);
     console.log(this.evenementFilters.dateFrom);
     console.log(this.evenementFilters.dateTo);
 */




     if(dateInfo)
     {
         if((this.evenementFilters.dateFrom === '' && this.evenementFilters.dateTo === '')){

             this.evenementFilters.dateFrom= formatDate(dateInfo.start, 'yyyy-MM-dd HH:mm:ss', 'en-us');
             this.evenementFilters.dateTo = formatDate(dateInfo.end, 'yyyy-MM-dd HH:mm:ss', 'en-us');
             //console.log("date view changes");
             this.loadEvenements();


         }else if( formatDate(this.evenementFilters.dateFrom ,'yyyy-MM-dd','en_US') >=  formatDate(dateInfo.start,'yyyy-MM-dd','en_US')
                     || formatDate(this.evenementFilters.dateTo,'yyyy-MM-dd','en_US') <=  formatDate(dateInfo.end,'yyyy-MM-dd','en_US')  ){


                         this.evenementFilters.dateFrom= formatDate(dateInfo.start, 'yyyy-MM-dd HH:mm:ss', 'en-us');
                         this.evenementFilters.dateTo = formatDate(dateInfo.end, 'yyyy-MM-dd HH:mm:ss', 'en-us');

                         this.loadEvenements();

         }else{

            //console.log("Nothing to load again");

         }
     }



  }

  onEventDrop(info:any) {

    try{

        let idEvenement = info.event.id.toString();
        let dateDebut = info.event.start;
        let dateFin = info.event.end;
        console.log(info.event.start);
        console.log(info.event.end);



        // Traitement dateFin null
         if(dateFin == null){
            dateFin = dateDebut;
            dateFin.setHours(dateFin.getHours() + 23);
            dateFin.setMinutes(dateFin.getMinutes() + 59);
         }

         //Transformation format dateDebut et dateFin
         dateDebut = formatDate(dateDebut, 'yyyy-MM-dd HH:mm:ss', 'en-us');
         dateFin = formatDate(dateFin, 'yyyy-MM-dd HH:mm:ss', 'en-us');

      // Traitement de la modification de date de l'évènement prévisonnel séléctionné
      this.evenementService.updateDateEvenement(idEvenement, {dateFrom : dateDebut, dateTo: dateFin}).subscribe(
          (data) => {

            this.events = this.events.filter(i => i.id.toString() !== idEvenement.toString());
            this.events = [...this.events, { ...this.getEventCalendarFromEvenement(data) }];

            //this.events = [...this.events, { ...this.getEventCalendarFromEvenement(data) }];
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


  loadEvenements() {

    this.isLoadingCalendar = true;
    setTimeout(()=>{
            // Chargement des évènements prévisionnels a la demande
            this.evenementService.getEvenements(this.evenementFilters, []).subscribe(

            (data) => {
                /* console.log(data); */
                if(data){



                    this.events = [];
                    let total = data.total;
                    let list = data.list;
                    if(Array.isArray(list) )
                    {
                        list.forEach((evenement:any)  => {

                            this.events = [...this.events, { ...this.getEventCalendarFromEvenement(evenement) }];

                           /*  // console.log(evenement);
                            this.events = [...this.events, { ...this.getEventCalendarFromEvenement(evenement) }]; */

                        });

                    }else{
                        // console.log(evenement);
                        this.events = [...this.events, { ...this.getEventCalendarFromEvenement(list) }];
                        /* this.events = [...this.events, { ...this.getEventCalendarFromEvenement(list) }]; */
                    }

                    this.calendarOptions = { ...this.calendarOptions, ...{ events: this.events } };
                    console.log(this.events);

                    this.listEv.totalRecords = this.events.length;
                    this.isLoadingCalendar = false;

                }
                else{
                    console.log( "Une erreur inattendue s'est produite!");
                    this.isLoadingCalendar = false;
                }
            },
            (error) => {

                //Erreur lors du chargement des évènements
                this.isLoadingCalendar = false;
                this.events= [];
                console.log(error);
            }
            );

   },100);

}

@Input() filtersChange : any;
ngOnChanges(changes: { [property: string]: SimpleChange }) {
    // Extract changes to the input property by its name
    let fChange: SimpleChange = changes['filtersChange'];
    /* console.log(fChange); */
    if( !fChange.isFirstChange() && fChange.currentValue != fChange.previousValue){
        /* console.log("ng on change"); */
        this.loadEvenements();
    }

    // Whenever the data in the parent changes, this method gets triggered
    // You can act on the changes here. You will have both the previous
    // value and the  current value here.
}


  getEventCalendarFromEvenement(evenement : any)
  {
      // Transformation du model évènement vers model event du calendrier

      try{


      let numeroEvent = evenement.numero.split('-')![0];
      let typeOrgane =  this.type_organes?.find((to) => {return to.id === evenement.typeOrganeId});
      let organe = typeOrgane.organes.find((to:any) => {return to.id === evenement.organeId});
      let typeEvenement = this.type_evenements?.find((te) => {return te.value.id === evenement.typeEvenementId});
      let abrvTypeOrgane = typeOrgane?.abreviation;
      let title = (evenement.previsionnel) ?  abrvTypeOrgane +' ' + evenement.societeCode + ' - ' + evenement.titre  : abrvTypeOrgane + ' ' + evenement.societeCode +  ' N°:' + numeroEvent + ' - '+ evenement.titre ;

      evenement.currentSeance = evenement.seances[evenement.seances.length-1];
      evenement.dateDebut = formatDate(evenement.currentSeance.dateDebut, 'yyyy-MM-dd HH:mm:ss', 'en-us');
      evenement.dateFin = formatDate(evenement.currentSeance.dateFin, 'yyyy-MM-dd HH:mm:ss', 'en-us');

      let colorEtat = this.sharedDataEvService.getColorEtatEvenement(evenement.etat);
      let eventCalendar = {...evenement, start : evenement.dateDebut, end : evenement.dateFin, title : title,
                                     typeOrgane : typeOrgane,
                                     organe : organe,
                                     typeEvenement : typeEvenement,
                                     /* backgroundColor : (evenement.previsionnel === true) ? '' : typeOrgane?.backgroundColor,
                                     borderColor : (evenement.previsionnel === true) ?  typeOrgane?.backgroundColor : typeOrgane?.borderColor ,
                                     textColor : (evenement.previsionnel === true) ? '' : typeOrgane?.textColor, */
                                     backgroundColor : (evenement.previsionnel === true) ? '' : colorEtat,
                                     borderColor : (evenement.previsionnel === true) ?  colorEtat : colorEtat ,
                                     textColor : (evenement.previsionnel === true) ? '' : 'white',
                                     display : 'block' };



      return eventCalendar;
      }catch(ex){

          console.error(ex);
          return null;

      }



  }

  show(){

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

  // Traitement des services messages

  showErrorToast(summary:string, detail:string){

    this.showMessageToast('error', summary, detail);

}
showSuccessToast(summary:string, detail:string){

    this.showMessageToast('success', summary, detail);

}
showMessageToast(severity:string, summary:string, detail:string ){

    this.messageService.add({ key: 'tstCalendarEv', severity: severity , summary: summary , detail: detail });

}


}
