import { Component ,OnInit} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelProcess } from '../../models/model-process';
import { ModelProcessService } from '../../services/model-process.service';

@Component({
  selector: 'app-update-model-process',
  templateUrl: './update-model-process.component.html',
  providers: [MessageService, ConfirmationService],
  styles: [`
  :host ::ng-deep .p-timeline-event-opposite {
      flex: 0;
      padding: 0 !important;
  }
`,]
})
export class UpdateModelProcessComponent implements OnInit{
  modelProcessDialog: boolean = false;
  modelProcess: ModelProcess = {};
  model_id!: number;
  submitted: boolean = false;

  constructor(private modelProcessService: ModelProcessService, private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.model_id = Number(params.get('id'));
      //this.model_id = 153;
      console.log("this.model_id "+this.model_id);
      this.modelProcessService.getProcessById(this.model_id).subscribe((data: ModelProcess)=>{
        this.modelProcess = data;
        console.log("this.modelProcess " +this.modelProcess);
      });
    });
  }

  ngOnDestroy() {
  }

  updateProcess(): void {
    this.modelProcessService.update(this.modelProcess.id, this.modelProcess)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'modelOJ Updated', life: 3000 });
        },
        error: (e) => console.error(e)
      });
      this.onBack();
  }

  onBack(): void {
    //this.router.navigate(['modelOrdreJour/list']);
    this.router.navigateByUrl('modelProcess/list');
  }


}
