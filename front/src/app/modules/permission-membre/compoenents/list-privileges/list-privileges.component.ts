import { PermissionMembreService } from './../../services/permission-membre.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Privileges } from '../../model/permission-membre';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ApiResponse } from 'src/app/shared/models/shared';

@Component({
  selector: 'app-list-privileges',
  templateUrl: './list-privileges.component.html',
  styleUrls: ['./list-privileges.component.scss']
})
export class ListPrivilegesComponent {

  privileges !: Privileges [] ;
  selectedPrivileges : Privileges[] = [];
  selectedCodePrivileges : string [] = [];
  privilege !: Privileges ;
  popupAddVisible : boolean = false ;
  submitted : boolean = false ;

  @ViewChild('filter') filter!: ElementRef;


  constructor(private permissionMembreService : PermissionMembreService , private messageService : MessageService , private confirmationService: ConfirmationService ) {}

  ngOnInit(): void {
    this.getAllPrivileges();
  }

  getAllPrivileges (){
    this.permissionMembreService.getAllPrivilege().subscribe (
      {
        next : (data : Privileges[]) => {
          this.privileges = data ;
        },
        error : (err : ApiResponse) =>
        {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message })
        }
      }
    )
  }

  //Ouvrir le popup d'ajout du privilege
  addNewPrivilege() {
    this.popupAddVisible = true ;
    this.privilege = {};
    this.privilege.type = "organe";
    this.submitted = false ;
  }

  //Sauvegarder l'ajout du privilege
  savePrevilege() {
    this.submitted = true;
    if (this.privilege.codePriv?.trim()) {
      //Save le changement en edit mode
      if(this.privilege.id) {
        this.permissionMembreService.editPrivilege(this.privilege.id,this.privilege.codePriv,this.privilege.description,"organe").subscribe(
          {
            next : (data : ApiResponse)=> {
              this.messageService.add({ severity: 'success', summary: 'Succès', detail: data.message, life: 3000 });
              this.popupAddVisible = false ;
              this.getAllPrivileges();
            },
            error : (err : ApiResponse) => {
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
              this.getAllPrivileges();
            }
          }
        )
      }
      //Save le changement en add mode
      else {
        this.permissionMembreService.addPrivilege(this.privilege.codePriv,this.privilege.description,"organe").subscribe(
          {
            next : (data : ApiResponse)=> {
              this.messageService.add({ severity: 'success', summary: 'Succès', detail: data.message, life: 3000 });
              this.popupAddVisible = false ;
              this.getAllPrivileges();
            },
            error : (err : ApiResponse) => {
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
              this.getAllPrivileges();
            }
          }
        )
      }
    }
  }

  //Lander le popup de l'edit
  editPrivilege(privilege : Privileges){
    this.popupAddVisible = true ;
    this.privilege = {...privilege};
    this.submitted = false ;
  }

  //Fermer la boite de dialogue
  hideDialog (){
    this.popupAddVisible = false ;
  }

  deletePrivilege(privilege :Privileges) {
    this.confirmationService.confirm({
      message: '<p></p>Etes vous sur de bien vouloir supprimer ce privilège ?',
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedPrivileges.push(privilege);
        this.selectedCodePrivileges = this.selectedPrivileges.map(a=>a.codePriv!)
        this.permissionMembreService.deletePrivilege(this.selectedCodePrivileges).subscribe(
          {
            next : (data : ApiResponse) => {
              this.messageService.add({ severity: 'success', summary: 'Succès', detail: data.message, life: 3000 });
              this.getAllPrivileges();
              this.selectedPrivileges= [] ;
              this.selectedCodePrivileges = [];
            },
            error : (data : ApiResponse) => {
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: data.message })
              this.selectedPrivileges= [] ;
              this.selectedCodePrivileges = [];
            }
          }
        )
      }
    });
  }

  deleteSelectedPrivilege() {
    this.confirmationService.confirm({
      message: '<p></p>Etes vous sur de bien vouloir supprimer les privilèges selectionner ?',
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedCodePrivileges = this.selectedPrivileges.map(a=>a.codePriv!)
        this.permissionMembreService.deletePrivilege(this.selectedCodePrivileges).subscribe(
          {
            next : (data : ApiResponse) => {
              this.messageService.add({ severity: 'success', summary: 'Succès', detail: data.message, life: 3000 });
              this.getAllPrivileges();
              this.selectedPrivileges= [] ;
              this.selectedCodePrivileges = [];
            },
            error : (data : ApiResponse) => {
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: data.message })
              this.selectedPrivileges= [] ;
              this.selectedCodePrivileges = [];
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


}
