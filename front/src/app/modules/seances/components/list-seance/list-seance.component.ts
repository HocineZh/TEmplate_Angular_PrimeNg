import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Seance} from './../../model/seance';
import { SeanceService } from './../../services/seance.service';
import { Router } from '@angular/router';
import { Evenement } from 'src/app/modules/evenements/models/evenement';
import { AddSeanceComponent } from './../add-seance/add-seance.component';
import { EditSeanceComponent } from './../edit-seance/edit-seance.component';
import { ApiResponse } from 'src/app/shared/models/shared';
import { BehaviorSubject } from 'rxjs';
import { EditPresenceComponent } from '../edit-presence/edit-presence.component';
@Component({
  selector: 'app-list-seance',
  templateUrl: './list-seance.component.html',
  styleUrls: ['./list-seance.component.scss'],
  providers: [MessageService,  ConfirmationService]
})
export class ListSeanceComponent {

  @Input() idEvenement ? : Evenement;


  @ViewChild(AddSeanceComponent) componentAdd ?: AddSeanceComponent;

  @ViewChild(EditPresenceComponent) componentEditPresence ?: EditPresenceComponent;

  @ViewChild(EditSeanceComponent) componentEdit ?: EditSeanceComponent;

  seanceDialog: boolean = false;

  deleteSeanceDialog: boolean = false;

  openSeanceDialog: boolean = false;

  closeSeanceDialog: boolean = false;

  deleteSeancesDialog: boolean = false;

  seances: Seance[] = [];

  seance: Seance = {dateDebut:new Date(),dateFin:new Date()};

  selectedSeances: Seance[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  idSeance! : number;

  idSeanceListPresence! : Seance;

  displaydGridEditSeance: boolean = false;

  displaydGridAddSeance : boolean = false ;

  displaydGridEditPresence : boolean = false ;

  membreDialog: boolean =false;

  etatLastseance?: boolean ;


  constructor(private seanceService: SeanceService, private messageService: MessageService,private router : Router ,private confirmationService: ConfirmationService) {
  }

  ngOnInit() {

    this.getSeance();
    this.cols = [
        { field: 'seance', header: 'Seance' },
        { field: 'dateDebut', header: 'dateDebut' },
        { field: 'dateFin', header: 'dateFin' },
        { field: 'lieu', header: 'Lieu' },
        { field: 'Etat', header: 'Etat' },
    ];

  }


  getSeance() {
    this.seanceService.getAllSeanceByEvenement(this.idEvenement?.id!).subscribe(
      {
        next : (data : Seance[]) => {
          this.seances = data ;
          this.etatLastseance = !(data.some(seance => seance.etatsByEtatsid!.etat  !==  'Cloturée'));
        }
      }
    )

  }

  openNew() {
    this.componentAdd?.setDialog();
    this.displaydGridAddSeance = true ;
  }


  deleteSelectedSeances() {
      this.deleteSeancesDialog = true;
  }

  editSeance(seance: Seance) {
    this.idSeance = seance.id!;
    this.componentEdit?.setDialog();
    this.displaydGridEditSeance = true ;
  }

  deleteSeance(seance: Seance) {
      this.deleteSeanceDialog = true;
      this.seance = { ...seance };
  }

  openSeance(seance: Seance) {
    this.openSeanceDialog = true;
    this.seance = { ...seance };
  }

  closeSeance(seance: Seance) {
    this.closeSeanceDialog = true;
    this.seance = { ...seance };
  }

  openMembre(seance: Seance){

    this.idSeanceListPresence = seance!;
    this.componentEditPresence?.setDialog();
    this.displaydGridEditPresence = true;
  }

  hideDialogMembre(){
    this.membreDialog = false;

  }

  confirmDeleteSelected() {

      const mappedArray = this.selectedSeances.map( (o)=> o.id );
      this.seanceService.deleteMultipleSeance(mappedArray).subscribe(
        (data: any) => {
          this.deleteSeancesDialog = false;
          this.seances = this.seances.filter(val => !this.selectedSeances.includes(val));
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Séances supprimées avce succès', life: 3000 });
          this.selectedSeances = [];
        },(error : any) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Veuillez SVP contacter l'administrateur", life: 3000 });
        }
      )
  }

confirmDelete() {

  this.seanceService.deleteSeance(this.seance.id!).subscribe(
    (data: any) => {
      this.deleteSeanceDialog = false;
      this.seances = this.seances.filter(val => val.id !== this.seance.id);
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Séance supprimée avec succès', life: 3000 });
      this.seance = {dateDebut:new Date(),dateFin:new Date()};
    },(error : any) => {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Veuillez SVP contacter l'administrateur", life: 3000 });
    }
  )

}

confirmClose() {

  this.seanceService.closeSeance(this.seance.id!).subscribe(
    {
      next : (data: ApiResponse) => {
        this.closeSeanceDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Séance fermée avec succès', life: 3000 });
        this.getSeance();
      },
      error : (err : ApiResponse) =>{
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
      }
    }
  )

}

confirmOpen() {

  this.seanceService.openSeance(this.seance.id!).subscribe(
    {
      next : (data: ApiResponse) => {
        this.openSeanceDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Séance ouverte avec succès', life: 3000 });
        this.getSeance();
      },
      error : (err : ApiResponse) =>{
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
      }
    }
  )
}


findIndexById(id: string): number {
  let index = -1;
  for (let i = 0; i < this.seances.length; i++) {
      if (this.seances[i].lieu === id) {
          index = i;
          break;
      }
  }
  return index;
}

onGlobalFilter(table: Table, event: Event) {
  table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
}



//*************************************************************************************************** */

showDialogTpo : boolean = false;
poSeanceDialog(seance: Seance){

  this.idSeance = seance.id!;
  this.showDialogTpo = true;

}

closeDialogTPo(event:any){
  this.showDialogTpo = false;
}

}
