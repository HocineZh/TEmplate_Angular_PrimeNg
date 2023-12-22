import { Component } from '@angular/core';
import { ModelPointOrdreService } from '../../services/model-point-ordre.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelPOJ } from '../../models/model-point-ordre';

@Component({
  selector: 'app-update-model-poj',
  templateUrl: './update-model-poj.component.html',
  providers: [MessageService, ConfirmationService],
  styles: [`
  :host ::ng-deep .p-timeline-event-opposite {
      flex: 0;
      padding: 0 !important;
  }
`,]
})
export class UpdateModelPojComponent {
  modelPOJ: ModelPOJ ={};
  submitted: boolean = false;
  modelPOJs: ModelPOJ[] = [];
  model_id!: number;



  constructor(private modelPointOrdreService: ModelPointOrdreService, private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute ,
    private router: Router) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.model_id = Number(params.get('id'));
      console.log(this.model_id);
      this.modelPointOrdreService.getModelPOJById(this.model_id).subscribe((data: ModelPOJ)=>{
        this.modelPOJ = data;
      });
    });
  }

  ngOnDestroy() {
   // if (this.sub) this.sub.unsubscribe();
  }

  onBack(): void {
    //this.router.navigate(['modelOrdreJour/list']);
    this.router.navigateByUrl('modelPointOrdre/list');
  }

  updateModelPOJ(): void {
    this.modelPointOrdreService.updateModelPOJ(this.modelPOJ.id, this.modelPOJ)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'modelOJ Updated', life: 3000 });
        },
        error: (e) => console.error(e)
      });
      this.onBack();
  }
}
