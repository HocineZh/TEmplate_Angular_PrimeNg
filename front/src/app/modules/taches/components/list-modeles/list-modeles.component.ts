import { Component, ElementRef, ViewChild  } from '@angular/core';
import { Modele } from '../../model/tache.model';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { TacheService } from '../../services/tache.service';
import { ApiResponse } from 'src/app/shared/models/shared';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EventBusService } from 'src/app/shared/services/event-bus.service';

@Component({
  selector: 'app-list-modeles',
  templateUrl: './list-modeles.component.html',
  styleUrls: ['./list-modeles.component.scss']
})
export class ListModelesComponent {

  modeles !: Modele[];
  selectedModeles : Modele[]=[];
  hasTheRightPrivilege : boolean;
  @ViewChild('filter') filter!: ElementRef;

  constructor(private tacheService : TacheService, private router : Router, private messageService: MessageService, private confirmationService: ConfirmationService, private eventBusService: EventBusService){
    (this.eventBusService.hasPrivilges(['parametrage.tache.delete']) || this.eventBusService.hasPrivilges(['parametrage.tache.update'])) ? this.hasTheRightPrivilege=true : this.hasTheRightPrivilege=false;
  }

  ngOnInit(): void {
    this.getAllModeles();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  public addModele(){
    this.router.navigate(['/taches/creerModele'])
  }

  public getAllModeles(){
    this.tacheService.getAllModeles().subscribe({
      next : (reponse : Modele[]) => {
        this.modeles=reponse
      },
      error : (err : ApiResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
      }
    })
  }

  public deleteSelectedModele(){

    let ids: number[] = this.selectedModeles.map((modele) => modele.id as number);

    this.confirmationService.confirm({
        message: '<p>Etes vous sûr de bien vouloir supprimer ce(s) modèle(s) ?</p>',
        header: 'Confirmation de suppression',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
         
          this.tacheService.deleteModele(ids).subscribe({
            next : (reponse : ApiResponse) => {
              this.messageService.add({ severity: 'success', summary: 'Confirmer', detail: reponse.message });     
              this.getAllModeles();
            },
            error : (err : ApiResponse) => {
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
            }
          })
        }
      });

      this.selectedModeles=[];
  }

  public editModele(modele : Modele){
    this.router.navigate(['/taches/creerModele', modele.id]);
  }

  public deleteModele(modele : Modele){
    this.selectedModeles.push(modele);
    this.deleteSelectedModele();
  }
}
