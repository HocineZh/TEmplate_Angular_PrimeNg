import { PermissionService } from './../../service/permission.service';
import { Privilege } from '../../model/permission';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ApiResponse } from 'src/app/shared/models/shared';
import { ConfirmationService, MessageService } from 'primeng/api';


@Component({
  selector: 'app-list-privileges',
  templateUrl: './list-privileges.component.html',
  styleUrls: ['./list-privileges.component.scss']
})
export class ListPrivilegesComponent implements OnInit{
  privileges !: Privilege [] ;
  selectedPrivileges : Privilege[] = [];
  selectedCodePrivileges : string [] = [];
  privilege !: Privilege ;
  popupAddVisible : boolean = false ;
  types  = [{value : 'all' , display : 'Tous'},{value : 'owner' , display : 'Par Société'}];
  submitted : boolean = false ;

  @ViewChild('filter') filter!: ElementRef;


  constructor(private permissionService : PermissionService , private messageService : MessageService , private confirmationService: ConfirmationService ) {}

  ngOnInit(): void {
      this.getAllPrivileges();
  }

  getAllPrivileges (){
    this.permissionService.getAllPrivilege().subscribe (
      {
        next : (data : Privilege[]) => {
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
    this.privilege.type = "all";
    this.submitted = false ;
  }

  //Sauvegarder l'ajout du privilege
  savePrevilege() {
    this.submitted = true;
    if (this.privilege.codePrivilege?.trim()) {
      //Save le changement en edit mode
      if(this.privilege.id) {
        this.permissionService.editPrivilege(this.privilege.id,this.privilege.codePrivilege,this.privilege.description,this.privilege.type).subscribe(
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
        this.permissionService.addPrivilege(this.privilege.codePrivilege,this.privilege.description,this.privilege.type).subscribe(
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

  editPrivilege(privilege : Privilege){
    this.popupAddVisible = true ;
    this.privilege = {...privilege};
    this.submitted = false ;
  }

  //Fermer la boite de dialogue
  hideDialog (){
      this.popupAddVisible = false ;
  }

  deletePrivilege(privilege :Privilege) {
    this.confirmationService.confirm({
      message: '<p></p>Etes vous sur de bien vouloir supprimer ce privilège ?',
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedPrivileges.push(privilege);
        this.selectedCodePrivileges = this.selectedPrivileges.map(a=>a.codePrivilege! + "_" + a.type)
        this.permissionService.deletePrivilege(this.selectedCodePrivileges).subscribe(
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
      message: '<p></p>Etes vous sur de bien vouloir supprimer les privilèges selectionnés ?',
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedCodePrivileges = this.selectedPrivileges.map(a=>a.codePrivilege!+ "_" + a.type)
        console.log(this.selectedCodePrivileges)
        this.permissionService.deletePrivilege(this.selectedCodePrivileges).subscribe(
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
