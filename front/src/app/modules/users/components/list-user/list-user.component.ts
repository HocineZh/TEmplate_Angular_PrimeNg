import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from '../../model/user';
import { Router } from '@angular/router';
import { ApiResponse } from 'src/app/shared/models/shared';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styles: [`
    :host ::ng-deep .p-timeline-event-opposite {
        flex: 0;
        padding: 0 !important;
    }
`,]
})
export class ListUserComponent {

  users: User[] = [];


  selectedUsers: User[] = [];

  submitted: boolean = false;



  statuses: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  @ViewChild('filter') filter!: ElementRef;



  constructor(private userService : UserService , private messageService: MessageService , private router : Router , private confirmationService : ConfirmationService) {
    this.statuses = [{label:'Active' , value : 1},{label : 'Desactive' , value : 0}]
  }


  ngOnInit() {
    this.getAllUser();
  }

  getAllUser() {
    this.userService.getAlluser().subscribe(
      {
        next : (data: User[]) => {
          this.users = data ;
        },
        error : (err : ApiResponse)=> {
        }
      }
    )
  }
  addNewUser() {
    this.router.navigate(['/users/addUser'])
  }


  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }


  //Click event pour aller à la page de modification de l'utilisateur
  editUser(user: User) {
    this.router.navigate(['/users/editUser/'+user.id]);
  }

  //Click event pour regénere un nouveau token de confirmation
  refreshToken(user: User) {
    this.confirmationService.confirm({
      message: "Etes vous sure de vouloire régenerer un nouveau token? le compte d e l'utilisateur sera désactiver jusqu'à l'introduction du nouveau mot de passe.",
      header: 'Confirmation de désactivation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let statut = user.active == 1 ? 0 : 1 ;
        this.userService.refreshTokenuser(user.login!).subscribe(
          {
            next : (data : ApiResponse) => {
              this.messageService.add({ severity: 'success', summary: 'Confirmer', detail: data.message });
              this.getAllUser();
            },
            error : (err : ApiResponse)=> {
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
              this.getAllUser();
            }
          }
        )


      },
      reject : () =>{
        this.getAllUser();
      }

      }
    )
  }

  //Click pour activer ou desactiver l'utilisateur
  modifStatut(user: User) {
    let message = user.active == 1 ? "Etes vous sure de désactiver cet utilisateur ?" : "Etes vous sure d'activer cet utilisateur ?"
    this.confirmationService.confirm({
      message: message,
      header: 'Confirmation de désactivation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let statut = user.active == 1 ? 0 : 1 ;
        this.userService.editStatutUser(user.id!,statut).subscribe(
          {
            next : (data : ApiResponse) => {
              this.messageService.add({ severity: 'success', summary: 'Confirmer', detail: data.message });
              this.getAllUser();
            },
            error : (err : ApiResponse)=> {
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
              this.getAllUser();
            }
          }
        )


      },
      reject : () =>{
        this.getAllUser();
      }

      }
    );
  }


  visualiser(user : User) {
    this.router.navigate(['/users/visualise/'+user.id]);
  }
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }


}
