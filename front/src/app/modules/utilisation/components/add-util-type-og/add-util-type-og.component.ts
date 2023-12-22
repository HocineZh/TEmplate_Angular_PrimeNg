import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilisationService } from '../../services/utilisation.service';
import { ApiResponse } from 'src/app/shared/models/shared';

@Component({
  selector: 'app-add-util-type-og',
  templateUrl: './add-util-type-og.component.html',
  styleUrls: ['./add-util-type-og.component.scss']
})
export class AddUtilTypeOgComponent {
  utilisation: any = {};

  submitted: boolean = false;
  cols: any[] = [];

  constructor(private utilisationService: UtilisationService, private messageService: MessageService,
    private confirmationService: ConfirmationService,  private router: Router) { }

  saveModelUtilisation() {
    this.submitted = true;
    console.log("description "+this.utilisation.descriptionModele);
    console.log("nom "+this.utilisation.nomModele);
    this.utilisationService.createUtilisation(this.utilisation).subscribe( {
        next : (data :ApiResponse) => {
          ;
          this.messageService.add({ severity: 'success', summary: 'Succés', detail: data.message }) ;
        },
        error : (err : ApiResponse) =>{
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
        }

    }),
      this.utilisation = {};
  }

  onSubmit() {
    console.log(this.utilisation);
    this.saveModelUtilisation();
  }

  onBack(): void {
    this.router.navigateByUrl('modelProcess/list');
  }
}
