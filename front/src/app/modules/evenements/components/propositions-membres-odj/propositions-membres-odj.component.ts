import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ElementRef, ViewChild } from '@angular/core';
import { ApiResponse } from 'src/app/shared/models/shared';
import { ConfirmationService, MenuItem, Message, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { PropositionsMembresService } from '../../services/propositions_membres.service';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-propositions-membres-odj',
  templateUrl: './propositions-membres-odj.component.html',
  styleUrls: ['./propositions-membres-odj.component.scss']
})
export class PropositionsMembresOdjComponent {

  @Input() selectedEvenement : any;
  @Input() listAll : boolean = false;
  @Output() closeDialogEvent = new EventEmitter<any>();
  @Output() validatedPPOEvent = new EventEmitter<any>();

  titreDialog:string ='Mes propositions';
  propositions_membres !: any[] ;
  selected_propositions : any[] = [] ;
  @ViewChild('filter') filter!: ElementRef;

  showDlg :boolean = true;
  errorMessage  : Message[] = [];


  //Dialog edit proposition
  editDialogType ='new';
  headerEditDialog = "Nouvelle proposition";
  editDialogVisible = false;
  selectedProposition : any;
  proposition :any ={titre : '', description : ''};
  menuItems: MenuItem[] = [];
  @ViewChild('menu') menu!: Menu;

  constructor(private propMembresService : PropositionsMembresService,  private messageService : MessageService , private router : Router , private confirmationService: ConfirmationService ) {}
 
  ngOnInit(): void {

    this.showDlg = true;
    
    this.getAllPropositions();

    
    if(this.listAll)
      this.titreDialog = 'Propositions des membres';
  
  }

  toggleMenu(event: Event, proposition: any) {
   
    this.selectedProposition = proposition;

    //Traitement affichage actions selon etat proposition
    if(this.listAll){
      let itemEnCours = false;
      let itemValider = false;
      let itemRejeter = false;
      
      switch(this.selectedProposition.etatProposition)
      {
        case 'PROPOSER' :  
           itemEnCours = true;
           itemValider = true;
           itemRejeter = true;
          break;
        case 'EN COURS' :
           itemValider = true;
           itemRejeter = true;
          break;
        case 'VALIDER' :         
          break;
        case 'REJETER' :          
          break;
       
      }

      this.menuItems = [
        { label: 'En cours', icon: 'pi pi-spinner', disabled : !itemEnCours ,  command: () => this.changerEtatProposition("en cours")},
        { label: 'Valider', icon: 'pi pi-check-square',disabled : !itemValider, command: () => this.changerEtatProposition("valider")},
        { label: 'Rejeter', icon: 'pi pi-times',disabled : !itemRejeter, command: () => this.changerEtatProposition("rejeter")}     
        ];

    }else{

      let itemEdit = this.selectedProposition.etatProposition === 'PROPOSER';
      
      this.menuItems = [
        { label: 'Modifier', icon: 'pi pi-pencil',disabled : !itemEdit, command: () => this.editProposition()},
        { label: 'Supprimer', icon: 'pi pi-trash',disabled : !itemEdit, command: () => this.deleteProposition()}     
        ];

    }
    this.menu.toggle(event);
  }

