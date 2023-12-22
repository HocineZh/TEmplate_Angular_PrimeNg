import { Organe} from 'src/app/modules/organes/model/organe';
import { OrganeService } from './../../services/organe.service';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Etats } from 'src/app/shared/models/etats';
import { HierarchyService } from './../../../hierarchy/services/hierarchy.service';
import { Societe } from 'src/app/modules/hierarchy/model/hierarchy';
import { TypeOrgane } from 'src/app/modules/type-organe/model/type-organe';
import { TypeOrganeService } from './../../../type-organe/service/type-organe.service';
import { ApiResponse } from 'src/app/shared/models/shared';

@Component({
  selector: 'app-add-organe',
  templateUrl: './add-organe.component.html',
  styleUrls: ['./add-organe.component.scss'],
  providers: [MessageService]
})
export class AddOrganeComponent {

  submitted : boolean = false ;
  isAddFailed : boolean = false ;
  etats !: Etats[] ;
  organeForm !: FormGroup ;
  societes !: Societe [];
  types !: TypeOrgane[]  ;
  displaySpinner : boolean = false ;
  /*************Partie Ajout des membres  ************************************************/
  displaydGridMembre : boolean = false ;
  idOrgane !: number ;
  isMandate !: boolean ;
  constructor(private typeOrganeService: TypeOrganeService,private organeService: OrganeService, private formBuilder: FormBuilder, private messageService : MessageService,private hierarchyService: HierarchyService  ) {
  }


  ngOnInit(): void {
    this.getAllSociete();
    this.getAllTypesOrgane();
    this.organeForm = this.formBuilder.group(
      {
        titre: ['',[Validators.required]],
        description: [''],
        typeOrgane: ['',[Validators.required]],
        societe: ['',[Validators.required]],
        mandate: [null,[Validators.required]],
      }
    );
  }


  getAllSociete () {
    this.hierarchyService.getAllSociete().subscribe(
      {
        next : (data : Societe[]) => {
          this.societes = data ;
        },
        error : (err : ApiResponse)=>{
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
        error : (err : ApiResponse)=>{
          if(err.message){
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
          }else{
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Un problème est servenu. Veuillez contacter l'administrateur" }) ;
          }
        }
      }
    )
  }

 saveOrgane() {

    this.submitted = true;
    if(this.organeForm.valid){
      this.displaySpinner = true ;
      this.organeService.createOrgane(this.organeForm.value.titre,this.organeForm.value.description,this.organeForm.value.typeOrgane,this.organeForm.value.societe,this.organeForm.value.mandate).subscribe(
        {
          next : (data : Organe) => {
            this.displaySpinner = false ;
            this.displaydGridMembre = true ;
            this.idOrgane = data.id! ;
            this.isMandate = data.mandate! ;
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Organe ajouté avec succès', life: 3000 });
          },
          error : (err : ApiResponse) => {
            this.displaySpinner = false ;
            this.displaydGridMembre = false ;
            if(err.message){
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
            }else{
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Un problème est servenu. Veuillez contacter l'administrateur" }) ;
            }
          }
        }
      )
    }

  }

  get f(): { [key: string]: any } {
    return this.organeForm.controls;
  }



}
