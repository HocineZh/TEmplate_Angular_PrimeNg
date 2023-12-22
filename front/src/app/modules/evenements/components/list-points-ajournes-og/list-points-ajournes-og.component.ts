import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ElementRef, ViewChild } from '@angular/core';
import { ApiResponse } from 'src/app/shared/models/shared';
import { ConfirmationService, MenuItem, Message, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { Menu } from 'primeng/menu';
import { PointOrdreService } from '../../services/pointOrdre.service';
@Component({
  selector: 'app-list-points-ajournes-og',
  templateUrl: './list-points-ajournes-og.component.html',
  styleUrls: ['./list-points-ajournes-og.component.scss']
})
export class ListPointsAjournesOgComponent {

  @Input() selectedEvenement : any;
  @Output() closeDialogEvent = new EventEmitter<any>();
  @Output() importerPoAjournerEvent = new EventEmitter<any>();

  titreDialog:string ='Liste des points ajournés';
  points_ajournes !: any[] ;
  selected_pointsAjn: any[] = [] ;
  @ViewChild('filter') filter!: ElementRef;

  showDlg :boolean = true;
  errorMessage  : Message[] = [];

 


  constructor(private pointOrdreService : PointOrdreService, private messageService : MessageService , private router : Router , private confirmationService: ConfirmationService ) {}

  ngOnInit(): void {

    this.showDlg = true;
    
    this.getAllPointsAjournes();

  }

  getAllPointsAjournes() {
    
    this.pointOrdreService.getListPoAjournesPreviousEvenements(this.selectedEvenement.id).subscribe(
      {
        next : (data : any)=> {
          console.log(data);
          this.points_ajournes = data ;
        },
        error : (err : any) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
        }
      }
    )    
  }

  retirerPointAjourner(selectedPointAjn :any) {

   
    this.confirmationService.confirm({
      message: "<p></p>Etes vous sur de bien vouloir retirer ce point de la liste et ne plus l'afficher ?",
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        
        this.selected_pointsAjn = [];
        this.selected_pointsAjn.push(selectedPointAjn.id);       
        
        this.pointOrdreService.retirerPointsAjournes(this.selected_pointsAjn).subscribe(
          {
            next : (data : ApiResponse) => {
              this.messageService.add({ severity: 'success', summary: 'Succès', detail: "Le point a été retiré avec succés.", life: 3000 });
              
              this.points_ajournes = this.points_ajournes.filter(i => i.id.toString() !== selectedPointAjn.id.toString());
              this.selected_pointsAjn = [] ;
            },
            error : (data : ApiResponse) => {
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: data.message });     
              this.selected_pointsAjn= [] ;         
              
            }
          }
        )
      }
    });
  }

  retirerSelectedPointsAjournes(){
    this.confirmationService.confirm({
      message: "<p></p>Etes vous sur de bien vouloir retirer les points séléctionnes de la liste et ne plus les affichés ?",
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
       
        let listToDelete : number[] = this.selected_pointsAjn.map((spa:any) =>  {return spa.id;});      
        
        this.pointOrdreService.retirerPointsAjournes(listToDelete).subscribe(
          {
            next : (data : any) => {
              let succesMessage = "Un point a été retiré avec succes.";
              
              if(data.length >1){
              console.log(data);
              succesMessage = data.length + " points ont été retirés avec succes.";
              }
                 
              this.messageService.add({ severity: 'success', summary: 'Succès', detail: succesMessage , life: 3000 });
              
              this.points_ajournes = this.points_ajournes.filter(i => !data.includes(parseInt(i.id)));
              this.selected_pointsAjn= [] ;
            },
            error : (data : ApiResponse) => {
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: data.message })
              this.selected_pointsAjn= [] ;
            }
          }
        )
      }
    });

  }


  importerPointAjourner(selectedPointAjn :any){

    this.confirmationService.confirm({
      message: "<p></p>Etes vous sur de bien vouloir importer ce point vers l'ordre du jour de l'évènement ?",
      header: "Confirmation de l'action",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
      
        this.pointOrdreService.importerPointAjournerToEvenement(this.selectedEvenement.id, selectedPointAjn.id ).subscribe(
          {
            next : (data : ApiResponse) => {
              this.messageService.add({ severity: 'success', summary: 'Succès', detail: "Le point ordre a été importer avec succés.", life: 3000 });              
              this.points_ajournes = this.points_ajournes.filter(i => i.id.toString() !== selectedPointAjn.id.toString());
              
              //mettre a jour la liste points ordres du jour
              this.importerPoAjournerEvent.emit(true);
              
              
            },
            error : (data : ApiResponse) => {
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: data.message });   
            }
          }
        )

      
      }
    });

  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }



  handleExitDialogPropositionsMemebres(){

    this.showDlg =!this.showDlg;
    this.closeDialogEvent.emit(this.points_ajournes.length);
  }




}
