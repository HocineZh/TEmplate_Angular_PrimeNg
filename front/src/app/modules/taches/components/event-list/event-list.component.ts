import { Component, ElementRef, ViewChild } from '@angular/core';
import { EventBusService } from 'src/app/shared/services/event-bus.service';
import { Table } from 'primeng/table';
import { TacheService } from '../../services/tache.service';
import { ApiResponse } from 'src/app/shared/models/shared';
import { MessageService } from 'primeng/api';
import { EventResponse, TacheReponse } from '../../model/tache.model';
import { Router } from '@angular/router';
import { UserInfoResponse } from 'src/app/modules/authentication/model/login';


@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent {

  taches !: TacheReponse[];
  selectedEvent !: TacheReponse;
  events !: EventResponse[];
  currentUserId !: number;

  @ViewChild('filter') filter!: ElementRef;

  constructor(private eventBusService: EventBusService, private tacheService: TacheService, private messageService : MessageService, private router: Router){
    this.eventBusService.getCurrentUser().subscribe((reponse: UserInfoResponse) =>{
      this.currentUserId = reponse.id as number;
    })
  }

  ngOnInit(): void {
    this.getAllEventByUser();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  getAllEventByUser(){
    this.tacheService.getAllEventsByUser(this.currentUserId).subscribe({
      next : (reponse : EventResponse[]) => {
        this.events=reponse;
        this.getAllTachesEnCours();
   },
   error : (err : ApiResponse) => {
       this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
   }
    })
  }


  getAllTachesEnCours(){
    let ids : number[] = this.events.map((event : EventResponse) => event.id);
    this.tacheService.getAllTachesEnCours(ids).subscribe({
      next : (reponse : TacheReponse[]) => {
        this.taches=reponse;
        
   },
      error : (err : ApiResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
   }
    })
  }

  toEvent(){
    this.router.navigate(['/taches/kan', this.selectedEvent.id]);
  }
}
