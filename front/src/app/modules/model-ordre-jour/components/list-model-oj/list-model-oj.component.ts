import { Component, OnInit } from '@angular/core';
import { ModelOJ } from '../../models/model-ordre-jour';
import { ModelOrdreJourService } from '../../services/model-ordre-jour.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-list-model-oj',
  templateUrl: './list-model-oj.component.html',
  providers: [MessageService, ConfirmationService],
  styles: [`
  :host ::ng-deep .p-timeline-event-opposite {
      flex: 0;
      padding: 0 !important;
  }
`,]

})
export class ListModelOjComponent implements OnInit {
  modelOJs: ModelOJ[] = [];

  modelOJDialog: boolean = false;

  deleteModelOJDialog: boolean = false;

  deleteModelOJsDialog: boolean = false;

  modelOJ: ModelOJ = {};

  selectedmodelOJs: ModelOJ[] = [];
  model_id !: number;
  model_titre !: string;
  submitted: boolean = false;
  cols: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  //modelojs$: Observable<ModelOJ[]> = [];
  //selectedId: number;


  constructor(private modelOrdreJourService: ModelOrdreJourService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private router: Router) { }

  ngOnInit(): void {

    this.modelOrdreJourService.getAllModelOJ().subscribe((res: any) => {
      console.log(res);
      this.modelOJs = res;
    });

  }

  deleteModelOJj(id: number) {
    this.modelOrdreJourService.deleteModelOJ(id).subscribe(res => {
      this.modelOJs = this.modelOJs.filter(item => item.id !== id);
      console.log('modelOJ deleted successfully!');
    })
  }


  saveModelOJ() {
    this.submitted = true;
    this.modelOrdreJourService.createModelOJ(this.modelOJ).subscribe(data => {

      this.modelOJs.push(this.modelOJ);

      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'modelOJ Created', life: 3000 });
    }),

      this.modelOJs = [...this.modelOJs];
    //this.modelOJDialog = false;
    //this.modelOJ = {};
  }

  onSubmit() {
    console.log(this.modelOJ);
    this.saveModelOJ();

  }

  getModelOJs(): void {
    this.modelOrdreJourService.getAllModelOJ()
      .subscribe(modelOJs => this.modelOJs = modelOJs);
  }

  openNew() {
    this.modelOJ = {};
    this.submitted = false;
    this.modelOJDialog = true;
  }

  deleteSelectedmodelOJs() {
    this.deleteModelOJsDialog = true;
  }

  joinSelectedmodelOJ() {
    console.log(this.selectedmodelOJs[0].id);
    this.model_id = Number(this.selectedmodelOJs[0].id);
    console.log(this.model_id);
    this.router.navigate([`/modelPointOrdre/setModelPoint/`, this.model_id]);
    console.log();
  }

  deleteModelOJ(modelOJ: ModelOJ) {
    this.deleteModelOJDialog = true;
    this.modelOJ = { ...modelOJ };
  }

  confirmDeleteSelected() {
    this.deleteModelOJsDialog = false;
    this.modelOJs = this.modelOJs.filter(val => !this.selectedmodelOJs.includes(val));
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'modelOJs Deleted', life: 3000 });
    this.selectedmodelOJs = [];
  }

  confirmDelete() {

    this.deleteModelOJj(Number(this.modelOJ.id));
    this.deleteModelOJDialog = false;
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'ModelOJ Deleted', life: 3000 });
    this.modelOJ = {};
  }

  hideDialog() {
    this.modelOJDialog = false;
    this.submitted = false;
  }


  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
