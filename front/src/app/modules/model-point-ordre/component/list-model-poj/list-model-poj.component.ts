import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ModelPOJ } from '../../models/model-point-ordre';
import { ModelPointOrdreService } from '../../services/model-point-ordre.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-list-model-poj',
  templateUrl: './list-model-poj.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./list-model-poj.component.scss']
})
export class ListModelPojComponent implements OnInit {

  modelPOJs: ModelPOJ[] = [];

  modelPOJDialog: boolean = false;

  deleteModelPOJDialog: boolean = false;

  deleteModelPOJsDialog: boolean = false;

  modelPOJ: ModelPOJ = {};

  selectedmodelPOJs: Object[] = [];

  submitted: boolean = false;
  cols: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  constructor(private modelPointOrdreService: ModelPointOrdreService, private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

    this.modelPointOrdreService.getAllModelPOJ().subscribe((res: any) => {
      console.log(res);
      this.modelPOJs = res;
    });
  }

  deleteModelPOJj(id: number) {
    this.modelPointOrdreService.deleteModelPOJ(id).subscribe(res => {
      this.modelPOJs = this.modelPOJs.filter(item => item.id !== id);
      console.log('modelOJ deleted successfully!');
    })
  }

  confirmDeleteSelected() {
    this.deleteModelPOJsDialog = false;
    this.modelPOJs = this.modelPOJs.filter(val => !this.selectedmodelPOJs.includes(val));
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'modelPOJs Deleted', life: 3000 });
    this.selectedmodelPOJs = [];
  }

  confirmDelete() {

    this.deleteModelPOJj(Number(this.modelPOJ.id));
    this.deleteModelPOJDialog = false;
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'ModelPOJ Deleted', life: 3000 });
    this.modelPOJ = {};
  }

  onBack(): void {
    //this.router.navigate(['modelOrdreJour/list']);
    this.router.navigateByUrl('modelOrdreJour/list');
  }

  getModelPOJs(): void {
    this.modelPointOrdreService.getAllModelPOJ()
      .subscribe(modelPOJs => this.modelPOJs = modelPOJs);
  }

  openNew() {
    this.modelPOJ = {};
    this.submitted = false;
    this.modelPOJDialog = true;
  }

  deleteSelectedmodelPOJs() {
    this.deleteModelPOJsDialog = true;
  }


  deleteModelPOJ(modelOJ: ModelPOJ) {
    this.deleteModelPOJDialog = true;
    this.modelPOJ = { ...modelOJ };
  }

  hideDialog() {
    this.modelPOJDialog = false;
    this.submitted = false;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

}
