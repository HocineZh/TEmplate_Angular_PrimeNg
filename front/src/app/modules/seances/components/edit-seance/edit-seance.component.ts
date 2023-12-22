import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Seance } from './../../model/seance';
import { MessageService } from 'primeng/api';
import { ApiResponse } from 'src/app/shared/models/shared';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SeanceService } from './../../services/seance.service';
import { ParametreService } from 'src/app/shared/services/parametre.service';
import { Etats } from 'src/app/shared/models/etats';
import { first } from 'rxjs';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';
import { Evenement } from 'src/app/modules/evenements/models/evenement';

@Component({
  selector: 'app-edit-seance',
  templateUrl: './edit-seance.component.html',
  styleUrls: ['./edit-seance.component.scss'],
  providers: [MessageService]
})
export class EditSeanceComponent {
  @Input() evenement ? : Evenement;
  userLogin !: string ;
  submitted : boolean = false ;
  isAddFailed : boolean = false ;
  etats !: Etats[] ;
  seanceForm !: FormGroup ;
  visible  : boolean =true ;
  @Input() seance! :number;
  @Output("reloadDataSeance") reloadDataSeance: EventEmitter<any> = new EventEmitter();
  constructor(private datepipe: DatePipe,private seanceService : SeanceService ,private parametreService : ParametreService , private formBuilder: FormBuilder, private messageService : MessageService ,  private activatedRoute : ActivatedRoute ) {}

  ngOnInit(): void {

    this.getEtatsSeance();

    this.seanceForm = this.formBuilder.group(
      {
        dateDebut: ['',[Validators.required]],
        dateFin: [''],
        lieu: ['',[Validators.required]],
        etatsByEtatsid: ['',[Validators.required]],

      }
    );
  }


  ngOnChanges() {

     this.seanceService.getSeance(this.seance).
        pipe(first())
            .subscribe({
              next :(seance : Seance) =>{   console.log(seance);this.seanceForm.patchValue({
                dateDebut: new Date(seance.dateDebut),
                dateFin: (seance.dateFin==null)?null:new Date(seance.dateFin),
                lieu: seance.lieu,
                etatsByEtatsid: seance.etatsByEtatsid,
            });
            },
          },
        );
      this.visible = true;
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
    this.seanceForm.value.dateDebut = formatDate(this.seanceForm.value.dateDebut, 'yyyy-MM-dd HH:mm:ss', 'en-us');
    if(this.seanceForm.value.dateFin)
        this.seanceForm.value.dateFin =formatDate(this.seanceForm.value.dateFin, 'yyyy-MM-dd HH:mm:ss', 'en-us');

    if(this.seanceForm.valid) {

      this.seanceService.updateSeance(this.seance,this.seanceForm.value.dateDebut,this.seanceForm.value.dateFin,this.seanceForm.value.lieu,this.seanceForm.value.etatsByEtatsid,1,this.evenement!
                                ).subscribe(
        {
          next : (data : ApiResponse) => {
            this.visible = false ;
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: data.message  }) ;
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

  hideDialog (){
    this.visible = false;
  }

  setDialog (){
    this.visible = true;
  }

  get f(): { [key: string]: any } {
    return this.seanceForm.controls;
  }

}
