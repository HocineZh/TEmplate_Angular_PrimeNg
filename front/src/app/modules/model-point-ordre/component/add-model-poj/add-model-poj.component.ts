import { Component, OnInit } from '@angular/core';
import { ModelPointOrdreService } from '../../services/model-point-ordre.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ModelPOJ } from '../../models/model-point-ordre';
import { ActivatedRoute, Router } from '@angular/router';
import { Societe } from 'src/app/modules/hierarchy/model/hierarchy';
import { HierarchyService } from 'src/app/modules/hierarchy/services/hierarchy.service';
import { ApiResponse } from 'src/app/shared/models/shared';

@Component({
  selector: 'app-add-model-poj',
  templateUrl: './add-model-poj.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./add-model-poj.component.scss']
})
export class AddModelPojComponent implements OnInit {

  modelPOJ: ModelPOJ = {};

  submitted: boolean = false;
  cols: any[] = [];
  societes !: Societe[];
  societe !: Societe;

  constructor(private modelPointOrdreService: ModelPointOrdreService, private hierarchyService: HierarchyService, private messageService: MessageService,
    private router: Router, private confirmationService: ConfirmationService) { }
  ngOnInit(): void {
    this.getAllSociete();
  }

  saveModelPOJ() {
    this.submitted = true;
    this.modelPOJ.type =='ParSociete' ? this.modelPOJ.societeId = this.societe.id! : null;
    //console.log("this.modelPOJ.societeId " + this.modelPOJ.societeId);
    this.modelPointOrdreService.createModelPOJ(this.modelPOJ).subscribe({
      next: (data: ApiResponse) => {

        this.messageService.add({ severity: 'success', summary: 'Succés', detail: data.message });
      },
      error: (err: ApiResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
      }

    }),
      //this.modelPOJs = [...this.modelPOJs];
      this.modelPOJ = {};
  }

  onSubmit() {
    console.log(this.modelPOJ);
    this.saveModelPOJ();
  }

  onBack(): void {
    //this.router.navigate(['modelOrdreJour/list']);
    this.router.navigateByUrl('modelPointOrdre/list');
  }
  getAllSociete() {
    this.hierarchyService.getAllSociete().subscribe({
      next: (data: Societe[]) => {
        this.societes = data;
      },
      error: (data: ApiResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: data.message })
      }
    })
  }
}
