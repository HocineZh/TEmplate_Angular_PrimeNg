import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelProcess } from '../../models/model-process';
import { ModelProcessService } from '../../services/model-process.service';
import { ApiResponse } from 'src/app/shared/models/shared';

@Component({
  selector: 'app-add-model-process',
  templateUrl: './add-model-process.component.html',
  providers: [MessageService, ConfirmationService],
})
export class AddModelProcessComponent {
  modelProcess: ModelProcess = {};

  submitted: boolean = false;
  cols: any[] = [];

  constructor(private modelProcessService: ModelProcessService, private messageService: MessageService,
    private confirmationService: ConfirmationService,  private router: Router) { }

  saveModelProcess() {
    this.submitted = true;
    console.log("description "+this.modelProcess.descriptionModele);
    console.log("nom "+this.modelProcess.nomModele);
    this.modelProcessService.createProcess(this.modelProcess).subscribe( {
        next : (data :ApiResponse) => {
          ;
          this.messageService.add({ severity: 'success', summary: 'Succés', detail: data.message }) ;
        },
        error : (err : ApiResponse) =>{
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
        }

    }),
      this.modelProcess = {};
  }

  onSubmit() {
    console.log(this.modelProcess);
    this.saveModelProcess();
  }

  onBack(): void {
    this.router.navigateByUrl('modelProcess/list');
  }
}
