import { Component, OnInit } from '@angular/core';
import { ModelFonctionnalite } from '../../models/model-Fonctionnalite';
import { ModelFonctionnaliteService } from '../../services/model-fonctionnalite.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-model-fct',
  templateUrl: './update-model-fct.component.html',
  providers: [MessageService, ConfirmationService],
  styles: [`
  :host ::ng-deep .p-timeline-event-opposite {
      flex: 0;
      padding: 0 !important;
  }
`,]
})
export class UpdateModelFctComponent implements OnInit {
  fct_id !: number;
  process_id !: number;
  modelFct: ModelFonctionnalite = {};

  constructor(private modelFctService: ModelFonctionnaliteService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.fct_id = Number(params.get('id'));
      this.process_id = Number(params.get('process_id'));
      console.log("update model fct " + this.fct_id);
      console.log("update model proess " + this.process_id);
      // this.process_id =252;
      this.modelFctService.getFonctionnaliteById(this.fct_id).subscribe((data: ModelFonctionnalite)=>{
        this.modelFct = data;
      });

      console.log("update model fct " + this.fct_id);
    });
  }

  updateModelFct(): void {
    this.modelFctService.update(this.modelFct.id, this.modelFct)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'model FCT Updated', life: 3000 });
        },
        error: (e) => console.error(e)
      });
      //this.onBack();
  }

  onBack(): void {
    this.router.navigateByUrl('modelFonctionnalite/list/' + this.process_id);
  }

}

