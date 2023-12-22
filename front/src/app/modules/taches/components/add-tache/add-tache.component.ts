import { ApiResponse } from 'src/app/shared/models/shared';
import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { TacheService } from '../../services/tache.service'
import { Tache } from '../../model/tache.model';
import { EventBusService } from 'src/app/shared/services/event-bus.service';



@Component({
  selector: 'app-add-tache',
  templateUrl: './add-tache.component.html',
  styleUrls: ['./add-tache.component.scss']
})
export class AddTacheComponent {

  submitted : boolean= false;
  visible : boolean = false;
  visibleModification : boolean = false;
  taches !: Tache[];
  selectedTaches : Tache[]=[];
  minDate : Date = new Date ();
  tacheForm : FormGroup= new FormGroup({
    id : new FormControl(),
    nom : new FormControl(),
    description : new FormControl()
  });

  modifForm : FormGroup= new FormGroup({
    id : new FormControl(),
    nom : new FormControl(),
    description : new FormControl()
  });

  rowsPerPageOptions = [5, 10, 20];

  hasTheRightPrivilege : boolean;

  @ViewChild('filter') filter!: ElementRef;


  constructor(private tacheService : TacheService, private messageService: MessageService, private formBuilder : FormBuilder, private confirmationService: ConfirmationService, private eventBusService : EventBusService) {
    (this.eventBusService.hasPrivilges(['parametrage.tache.delete']) || this.eventBusService.hasPrivilges(['parametrage.tache.update'])) ? this.hasTheRightPrivilege=true : this.hasTheRightPrivilege=false;

  }

  ngOnInit(): void {
    this.getAllTaches();
    this.tacheForm = this.formBuilder.group({
      id : '',
      nom : ['',[Validators.required]],
      description : ['',[Validators.required]]
    })
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  public getAllTaches(){
    this.tacheService.getAllTaches().subscribe({
      next : (reponse : Tache[]) => {

        this.taches=reponse
      },
      error : (err : ApiResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
      }
    })
  }

  public addTache(){

    this.submitted=true;
    if(this.tacheForm.get('nom')?.value){
      this.tacheService.createTache(this.tacheForm.get('nom')?.value, this.tacheForm.get('description')?.value).subscribe({
        next : (reponse : ApiResponse) => {

          this.messageService.add({ severity: 'success', summary: 'Confirmer', detail: reponse.message });
          this.visible=false;
          this.submitted=false;
          this.getAllTaches();
        },
        error : (err : ApiResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
        }
      })

      this.tacheForm = this.formBuilder.group({
        id : '',
        nom : ['',[Validators.required]],
        description : ['',[Validators.required]]
      });
    }
  }

  public showDialog(){
    this.visible=true
  }

  public modifTache(){
    this.visibleModification= true
    this.submitted=true;

    if(this.modifForm.get('nom')?.value){
      this.tacheService.updateTache(this.modifForm.get('id')?.value, this.modifForm.get('nom')?.value, this.modifForm.get('description')?.value).subscribe({
        next : (reponse : ApiResponse) => {

          this.messageService.add({ severity: 'success', summary: 'Confirmer', detail: reponse.message });
          this.submitted=false;
          this.visibleModification=false;
          this.getAllTaches();
        },
        error : (err : ApiResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
        }
      })
    }
  }

  public showModifDialog(tache : Tache){
    this.modifForm.setValue({
      id : tache.id,
      nom : tache.nom,
      description : tache.description
    })
    this.visibleModification=true
  }

  public delete(tache : Tache){
    this.selectedTaches.push(tache);
    this.deleteSelectedTaches();
  }

  public deleteSelectedTaches() {

    let ids: number[] = this.selectedTaches.map((tache) => tache.id as number);

    this.confirmationService.confirm({
          message: '<p>Etes vous sûr de bien vouloir supprimer ce(s) tâche(s) ?</p>',
          header: 'Confirmation de suppression',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.tacheService.deleteTache(ids).subscribe({
              next : (reponse : ApiResponse) => {
                this.messageService.add({ severity: 'success', summary: 'Confirmer', detail: reponse.message });
                this.getAllTaches();
              },
              error : (err : ApiResponse) => {
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
              }
            })
    }});

    this.selectedTaches=[];
  }


  validateOrdre(){
    let listOrdonee = this.taches.map((item, index) => ({
      id: item.id,
      ordre: index + 1,
    }));
    this.tacheService.setOrder(listOrdonee).subscribe({
      next : (reponse : ApiResponse) => {
        this.messageService.add({ severity: 'success', summary: 'Confirmer', detail: reponse.message });
      },
      error : (err : ApiResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
      }
    })
  }
}
