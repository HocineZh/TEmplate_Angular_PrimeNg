import { Component, OnInit } from '@angular/core';
import { ModelOJ } from '../../models/model-ordre-jour';
import { ModelOrdreJourService } from '../../services/model-ordre-jour.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiResponse } from 'src/app/shared/models/shared';

@Component({
  selector: 'app-add-model-oj',
  templateUrl: './add-model-oj.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./add-model-oj.component.scss']
})
export class AddModelOjComponent implements OnInit {
  modelOJs: ModelOJ[] = [];

  modelOJDialog: boolean = false;

  modelOJ: ModelOJ = {};
  submitted: boolean = false;
  cols: any[] = [];
  idModel !:number;

  constructor(private modelOrdreJourService: ModelOrdreJourService, private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    //this.route.navigate(['/addModel']);
    this.openNew();
  }

  saveModelOJ() {

    this.modelOrdreJourService.createModelOJ(this.modelOJ).subscribe(
      {
        next: (data: ModelOJ) => {
          this.modelOJs.push(this.modelOJ);

          this.idModel = data.id! ;
          console.log("idmodel "+this.idModel);
          this.submitted = true;
          this.messageService.add({ severity: 'success', summary: 'Succés', detail: 'Organe ajouté avec succès', life: 1000 });
        },
        error: (err: ApiResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
        }
      }
    ),
    this.modelOJs = [...this.modelOJs];
    //this.modelOJDialog = false;
    //this.modelOJ = {};

  }



  openNew() {
    this.modelOJ = {};
    this.submitted = false;
    this.modelOJDialog = true;
  }
  onBack(): void {
    //this.router.navigate(['modelOrdreJour/list']);
    this.router.navigateByUrl('modelOrdreJour/list');
  }

}
