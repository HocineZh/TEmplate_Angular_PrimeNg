import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from 'src/app/shared/models/shared';
import { Component } from '@angular/core';
import { Modele, Tache } from '../../model/tache.model';
import { MessageService } from 'primeng/api';
import { TacheService } from '../../services/tache.service';



@Component({
  selector: 'app-creer-modele',
  templateUrl: './creer-modele.component.html',
  styleUrls: ['./creer-modele.component.scss']
})
export class CreerModeleComponent {

  modele : Modele= {};
  submitted : boolean = false ;
  properText !: string;
  taches !: Tache[];
  targetTaches : Tache[]=[];

  constructor(private router : Router, private tacheService : TacheService, private route: ActivatedRoute, private messageService: MessageService){}

  ngOnInit(): void {

    if(this.route.snapshot.paramMap.get('id')){
      this.properText = "Modifier le modèle" ;
      let id: number = +this.route.snapshot.paramMap.get('id')!;
      console.log(id);
      
      this.tacheService.getModeleById(id).subscribe({
        next : (reponse : Modele) => {
          console.log(reponse);
          
          this.modele=reponse
          this.targetTaches=reponse.taches as Tache[];
          this.sortByOrdreExecution();
        },
        error : (err : ApiResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
        }
      })
   
    }
    else{
      this.properText = "Ajouter un modèle" ;
    }

    this.getAllTaches()
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

  addModele(){
    this.submitted=true;

    if(this.modele.nom && this.targetTaches){
      if(this.modele.id){
        this.tacheService.updateModele(this.modele.id as number, this.modele.nom as string, this.targetTaches).subscribe({
          next : (reponse : ApiResponse) => {
            this.messageService.add({ severity: 'success', summary: 'Confirmer', detail: reponse.message });     
            this.getAllTaches();
          },
          error : (err : ApiResponse) => {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
          }
        })
      }
      else{
        this.tacheService.addModele(this.modele.nom as string, this.targetTaches).subscribe({
          next : (reponse : ApiResponse) => {
            this.messageService.add({ severity: 'success', summary: 'Confirmer', detail: reponse.message });     
            this.router.navigate(['/taches/modelTaches']);
          },
          error : (err : ApiResponse) => {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
          }
        })
        this.targetTaches=[];
        this.modele={};
        //this.submitted=false;
      }
    } 
  }

  sortByOrdreExecution(){
    this.targetTaches.sort((a : Tache, b : Tache) => a.ordre_execution - b.ordre_execution);
  }
}
