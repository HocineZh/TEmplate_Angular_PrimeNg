import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TypeOrgane} from './../../model/type-organe';
import { TypeOrganeService } from './../../service/type-organe.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-list-type-organe',
  templateUrl: './list-type-organe.component.html',
  styleUrls: ['./list-type-organe.component.scss'],
  providers: [MessageService,  ConfirmationService]
})
export class ListTypeOrganeComponent {

  organeDialog: boolean = false;

  deleteOrganeDialog: boolean = false;

  deleteOrganesDialog: boolean = false;

  organes: TypeOrgane[] = [];

  organe: TypeOrgane = {};

  selectedOrganes: TypeOrgane[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

    constructor(private typeOrganeService: TypeOrganeService, private messageService: MessageService,private router : Router ,private confirmationService: ConfirmationService) {
    }

    ngOnInit() {

      this.typeOrganeService.getAllOrgane().subscribe(
        (data : TypeOrgane[]) => {
          this.organes =data;
        },(err: any)=>{
          ;
        }
      )

      this.cols = [
          { field: 'organe', header: 'Organe' },
          { field: 'designation', header: 'Designation' },
          { field: 'abreviation', header: 'Abreviation' },
          { field: 'description', header: 'Description' },
          { field: 'quorum', header: 'Quorum' }
      ];

    }

    openNew() {
      this.router.navigate(['/typeOrgane/addTypeOrgane']) ;
    }

    deleteSelectedOrganes() {
        this.deleteOrganesDialog = true;
    }

    editOrgane(organe: TypeOrgane) {
        this.router.navigate(['/typeOrgane/editTypeOrgane/'+organe.id]);
    }

    deleteOrgane(organe: TypeOrgane) {
        this.deleteOrganeDialog = true;
        this.organe = { ...organe };
    }


    confirmDeleteSelected() {

        const mappedArray = this.selectedOrganes.map( (o)=> o.id );
        console.log(mappedArray);
        this.typeOrganeService.deleteMultipleOrgane(mappedArray).subscribe(
          (data: any) => {
            this.deleteOrganesDialog = false;
            this.organes = this.organes.filter(val => !this.selectedOrganes.includes(val));
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Organes supprimés avce succès', life: 3000 });
            this.selectedOrganes = [];
          },(error : any) => {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Veuillez SVP contacter l'administrateur", life: 3000 });
          }
        )
    }

  confirmDelete() {

    this.typeOrganeService.deleteOrgane(this.organe.id!).subscribe(
      (data: any) => {
        this.deleteOrganeDialog = false;
        this.organes = this.organes.filter(val => val.id !== this.organe.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Organe supprimé avec succès', life: 3000 });
        this.organe = {};
      },(error : any) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Veuillez SVP contacter l'administrateur", life: 3000 });
      }
    )

  }


  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.organes.length; i++) {
        if (this.organes[i].abreviation === id) {
            index = i;
            break;
        }
    }
    return index;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

}
