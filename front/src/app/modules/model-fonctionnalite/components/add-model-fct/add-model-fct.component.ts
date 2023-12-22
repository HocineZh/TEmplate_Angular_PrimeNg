import { Component, OnInit } from '@angular/core';
import { ModelFonctionnalite } from '../../models/model-Fonctionnalite';
import { ModelFonctionnaliteService } from '../../services/model-fonctionnalite.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from 'src/app/shared/models/shared';

@Component({
  selector: 'app-add-model-fct',
  templateUrl: './add-model-fct.component.html',
  providers: [MessageService, ConfirmationService]
})
export class AddModelFctComponent implements OnInit {
  process_id !: number;
  modelFct: ModelFonctionnalite = {};

  constructor(private modelFctService: ModelFonctionnaliteService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private router: Router, private route: ActivatedRoute)
    { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.process_id = Number(params.get('id'));
     // this.process_id =252;
      console.log("list model fct " + this.process_id);
    });
  }

  saveModelFct() {
    this.modelFctService.createFonctionnalite(this.process_id, this.modelFct).subscribe(  {
      next: (data: ApiResponse) => {
        ;
        this.messageService.add({ severity: 'success', summary: 'Succés', detail: data.message });
      },
      error: (err: ApiResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
      }
    }),
      this.modelFct = {};
  }

  onSubmit() {
    console.log(this.modelFct);
    this.saveModelFct();
  }

  onBack(): void {
    this.router.navigateByUrl('modelFonctionnalite/list/'+this.process_id);
  }

}
