import { Component, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Organe} from 'src/app/modules/organes/model/organe';
import { OrganeService } from './../../services/organe.service';
import { Router } from '@angular/router';
import { ApiResponse } from 'src/app/shared/models/shared';

interface expandedRows {
  [key: string]: boolean;
}
@Component({
  selector: 'app-list-organe',
  templateUrl: './list-organe.component.html',
  styleUrls: ['./list-organe.component.scss'],
  providers: [MessageService,  ConfirmationService]
})

export class ListOrganeComponent {
  @ViewChild("test") test !: ElementRef
  organeDialog: boolean = false;

  deleteOrganeDialog: boolean = false;

  deleteOrganesDialog: boolean = false;

  organes: Organe[] = [];

  organe: Organe = {};

  selectedOrganes: Organe[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  @ViewChild('filter') filter!: ElementRef;

    constructor(private organeService: OrganeService, private messageService: MessageService,private router : Router ,private confirmationService: ConfirmationService) {
    }

    ngOnInit() {

        this.organeService.getAllOrgane().subscribe(
          {
            next : (data : Organe[]) => {
              this.organes = data ;
            }
          }
        )
      this.cols = [
          { field: 'organe', header: 'Organe' },
          { field: 'titre', header: 'titre' },
          { field: 'description', header: 'description'},
          { field: 'typeOrgane', header: 'typeOrgane' },
          { field: 'societe', header: 'societe' }
      ];

    }



    openNew() {
      this.router.navigate(['/organes/addOrgane']) ;
    }

    deleteSelectedOrganes() {
        this.deleteOrganesDialog = true;
    }

    editOrgane(organe: Organe) {
      this.router.navigate(['/organes/editOrgane/'+organe.id]);
    }

    deleteOrgane(organe: Organe) {
        this.deleteOrganeDialog = true;
        this.organe = { ...organe };
    }

    listMembres(organe: Organe) {
      this.router.navigate(["/membres/listMembres",organe.id]);
    }


  confirmDelete() {
    this.organeService.deleteOrgane(this.organe.id!).subscribe(
      {
        next : (data : ApiResponse) => {
          this.deleteOrganeDialog = false;
          this.organes = this.organes.filter(val => val.id !== this.organe.id);
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Organe supprimé avec succès', life: 3000 });
          this.organe = {};
        },
        error : (err : ApiResponse)=> {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Vous ne pouvez pas supprimer cet organe', life: 3000 });
        }
      }
    )
  }


  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.organes.length; i++) {
        if (this.organes[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

}
