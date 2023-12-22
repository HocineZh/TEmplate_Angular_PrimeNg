import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ModelProcessService } from '../../services/model-process.service';
import { Router } from '@angular/router';
import { ModelProcess } from '../../models/model-process';

@Component({
  selector: 'app-list-model-process',
  templateUrl: './list-model-process.component.html',
  providers: [MessageService, ConfirmationService],
  styles: [`
  :host ::ng-deep .p-timeline-event-opposite {
      flex: 0;
      padding: 0 !important;
  }
`,]
})
export class ListModelProcessComponent implements OnInit{
  modelProcess: ModelProcess[] = [];

  modelProcessDialog: boolean = false;

  deleteModelProcDialog: boolean = false;

  deleteModelProcsDialog: boolean = false;

  modelProc: ModelProcess = {};

  selectedmodelPross: ModelProcess[] = [];
  model_id !: number;
  model_titre !: string;
  submitted: boolean = false;
  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20];

  constructor(private modelProcessService: ModelProcessService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private router: Router) { }

  ngOnInit(): void {

    this.modelProcessService.getAllModelProcess().subscribe((res: any) => {
      console.log(res);
      this.modelProcess = res;
    });

  }

  deleteModelProcj(id: number) {
    this.modelProcessService.deleteProcess(id).subscribe(res => {
      this.modelProcess = this.modelProcess.filter(item => item.id !== id);
      console.log('modelOJ deleted successfully!');
    })
  }


  saveModelOJ() {
    this.submitted = true;
    this.modelProcessService.createProcess(this.modelProc).subscribe(data => {
      ;
      this.modelProcess.push(this.modelProc);
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Process Created', life: 3000 });
    }),

      this.modelProcess = [...this.modelProcess];
    this.modelProcessDialog = false;
    this.modelProc = {};
  }

  onSubmit() {
    console.log(this.modelProc);
    this.saveModelOJ();
  }

  deleteSelectedmodelProc() {
    this.deleteModelProcsDialog = true;
  }

  deleteModelProc(model: ModelProcess) {
    this.deleteModelProcDialog = true;
    this.modelProc = { ...model };
  }

  confirmDeleteSelected() {
    this.deleteModelProcsDialog = false;
    this.modelProcess = this.modelProcess.filter(val => !this.selectedmodelPross.includes(val));
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'modelOJs Deleted', life: 3000 });
    this.selectedmodelPross = [];
  }

  confirmDelete() {

    this.deleteModelProcj(Number(this.modelProc.id));
    this.deleteModelProcDialog = false;
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'ModelOJ Deleted', life: 3000 });
    this.modelProc = {};
  }

  hideDialog() {
    this.modelProcessDialog = false;
    this.submitted = false;
  }


  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
