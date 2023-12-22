import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EvenementService } from 'src/app/modules/evenements/services/evenement.service';
import { sharedEvenementDataService } from 'src/app/modules/evenements/services/sharedEvenementData.service';
import { HierarchyService } from 'src/app/modules/hierarchy/services/hierarchy.service';
import { EventBusService } from 'src/app/shared/services/event-bus.service';
import { Societe } from 'src/app/modules/hierarchy/model/hierarchy';

@Component({
  selector: 'app-bilan-organes',
  templateUrl: './bilan-organes.component.html',
  styleUrls: ['./bilan-organes.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class BilanOrganesComponent {

  // Evenement filterscls
  evenementFilters:any = {

    societeid:  0,
    type_organeid :0,
    organeid : 0,
    dateFrom : '',
    dateTo : '',
    type_evenementid : 0,
    etat_evenement : 'completer',
    isPrevisionnel : 'false',
    isRemunerer : "",
    isPeriodique : "",
    keyword : '',
    typeAcces : ''

  }

  //Shared Data
  today: string = '';
  societes : any[] = [];
  userSocieteId : number = 0;
  type_organes : any[] = [];
  type_evenements : any[] =[];

  //Selected Data by user
  selected_typeorgane : any;
  selected_organe : any;
  selected_societe : any;
  selected_typeEvenement : any;
  selected_typeBilan :any;
  selectedDateFrom : any;
  selectedDateTo : any;

  //Résultat chargement évènement
  events : any[] = [];
  totalRecords: number = 0;


  constructor( private evenementService: EvenementService, private sharedDataEvService : sharedEvenementDataService, private hierarchyService : HierarchyService,private eventBusService : EventBusService, private messageService: MessageService, private confirmationService : ConfirmationService,private router: Router,private location: Location ) { 


      

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
 
   let typeDataUser = this.evenementFilters.typeAcces ==='all' ? 'all' : 'membre'; 
   this.sharedDataEvService.loadSharedDataEvenement(typeDataUser);
   //Initiliser shared data type_organes et types_évènements
   this.hierarchyService.getAllSociete().subscribe((data:Societe[]) => { this.societes = data; }); 
   this.sharedDataEvService.typesOrganes.subscribe(data => { this.type_organes = data;  });
   this.sharedDataEvService.typesEvenement.subscribe(data => {this.type_evenements= data;  });
   this.sharedDataEvService.today.subscribe(data => {this.today = data;     });    


  }

  onFilter(){

    this.evenementService.getEvenements(this.evenementFilters, []).subscribe(

      (data) => {
          if(data){
            
            this.events = data.list;    
            this.totalRecords = data.total;           

          }
          else{
            this.showErrorToast("Erreur", "Une erreur inattendue s'est produite!");
              
          }
      },
      (error) => {

          //Erreur lors du chargement des évènements          
          this.events= [];
          this.totalRecords = 0;
          console.log(error);
          this.showErrorToast("Erreur", error.message);
        }
      );
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
