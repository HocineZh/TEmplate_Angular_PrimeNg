import { Component, ElementRef, ViewChild } from '@angular/core';
import { Role } from '../../model/permission';
import { PermissionService } from '../../service/permission.service';
import { ApiResponse } from 'src/app/shared/models/shared';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-roles.component.html',
  styleUrls: ['./list-roles.component.scss']
})
export class ListRolesComponent {
  roles !: Role[] ;
  selectedRoles : Role [] = [] ;
  selectedCodeRoles : string [] = [];
  @ViewChild('filter') filter!: ElementRef;

  constructor(private permissionService : PermissionService , private messageService : MessageService , private router : Router , private confirmationService: ConfirmationService ) {}


  ngOnInit(): void {
    this.getAllRole();
  }

  getAllRole() {
    this.permissionService.getAllRole().subscribe(
      {
        next : (data : Role[])=> {
          this.roles = data ;
        },
        error : (err : ApiResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
        }
      }
    )
  }

  addNewRole() {
    this.router.navigate(['/roles/addRole'])
  }

  editRole(role : Role) {
    this.router.navigate(["/roles/addRole",role.id])
  }

  deleteRole(role : Role) {
    this.confirmationService.confirm({
      message: '<p></p>Etes vous sur de bien vouloir supprimer ce privilège ?',
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedRoles.push(role);
        this.selectedCodeRoles = this.selectedRoles.map(a=>a.nom!)
        this.permissionService.deleteRole(this.selectedCodeRoles).subscribe(
          {
            next : (data : ApiResponse) => {
              this.messageService.add({ severity: 'success', summary: 'Succès', detail: data.message, life: 3000 });
              this.getAllRole();
              this.selectedRoles= [] ;
              this.selectedCodeRoles = [];
            },
            error : (data : ApiResponse) => {
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: data.message })
              this.selectedRoles= [] ;
              this.selectedCodeRoles = [];
            }
          }
        )
      }
    });
  }

  deleteSelectedRole(){
    this.confirmationService.confirm({
      message: '<p></p>Etes vous sur de bien vouloir supprimer les privilèges selectionner ?',
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedCodeRoles = this.selectedRoles.map(a=>a.nom!)
        this.permissionService.deleteRole(this.selectedCodeRoles).subscribe(
          {
            next : (data : ApiResponse) => {
              this.messageService.add({ severity: 'success', summary: 'Succès', detail: data.message, life: 3000 });
              this.getAllRole();
              this.selectedRoles= [] ;
              this.selectedCodeRoles = [];
            },
            error : (data : ApiResponse) => {
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: data.message })
              this.selectedRoles= [] ;
              this.selectedCodeRoles = [];
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
