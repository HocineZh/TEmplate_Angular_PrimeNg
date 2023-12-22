import { Component ,OnInit} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SetModelPOJs } from '../../models/setModelPOJs';
import { ModelOrdreJourService } from '../../services/model-ordre-jour.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-model-oj',
  templateUrl: './view-model-oj.component.html',
  providers: [MessageService, ConfirmationService],
  styles: []
})
export class ViewModelOjComponent implements OnInit {
  joinedModelPOJs: SetModelPOJs[] = [];
  model_id!: number;


  constructor(private modelOrdreJourService: ModelOrdreJourService, private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,  private router: Router) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.model_id = Number(params.get('id'));
      console.log("view model oj "+this.model_id);
      this.modelOrdreJourService.getJoinedPointModelById(this.model_id).subscribe((res: any) => {
        console.log(res);
        this.joinedModelPOJs = res.map((arrItem:any) => {return {titre : arrItem[0], titre_p : arrItem[3], description_p : arrItem[4] }});
        //this.joinedModelPOJs = res;
      });
    });
}


onBack(): void {
  //this.router.navigate(['modelOrdreJour/list']);
  this.router.navigateByUrl('modelOrdreJour/list');
}


}
