import { Component, OnInit } from '@angular/core';
import { ModelDelaiService } from '../../services/model-delai.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ModelDelai } from '../../model/model-delai';
import { ApiResponse } from 'src/app/shared/models/shared';

@Component({
  selector: 'app-add-model-delai',
  templateUrl: './add-model-delai.component.html',
  providers: [MessageService]
})
export class AddModelDelaiComponent implements OnInit {

  model: ModelDelai = {};
  models: ModelDelai[] = [];
  submitted: boolean = false;
  modelId!: number;
  modelDelai : ModelDelai={};

  constructor(private modelDelaiService: ModelDelaiService, private router: Router, private messageService: MessageService, private activatedRoute: ActivatedRoute) { }
  ngOnInit(): void {
    this.modelId = this.activatedRoute.snapshot.params["id"];
    if (this.modelId) {
      this.modelDelaiService.getModelById(this.modelId).subscribe((data: ModelDelai) => {
        this.model = data;
      });
    }
  }

  saveModel(model: ModelDelai) {
    console.log("avant");
    console.log(model);
    if (this.modelId) {
      this.modelDelaiService.update(model).subscribe(
        {
          next: (data: ApiResponse) => {
            this.models.push(model)
            console.log(data);
            this.messageService.add({ severity: 'success', summary: 'Succés', detail: data.message });
          },
          error: (err: ApiResponse) => {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
          }
        });
    }
    else {
    this.modelDelaiService.createModelDelai(model).subscribe(
      {
        next: (data: ApiResponse) => {
          this.models.push(model)
          console.log(data);
          this.messageService.add({ severity: 'success', summary: 'Succés', detail: data.message });
        },
        error: (err: ApiResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
        }
      });
    }
  }

  onSubmit() {
    this.submitted = true;
    console.log("On submit");
    console.log(this.model);
    this.saveModel(this.model);
  }

  onBack(): void {
    this.router.navigateByUrl('modelDelai/list');
  }
}
