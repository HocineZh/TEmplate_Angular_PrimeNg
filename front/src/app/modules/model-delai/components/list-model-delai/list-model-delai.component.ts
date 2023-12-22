import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { ModelDelai } from '../../model/model-delai';
import { ModelDelaiService } from '../../services/model-delai.service';

@Component({
  selector: 'app-list-model-delai',
  templateUrl: './list-model-delai.component.html',
  providers: [MessageService, ConfirmationService],
  styles: [`
  :host ::ng-deep .p-timeline-event-opposite {
      flex: 0;
      padding: 0 !important;
  }
`,]

})
export class ListModelDelaiComponent implements OnInit {

  models: ModelDelai[] = [];

  modelDialog: boolean = false;

  deleteModelDialog: boolean = false;

  deleteModelsDialog: boolean = false;

  model: ModelDelai = {};

  selectedmodels: ModelDelai[] = [];

  cols: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  constructor(private modelDelaiService: ModelDelaiService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private router: Router) { }

  ngOnInit(): void {

    this.modelDelaiService.getAllModelDelai().subscribe((res: any) => {
      console.log(res);
      this.models = res;
    });
  }

  deleteModelDelai(id: number) {
    this.modelDelaiService.deleteModelDelai(id).subscribe(res => {
      this.models = this.models.filter(item => item.id !== id);
      console.log('model deleted successfully!');
    })
  }

  deleteSelectedmodels() {
    this.deleteModelsDialog = true;
  }

  deleteModel(model: ModelDelai) {
    this.deleteModelDialog = true;
    this.model = { ...model };
  }

  confirmDeleteSelected() {
    this.deleteModelsDialog = false;
    // this.models = this.models.filter(val => !this.selectedmodels.includes(val));
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'models Deleted', life: 3000 });
    this.selectedmodels = [];
  }

  confirmDelete() {

    this.deleteModelDelai(Number(this.model.id));
    this.deleteModelDialog = false;
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Model Deleted', life: 3000 });
    //this.model = {};
  }

  hideDialog() {
    this.modelDialog = false;
  }


  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  editModel(model: ModelDelai) {
    this.router.navigate(['/modelDelai/editModel/'+model.id]);
  }
}
