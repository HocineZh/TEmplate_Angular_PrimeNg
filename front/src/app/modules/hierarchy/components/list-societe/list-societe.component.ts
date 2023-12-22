import { HierarchyService } from './../../services/hierarchy.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Societe, Structure } from '../../model/hierarchy';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { ApiResponse } from 'src/app/shared/models/shared';
import { Table } from 'primeng/table';
import { User } from 'src/app/modules/users/model/user';
import { UserService } from 'src/app/modules/users/services/user.service';



interface expandedRows {
  [key: string]: boolean;
}

@Component({
  selector: 'app-list-societe',
  templateUrl: './list-societe.component.html',
  styleUrls: ['./list-societe.component.scss']
})
export class ListSocieteComponent {
  expandedRows: expandedRows = {};
  isExpanded : boolean = false ;

  /****Societe variable ******/
  societes !: Societe [] ;
  societeDialog : boolean =  false ;
  societe !: Societe ;
  submittedSociete : boolean = false ;
  @ViewChild('filter') filter!: ElementRef;
  /*******Structure Variable***********/
  structureDialog : boolean = false ;
  structures !: Structure [];
  structure !: Structure ;
  users : User[] = [];
  selectedStructure !: Structure ;
  submittedStructure : boolean = false ;
  @ViewChild('filterStr') filterStr!: ElementRef;


  /*********************************** */

  constructor(private hierarchyService : HierarchyService , private messageService: MessageService , private confirmationService: ConfirmationService , private userService : UserService) {}


  ngOnInit() {
      this.getAll();
  }

  getAll () {
    this.hierarchyService.getAllSociete().subscribe({
      next : (data : Societe[]) =>{
        this.societes = data ;
      },
      error : (data : ApiResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: data.message })
      }
    })
  }

  /*expandAll() {
    if (!this.isExpanded) {
        this.societes.forEach(societe => societe && societe.code ? this.expandedRows[societe.code] = true : '');

    } else {
        this.expandedRows = {};
    }
    this.isExpanded = !this.isExpanded;
  }*/

  //Lancer le formulaire d'édition
  editSociete (societe : Societe) {
    this.societe = {...societe};
    this.societeDialog = true ;
  }



  //Lancer  le formulaire d'ajout
  addSociete () {
    this.societe = {}
    this.societeDialog = true ;
    this.submittedSociete = false ;
  }

  //Sauvegarder la societe
  saveSociete () {
    this.submittedSociete = true;
    if (this.societe.code?.trim() && this.societe.raisonSocial?.trim() && this.societe.siege?.trim()) {
      if(this.societe.id) {
        this.hierarchyService.editSociete(this.societe.id,this.societe.code , this.societe.raisonSocial , this.societe.siege).subscribe(
          {
            next : (data : ApiResponse) => {
              this.submittedSociete = false;
              this.societeDialog = false ;
              this.messageService.add({ severity: 'success', summary: 'Succès', detail: data.message, life: 3000 });
              window.location.reload();

            },
            error : (err : ApiResponse) => {
              this.submittedSociete = false;
              this.societeDialog = false ;
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message })
            }
          }
        )
        this.societe={};
      }
      else {
        this.hierarchyService.addSociete(this.societe.code , this.societe.raisonSocial , this.societe.siege).subscribe(
          {
            next : (data : ApiResponse) => {
              this.societeDialog = false ;
              this.messageService.add({ severity: 'success', summary: 'Succès', detail: data.message, life: 3000 });
              window.location.reload();
            },
            error : (err : ApiResponse) => {
              this.societeDialog = false ;
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message })
            }
          }
        )
      }
    }
  }

  hideDialogSociete () {
    this.societeDialog = false ;
  }
  //Suppresion d'une socieite
  deleteSociete (societe : Societe) {
    this.confirmationService.confirm({
      message: '<p></p>Etes vous sur de bien vouloir supprimer la société ?</p> <p></p> Ps : Toutes les structure de cette sociétés seront supprimées </p>',
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.hierarchyService.deleteSociete(societe.code!).subscribe(
          {
            next : (data : ApiResponse) => {
              this.societeDialog = false ;
              this.messageService.add({ severity: 'success', summary: 'Succès', detail: data.message, life: 3000 });
              window.location.reload();
            },
            error : (data : ApiResponse) => {
              this.societeDialog = false ;
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: data.message })
            }
          }
        )
      }
    });

  }

  onGlobalFilterSociete(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clearsociete(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  /*************************************************************************************************************************** */
  //Lancer le formulaire d'ajout de structure
  addStructure () {
    this.structure = {} ;
    this.structureDialog = true ;

  }
  hideDialogStructure () {
    this.structureDialog = false ;
  }

  saveStructure () {
    this.submittedStructure = true
    if (this.structure.code?.trim() && this.structure.nom?.trim() && this.structure.societe ) {
      if(this.structure.id ) {
        this.hierarchyService.editStructure(this.structure.id,this.structure.code , this.structure.nom ,this.structure.societe, this.structure.chargeOrientation).subscribe(
          {
            next : (data : ApiResponse) => {
              this.structureDialog = false ;
              this.messageService.add({ severity: 'success', summary: 'Succès', detail: data.message, life: 3000 });
              window.location.reload();
            },
            error : (data : ApiResponse) => {
              this.structureDialog = false ;
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: data.message })
            }
          }
        )
      }else {
        this.hierarchyService.addStructure(this.structure.code , this.structure.nom ,this.structure.societe, this.structure.chargeOrientation).subscribe(
          {
            next : (data : ApiResponse) => {
              this.structureDialog = false ;
              this.messageService.add({ severity: 'success', summary: 'Succès', detail: data.message, life: 3000 });
              window.location.reload();

            },
            error : (data : ApiResponse) => {
              this.structureDialog = false ;
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: data.message })
            }
          }
        )
      }
    }

  }

  editStructure(structure : Structure) {
    this.structureDialog = true ;
    this.structure = {...structure};

    this.userService.getAllUserByStructure(this.structure.id!).subscribe(
      {
        next : (data : User []) => {
          this.users = data ;
        }
      }
    )

  }

  deleteStructure (structure : Structure) {
    this.confirmationService.confirm({
      message: '<p></p>Etes vous sur de bien vouloir supprimer la structure ?</p> <p></p> Ps : Toutes les structure de cette sociétés seront supprimées </p>',
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.hierarchyService.deleteStructure(structure.code!).subscribe(
          {
            next : (data : ApiResponse) => {
              this.societeDialog = false ;
              this.messageService.add({ severity: 'success', summary: 'Succès', detail: data.message, life: 3000 });
              window.location.reload();
            },
            error : (data : ApiResponse) => {
              this.societeDialog = false ;
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: data.message })
            }
          }
        )
      }
    });

  }

  onRowExpand(event : any) {
    if(!event.data.structures) {
      this.hierarchyService.getAllStructureBySociete(event.data.code).subscribe(
        {
          next : (data : Structure[]) => {
            this.societes.find(x=> x.code ===event.data.code)!.structures = data ;
          },
          error : (err : ApiResponse) => {

          }
        }
      )

    }
  }


  onGlobalFilterStructure(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clearStructure(table: Table) {
    table.clear();
    this.filterStr.nativeElement.value = '';
  }
}


