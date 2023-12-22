import { Component, OnInit } from '@angular/core';
import { ModelOJ } from '../../models/model-ordre-jour';
import { ModelOrdreJourService } from '../../services/model-ordre-jour.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-update-model-oj',
  templateUrl: './update-model-oj.component.html',
  providers: [MessageService, ConfirmationService],
  styles: [`
  :host ::ng-deep .p-timeline-event-opposite {
      flex: 0;
      padding: 0 !important;
  }
`,]
})
export class UpdateModelOjComponent implements OnInit {

  modelOJ: ModelOJ ={};
  model_id!: number;



  constructor(private modelOrdreJourService: ModelOrdreJourService, private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.model_id = Number(params.get('id'));
      console.log(this.model_id);
      this.modelOrdreJourService.getModelOJById(this.model_id).subscribe((data: ModelOJ)=>{
        this.modelOJ = data;
      });
    });

    /*this.model_id$ = this.route.params.pipe(map((p) => p['id']));
    permission$ = this.route.data.pipe(map((d) => d['permission']));
    user$ = this.route.queryParams.pipe(map((q) => q['user']));*/

  }

  onBack(): void {
    //this.router.navigate(['modelOrdreJour/list']);
    this.router.navigateByUrl('modelOrdreJour/list');
  }

  updateModelOJ(): void {
    this.modelOrdreJourService.update(this.modelOJ.id, this.modelOJ)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'modelOJ Updated', life: 3000 });
        },
        error: (e) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Erreur', life: 3000 });
          console.error(e);
        }
      });
      this.onBack();
  }
}
