import { PermissionMembreService } from './../../services/permission-membre.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Profil } from '../../model/permission-membre';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ApiResponse } from 'src/app/shared/models/shared';

@Component({
  selector: 'app-list-profil',
  templateUrl: './list-profil.component.html',
  styleUrls: ['./list-profil.component.scss']
})
export class ListProfilComponent {
  profils !: Profil[] ;
  selectedProfils : Profil [] = [] ;
  selectedCodeProfil : string [] = [];
  @ViewChild('filter') filter!: ElementRef;

  constructor(private permissionMembreService : PermissionMembreService , private messageService : MessageService , private router : Router , private confirmationService: ConfirmationService ) {}


  ngOnInit(): void {
    this.getAllProfil();
  }

  getAllProfil() {
    this.permissionMembreService.getAllProfil().subscribe(
      {
        next : (data : Profil[])=> {
          this.profils = data ;
        },
        error : (err : ApiResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
        }
      }
    )
  }

  addNewProfil() {
    this.router.navigate(['/permission_membre/add-profil']);
  }

  editProfil(profil : Profil) {
    this.router.navigate(["/permission_membre/add-profil",profil.id])
  }

  deleteProfil(role : Profil) {
    this.confirmationService.confirm({
      message: '<p></p>Etes vous sur de bien vouloir supprimer ce profil ?',
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedProfils.push(role);
        this.selectedCodeProfil = this.selectedProfils.map(a=>a.nom!)
        this.permissionMembreService.deleteProfil(this.selectedCodeProfil).subscribe(
          {
            next : (data : ApiResponse) => {
              this.messageService.add({ severity: 'success', summary: 'Succès', detail: data.message, life: 3000 });
              this.getAllProfil();
              this.selectedProfils= [] ;
              this.selectedCodeProfil = [];
            },
            error : (data : ApiResponse) => {
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: data.message })
              this.selectedProfils= [] ;
              this.selectedCodeProfil = [];
            }
          }
        )
      }
    });
  }

  deleteSelectedProfil(){
    this.confirmationService.confirm({
      message: '<p></p>Etes vous sur de bien vouloir supprimer les profils selectionnés ?',
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedCodeProfil = this.selectedProfils.map(a=>a.nom!)
        this.permissionMembreService.deleteProfil(this.selectedCodeProfil).subscribe(
          {
            next : (data : ApiResponse) => {
              this.messageService.add({ severity: 'success', summary: 'Succès', detail: data.message, life: 3000 });
              this.getAllProfil();
              this.selectedProfils= [] ;
              this.selectedCodeProfil = [];
            },
            error : (data : ApiResponse) => {
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: data.message })
              this.selectedProfils= [] ;
              this.selectedCodeProfil = [];
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
