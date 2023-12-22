import { Component } from '@angular/core';
import { Organe} from 'src/app/modules/organes/model/organe';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganeService } from './../../services/organe.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Etats } from 'src/app/shared/models/etats';
import { HierarchyService } from './../../../hierarchy/services/hierarchy.service';
import { Societe } from 'src/app/modules/hierarchy/model/hierarchy';
import { TypeOrgane } from 'src/app/modules/type-organe/model/type-organe';
import { TypeOrganeService } from './../../../type-organe/service/type-organe.service';
import { first } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/shared';



@Component({
  selector: 'app-edit-organe',
  templateUrl: './edit-organe.component.html',
  styleUrls: ['./edit-organe.component.scss'],
  providers: [MessageService]
})
export class EditOrganeComponent {

  selectedState: any = null;
  submitted: boolean = false;
  isAddFailed : boolean = false ;
  etats !: Etats[] ;
  organeForm !: FormGroup ;
  societes !: Societe [];
  types !: TypeOrgane[]  ;
  idOrgane !: number ;
  isMandate !: boolean ;

  constructor(private typeOrganeService: TypeOrganeService,private organeService: OrganeService, private formBuilder: FormBuilder, private messageService : MessageService,private hierarchyService: HierarchyService,private activatedRoute : ActivatedRoute) {
  }

  ngOnInit(): void {

    this.idOrgane = this.activatedRoute.snapshot.params["id"] ;
    this.organeService.getOrgane(this.idOrgane).
    pipe(first())
    .subscribe((organe : Organe) =>{
      this.isMandate = organe.mandate! ;
      console.log(this.isMandate);
      this.organeForm.patchValue(organe) ;
    });

    this.getAllSociete();
    this.getAllTypesOrgane();

    this.organeForm = this.formBuilder.group(
      {
        titre: ['',[Validators.required]],
        description: ['',[Validators.required]],
        typeOrgane: ['',[Validators.required]],
        societe: ['',[Validators.required]],
      }
    );

  }


  getAllSociete () {
    this.hierarchyService.getAllSociete().subscribe(
      {
        next : (data : Societe[]) => {
          this.societes = data ;
        }, error :(err : ApiResponse) =>{
          if(err.message){
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
          }else{
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Un problème est servenu. Veuillez contacter l'administrateur" }) ;
          }
        }
      }
    )
  }

  //Charger les types d'organes
  getAllTypesOrgane () {
    this.typeOrganeService.getAllOrgane().subscribe(
      {
        next : (data : Organe []) => {
          this.types = data ;
        },
        error :(err : ApiResponse) =>{
          if(err.message){
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
          }else{
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Un problème est servenu. Veuillez contacter l'administrateur" }) ;
          }
        }
      }
    )
  }

  updateOrgane() {

    this.submitted = true;
    if(this.organeForm.valid) {
      this.organeService.editOrgane(this.activatedRoute.snapshot.params["id"],this.organeForm.value.titre,this.organeForm.value.description,this.organeForm.value.typeOrgane,this.organeForm.value.societe).subscribe(
        {
          next : (data : ApiResponse) => {

            this.messageService.add({ severity: 'success', summary: 'Successful', detail: data.message, life: 3000 });
          },
          error :(err : ApiResponse) =>{
            if(err.message){
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
            }else{
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Un problème est servenu. Veuillez contacter l'administrateur" }) ;
            }
          }
        }
      )
      }
      else {
        this.isAddFailed =true ;
      }

  }

  get f(): { [key: string]: any } {
    return this.organeForm.controls;
  }

}
