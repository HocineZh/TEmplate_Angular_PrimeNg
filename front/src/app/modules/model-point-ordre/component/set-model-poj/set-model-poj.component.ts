import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ModelOrdreJourService } from '../../../model-ordre-jour/services/model-ordre-jour.service';
import { ModelPOJ } from 'src/app/modules/model-point-ordre/models/model-point-ordre';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelPointOrdreService } from 'src/app/modules/model-point-ordre/services/model-point-ordre.service';
import { SetModelPOJs } from '../../../model-ordre-jour/models/setModelPOJs';
import { ApiConstant } from 'src/app/shared/constant';
import { ApiResponse } from 'src/app/shared/models/shared';
import { ModelOJ } from 'src/app/modules/model-ordre-jour/models/model-ordre-jour';

@Component({
  selector: 'app-set-model-poj',
  templateUrl: './set-model-poj.component.html',
  providers: [MessageService, ConfirmationService],
  styles: [

  ]
})
export class SetModelPojComponent {

  sourceModelPOJs: ModelPOJ[] = [];
  modelPOJ: ModelPOJ = {};
  //setModelPOJs: SetModelPOJs={String,ModelPOJs};
  sortOptions: ModelPOJ[] = [];
  sortOrder: number = 0;
  sortField: string = '';
  targetModelPOJs: ModelPOJ[] = [];
  model_id!: number;
  titre!: string;

  @Input() model: number = 0;

  constructor(private modelPointOrdreService: ModelPointOrdreService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.modelPointOrdreService.getPointOrdreNotInModel(this.model).subscribe((res: any) => {
      console.log(res);
      this.sourceModelPOJs = res;
    });

    this.modelPointOrdreService.getPointOrdreInModel(this.model).subscribe((res: any) => {
      console.log(res);
      if(res !== null) {
      this.targetModelPOJs = res;
      }
    });

  }

  onSortChange(event: any) {
    const value = event.value;
    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  selectChangeHandler(event: any) {
    //update the ui
    this.targetModelPOJs = event.target.value;

    this.submit();
  }




 arrayDifference(arr1: any, arr2:any) {
  const difference = [];

  for (let i = 0; i < arr1.length; i++) {
      if (arr2.indexOf(arr1[i]) === -1) {
          difference.push(arr1[i]);
      }
  }

  return difference;
}


  submit() {
    //let l = this.targetModelPOJs.filter( ar => !this.listAvant.find(rm => (rm.id === ar.id)));;
    //console.log(l);
    this.modelPointOrdreService.retirerModelsPOJ(this.model).subscribe({
      error: (err: ApiResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
      }
    });
    this.targetModelPOJs.forEach(modelpoj => {
      console.log("modelpoj.id " + modelpoj);
      //this.modelPointOrdreService.setModelPointOrdre(this.model_id,modelpoj.id).subscribe(data => {
      this.modelPointOrdreService.setModelPointOrdre(this.model, modelpoj.id!).subscribe({
        next: (data: ApiResponse) => {
          this.messageService.add({ severity: 'success', summary: 'Succés', detail: 'Point ordre attaché avec succé', life: 1000 });
        },
        error: (err: ApiResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
        }
      });
    });
  }

  onBack(): void {
    //this.router.navigate(['modelOrdreJour/list']);
    this.router.navigateByUrl('modelOrdreJour/list');
  }

  onFilter(dv: DataView, event: Event) {
    //dv.filter((event.target as HTMLInputElement).value);
  }
}