  getAllPropositions() {
    
    this.propMembresService.getListPropositionsPoEvenement(this.selectedEvenement.id).subscribe(
      {
        next : (data : any)=> {
          console.log(data);
          this.propositions_membres = data ;
        },
        error : (err : any) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
        }
      }
    )    
  }

  addNewProposition() {
    this.editDialogVisible = true;
    this.editDialogType ='new';
    this.headerEditDialog = "Nouvelle proposition";
    this.proposition = {titre : '', description : ''};

  }
  

  editProposition() {
    this.editDialogVisible = true;
    this.editDialogType ='edit';
    this.headerEditDialog = "Modifier la proposition";
    this.proposition = {...this.selectedProposition};
   
  }

  saveEditProposition(){
    if(this.editDialogType ==='new'){
     
      this.propMembresService.addPropositionPoToEvenement(this.selectedEvenement.id, this.proposition).subscribe(
        {
          next : (data : any)=> {
            this.editDialogVisible = false;
            this.propositions_membres.push(data);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Proposition ajoutée avec success.' }) ;
          },
          error : (err : any) => {
            this.errorMessage = [{ severity: 'error', summary: 'Erreur :', detail: err.message }];
          }
        });
    }else
    {
      this.propMembresService.updatePropositionPoEvenement(this.selectedEvenement.id, this.proposition).subscribe(
        {
          next : (data : any)=> {
            this.editDialogVisible = false;
            //Replace modified proposition
            const objectToReplace = this.propositions_membres.find(arrayItem => arrayItem.id === this.proposition.id);
            Object.assign(objectToReplace, this.proposition);
            
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Proposition modifiée avec success.' }) ;
          },
          error : (err : any) => {
            this.errorMessage = [{ severity: 'error', summary: 'Erreur :', detail: err.message }];
          }
        });
    }

  }

  cancelEditProposition(){
    this.editDialogVisible = false;
  }

  deleteProposition() {

    if(this.selectedProposition.etatProposition !== "PROPOSER" ){
       this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Etat de de la proposition ne permet pas sa suppression !" });
       return;
    }

    this.confirmationService.confirm({
      message: '<p></p>Etes vous sur de bien vouloir supprimer cette proposition ?',
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        
        this.selected_propositions = [];
        this.selected_propositions.push(this.selectedProposition.id);       
        
        this.propMembresService.deletePropositionsPoEvenement(this.selectedEvenement.id, this.selected_propositions).subscribe(
          {
            next : (data : ApiResponse) => {
              this.messageService.add({ severity: 'success', summary: 'Succès', detail: "La proposition a été supprimer avec succés.", life: 3000 });
              
              this.propositions_membres = this.propositions_membres.filter(i => i.id.toString() !== this.selectedProposition.id.toString());
              this.selected_propositions= [] ;
            },
            error : (data : ApiResponse) => {
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: data.message });     
              this.selected_propositions= [] ;         
              
            }
          }
        )
      }
    });
  }

  deleteSelectedProposition(){
    this.confirmationService.confirm({
      message: '<p></p>Etes vous sur de bien vouloir supprimer les propositions selectionnées ?',
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
       
        let listToDelete : number[] = this.selected_propositions.map((spo:any) =>  {return spo.id;});      
        
        this.propMembresService.deletePropositionsPoEvenement(this.selectedEvenement.id, listToDelete).subscribe(
          {
            next : (data : any) => {
              let succesMessage = "1 proposition a été supprimée avec succes.";
              
              if(data.length >1){
              console.log(data);
              succesMessage = data.length + " propositions ont été supprimées avec succes.";
              }
                 
              this.messageService.add({ severity: 'success', summary: 'Succès', detail: succesMessage , life: 3000 });
              
              this.propositions_membres = this.propositions_membres.filter(i => !data.includes(parseInt(i.id)));
              this.selected_propositions= [] ;
            },
            error : (data : ApiResponse) => {
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: data.message })
              this.selected_propositions= [] ;
            }
          }
        )
      }
    });

  }

  changerEtatProposition(etat:string){

    this.confirmationService.confirm({
      message: "<p></p>Etes vous sur de bien vouloir changer l'état de la proposition du membre ?",
      header: "Confirmation de l'action",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
      
        this.propMembresService.changerEtatPropositionPoEvenement(this.selectedEvenement.id, this.selectedProposition.id, etat ).subscribe(
          {
            next : (data : ApiResponse) => {
              this.messageService.add({ severity: 'success', summary: 'Succès', detail: "L'état de la proposition a été changé avec succés.", life: 3000 });              
              this.getAllPropositions();
              if(etat === 'valider'){
                //mettre a jour la liste points ordres
                this.validatedPPOEvent.emit(true);
              }
              
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
    this.closeDialogEvent.emit(this.propositions_membres?.length);
  }

}
