import { Component } from '@angular/core';
import { TypeOrgane} from './../../model/type-organe';
import { TypeOrganeService } from './../../service/type-organe.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModelOJ } from "../../../model-ordre-jour/models/model-ordre-jour";
import { ModelDelai } from "../../../model-delai/model/model-delai";
import { ModelProcess } from "../../../model-process/models/model-process";
import { ModelDelaiService } from '../../../model-delai/services/model-delai.service';
import { ModelOrdreJourService } from '../../../model-ordre-jour/services/model-ordre-jour.service';
import { ModelProcessService } from '../../../model-process/services/model-process.service';
import { first } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/shared';
@Component({
  selector: 'app-edit-type-organe',
  templateUrl: './edit-type-organe.component.html',
  styleUrls: ['./edit-type-organe.component.scss'],
  providers: [MessageService]
})
export class EditTypeOrganeComponent {

  submitted: boolean = false;
  organe: TypeOrgane = {};
  isAddFailed : boolean = false ;
  typeOrganeForm !: FormGroup ;
  delais !: ModelDelai [];
  ordreJours !: ModelOJ[];
  process !: ModelProcess[];
  existeQuorum! : boolean;

  constructor(private modelProcessService: ModelProcessService,private router : Router, private modelOrdreJourService: ModelOrdreJourService,private modelDelaiService: ModelDelaiService,private typeOrganeService: TypeOrganeService, private messageService: MessageService,private formBuilder: FormBuilder, private activatedRoute : ActivatedRoute) {
  }

  ngOnInit(): void {

      this.getAllModelDelai();
      this.getAllModelOrderJour();
      this.getAllModelProcess();



      this.typeOrganeService.getOrgane(this.activatedRoute.snapshot.params["id"]).
    pipe(first())
    .subscribe((typeOrgane : TypeOrgane) => this.typeOrganeForm.patchValue(typeOrgane));

    this.typeOrganeService.getOrgane(this.activatedRoute.snapshot.params["id"]).
    pipe(first())
        .subscribe({
          next :(typeOrgane : TypeOrgane) =>{ this.typeOrganeForm.patchValue({


          designation:typeOrgane.designation,
          abreviation:typeOrgane.abreviation,
          description:typeOrgane.description,
          quorum: typeOrgane.quorum,
          existeQuorum:(typeOrgane.quorum===0)?'false':'true',
          modelDelais: typeOrgane.modelDelais,
          modelOrdreJour:typeOrgane.modelOrdreJour,
          modeleProcess:typeOrgane.modeleProcess,

        });
        this.existeQuorum = (typeOrgane.quorum===0)?false:true;
        },
      },
    );

      this.typeOrganeForm = this.formBuilder.group(
        {
          designation: ['',[Validators.required]],
          abreviation: ['',[Validators.required]],
          description: [''],
          quorum: [''],
          existeQuorum: ['',[Validators.required]],
          modelDelais: ['',[Validators.required]],
          modelOrdreJour:['',[Validators.required]],
          modeleProcess: ['',[Validators.required]],

        }
      );
  }


  showValueQuorum(){

    if(this.typeOrganeForm.value.existeQuorum == "true"){
      this.existeQuorum = true;
    }
    else
      this.existeQuorum = false;
  }

  closeSaveTypeOrgane(){

    this.router.navigate(['/typeOrgane/list']) ;
  }


  getAllModelDelai(){

    this.modelDelaiService.getAllModelDelai().subscribe(
      {
        next : (data : ModelDelai[]) => {
          this.delais = data ;
        }
      }
    )
  }

  getAllModelOrderJour(){
    this.modelOrdreJourService.getAllModelOJ().subscribe(
      {
        next : (data : ModelOJ[]) => {
          this.ordreJours = data ;
        }
      }
    )
  }

  getAllModelProcess(){

    this.modelProcessService.getAllModelProcess().subscribe(
      {
        next : (data : ModelProcess[]) => {
          this.process = data ;
        }
      }
    )
  }

  saveOrgane() {
    this.submitted = true;


    if(this.typeOrganeForm.valid) {

      this.typeOrganeForm.value.quorum = (this.typeOrganeForm.value.existeQuorum == "true")? this.typeOrganeForm.value.quorum : null;

        this.typeOrganeService.editOrgane(this.activatedRoute.snapshot.params["id"],this.typeOrganeForm.value.designation,this.typeOrganeForm.value.abreviation,this.typeOrganeForm.value.description,
        this.typeOrganeForm.value.quorum,this.typeOrganeForm.value.modelDelais,this.typeOrganeForm.value.modelOrdreJour,this.typeOrganeForm.value.modeleProcess).subscribe(
          {
            next : (data : ApiResponse) => {
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Type organe modifié avec succès', life: 3000 });
              //this.router.navigate(['/typeOrgane/list']) ;
            },
            error : (err : ApiResponse) => {
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message, life: 3000 });
            }
          }
        )
    }
    else {
      this.isAddFailed = true ;
    }

  }


  get f(): { [key: string]: any } {
    return this.typeOrganeForm.controls;
  }

}
