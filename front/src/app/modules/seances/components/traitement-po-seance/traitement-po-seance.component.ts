import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, Message, MessageService } from 'primeng/api';
import { PointOrdreService } from '../../../evenements/services/pointOrdre.service';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { ApiResponse } from 'src/app/shared/models/shared';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-traitement-po-seance',
  templateUrl: './traitement-po-seance.component.html',
  styleUrls: ['./traitement-po-seance.component.scss']
})
export class TraitementPoSeanceComponent {

  @Input() idSeance : any;
  @Output() closeDialogTpo = new EventEmitter<any>();

  titreDialog:string ='Liste des points ordres de la séance';
  points_seance !: any[];
  selectedTPo : any;
  
  @ViewChild('filter') filter!: ElementRef;
  
  showDlg :boolean = true;
  errorMessage  : Message[] = [];

  @ViewChild('menu') menu!: Menu;
  menuItems: MenuItem[] = [
    { label: 'Traiter', icon: 'pi pi-check-square',  command: () => this.changerEtatTraitementPo("TRAITER")},
    { label: 'Ajourner', icon:'pi pi-spinner', command: () => this.changerEtatTraitementPo("AJOURNER")},
    { label: 'Annuler', icon: 'pi pi-times', command: () => this.changerEtatTraitementPo("ANNULER")}     
    ];
  
  constructor(private pointOrdreService : PointOrdreService, private messageService : MessageService , private router : Router , private confirmationService: ConfirmationService ) {}

  ngOnInit(): void {

    this.showDlg = true;
    
    this.getAllPointsSeance();

  }

  getAllPointsSeance() {
    
    this.pointOrdreService.getListPoSeance(this.idSeance).subscribe(
      {
        next : (data : any)=> {
          console.log(data);
          this.points_seance = data ;
        },
        error : (err : any) => {
          this.messageService.add({ key : 'tstTPoSeance', severity: 'error', summary: 'Erreur', detail: err.message }) ;
        }
      }
    )    
  }


  toggleMenu(event: Event, poSeance: any) {
   
    this.selectedTPo = poSeance;

    this.menu.toggle(event);
  }

  changerEtatTraitementPo(etat:string){

    console.log(this.selectedTPo);

    this.confirmationService.confirm({
      message: "<p></p>Etes vous sur de bien vouloir changer l'état du traitement du point ordre?",
      header: "Confirmation de l'action",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
      
        this.pointOrdreService.changerEtatPoSeance(this.idSeance, this.selectedTPo.id, etat ).subscribe(
          {
            next : (data : any) => {

              this.selectedTPo.etatTraitement = etat;
              this.messageService.add({ key : 'tstTPoSeance', severity: 'success', summary: 'Succès', detail: "L'état du traitement du point ordre a été modifié avec succés.", life: 3000 });              
                                        
            },
            error : (data : any) => {
              this.messageService.add({ key : 'tstTPoSeance', severity: 'error', summary: 'Erreur', detail: data.message });   
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

  handleExitDialog(){

    this.showDlg = !this.showDlg;
    this.closeDialogTpo.emit("");
  }


}
