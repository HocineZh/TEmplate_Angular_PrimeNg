import { Component, EventEmitter, Input , Output} from '@angular/core';
import { Seance } from './../../model/seance';
import { MessageService } from 'primeng/api';
import { ApiResponse } from 'src/app/shared/models/shared';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SeanceService } from './../../services/seance.service';
import { ParametreService } from 'src/app/shared/services/parametre.service';
import { Etats } from 'src/app/shared/models/etats';
import { formatDate } from '@angular/common';
import { Evenement } from 'src/app/modules/evenements/models/evenement';

@Component({
  selector: 'app-add-seance',
  templateUrl: './add-seance.component.html',
  styleUrls: ['./add-seance.component.scss'],
  providers: [MessageService]
})
export class AddSeanceComponent {

  @Input() evenement ? : Evenement;
  @Output("reloadDataSeance") reloadDataSeance: EventEmitter<any> = new EventEmitter();
  submitted : boolean = false ;
  isAddFailed : boolean = false ;
  etats !: Etats[] ;
  seanceForm !: FormGroup ;

  visible  : boolean =true ;
  constructor(private seanceService : SeanceService ,private parametreService : ParametreService , private formBuilder: FormBuilder, private messageService : MessageService ,  private activatedRoute : ActivatedRoute ) {

  }

  ngOnInit(): void {

    this.getEtatsSeance();
    this.seanceForm = this.formBuilder.group(
      {
        date_debut: ['',[Validators.required]],
        date_fin: [''],
        lieu: ['',[Validators.required]],
        // etat: ['',[Validators.required]],
      }
    );
  }


  setDialog(){
    this.visible = true;
  }

  hideDialog (){
    this.visible = false;
  }



  getEtatsSeance(){
    this.parametreService.getEtatsSeance().subscribe(
      {
        next : (data :any) => {
          this.etats = data ;
        },
        error : (err : ApiResponse) =>{
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
        }
      }
    )
  }

  saveSeance() {
    this.submitted = true ;

    this.seanceForm.value.date_debut = formatDate(this.seanceForm.value.date_debut, 'yyyy-MM-dd HH:mm:ss', 'en-us');
    if(this.seanceForm.value.date_fin)
      this.seanceForm.value.date_fin =formatDate(this.seanceForm.value.date_fin, 'yyyy-MM-dd HH:mm:ss', 'en-us');


    if(this.seanceForm.valid) {

      this.seanceService.addSeance(this.seanceForm.value.date_debut,this.seanceForm.value.date_fin,this.seanceForm.value.lieu,this.seanceForm.value.etat, this.evenement!,1).subscribe(
        {
          next : (data :ApiResponse) => {
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: data.message }) ;
            this.visible = false ;
            this.reloadDataSeance.emit();
          },
          error : (err : ApiResponse) =>{
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
          }
        }
      )
    }else{

      this.isAddFailed =true ;
    }
  }


  get f(): { [key: string]: any } {
    return this.seanceForm.controls;
  }
}
