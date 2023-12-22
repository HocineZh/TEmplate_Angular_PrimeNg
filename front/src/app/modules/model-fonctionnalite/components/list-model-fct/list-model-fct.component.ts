import { Component } from '@angular/core';
import { ModelProcess } from '../../../model-process/models/model-process';
import { ModelFonctionnaliteService } from '../../services/model-fonctionnalite.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { ModelFonctionnalite } from '../../models/model-Fonctionnalite';

@Component({
  selector: 'app-list-model-fct',
  templateUrl: './list-model-fct.component.html',
  providers: [MessageService, ConfirmationService],
  styles: [`
  :host ::ng-deep .p-timeline-event-opposite {
      flex: 0;
      padding: 0 !important;
  }
`,]
})
export class ListModelFctComponent {

  //modelProcessDialog: boolean = false;

  deleteModelProcDialog: boolean = false;

  deleteModelProcsDialog: boolean = false;

  modelFct: ModelFonctionnalite = {};

  selectedmodelPross: ModelFonctionnalite[] = [];
  fonctionnalites: ModelFonctionnalite[] = [];
  process_id !: number;
  submitted: boolean = false;
  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20];

  constructor(private modelFctService: ModelFonctionnaliteService, private messageService: MessageService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.process_id = Number(params.get('id'));
      console.log("list model fct : process id " + this.process_id);
      //this.modelFctService.getAllFonctionnalite().subscribe((data: any)=>{
      this.modelFctService.findAllFctBy(this.process_id).subscribe((data: any) => {
        this.fonctionnalites = data;
      });
    });
  }

  deleteModelFct(id: number) {
    this.modelFctService.deleteFonctionnalite(id).subscribe(res => {
      //this.fonctionnalites = this.fonctionnalites.filter(item => item.id !== id);
      console.log('modelOJ deleted successfully!');
    })
  }

  deleteSelectedmodelProc() {
    this.deleteModelProcsDialog = true;
  }

  deleteModelProc(model: ModelFonctionnalite) {
    this.deleteModelProcDialog = true;
    this.modelFct = { ...model };
  }

  confirmDeleteSelected() {
    this.deleteModelProcsDialog = false;
    this.fonctionnalites = this.fonctionnalites.filter(val => !this.selectedmodelPross.includes(val));
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'modelOJs Deleted', life: 3000 });
    this.selectedmodelPross = [];
  }

  confirmDelete() {
    this.deleteModelFct(Number(this.modelFct.id));
    this.deleteModelProcDialog = false;
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'ModelOJ Deleted', life: 3000 });
    this.modelFct = {};
  }

  hideDialog() {
    this.submitted = false;
  }


  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  onBack() {
    this.router.navigateByUrl('modelProcess/list');
  }
}
