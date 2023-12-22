import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Profil } from 'src/app/modules/permission-membre/model/permission-membre';
import { User } from 'src/app/modules/users/model/user';
import { MembreService } from '../../services/membre.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DocumentService } from 'src/app/modules/document/services/document.service';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { EditMembreResponse, InitMembreDataResponse } from '../../model/membre';
import { ApiResponse } from 'src/app/shared/models/shared';

@Component({
  selector: 'app-add-membre-without-mandat',
  templateUrl: './add-membre-without-mandat.component.html',
  styleUrls: ['./add-membre-without-mandat.component.scss']
})
export class AddMembreWithoutMandatComponent {
  @Input() organe !: number ;
  @Input() type !: string ;
  /*****************Membre Add dialog variable ****************************************** */
  membreForm !: FormGroup;
  users !: User[];
  submitted : boolean = false ;
  profils !: Profil[] ;

  constructor(private fb:FormBuilder  ,private confirmationService : ConfirmationService ,private messageService : MessageService ,
    private membreService : MembreService , private router : Router , private documentService : DocumentService  ) {
    this.membreForm = this.fb.group({
    membres: this.fb.array([]) ,
    });
  }

  ngOnInit(): void {

    this.initData();
    if(this.type=="edit") {
      this.initListMembre();
    }
  }

  initListMembre() {
    this.membreService.getAllActifMembresByOrgane(this.organe).
    pipe(first())
    .subscribe((membres : EditMembreResponse[]) => {
      membres.forEach(
        (membre: EditMembreResponse) => {
            this.membres().push(new FormGroup({
            idUser : new FormControl(membre.idUser),
            profil : new FormControl(membre.profil),
            disableModif : new FormControl(true),
            actif : new FormControl(membre.actif== 1 ? true : false),
            idMembre : new FormControl(membre.idMembre)
        }))
        }
      )
    });
  }

  initData() {
    this.membreService.initData().subscribe( {
      next : (data : InitMembreDataResponse) => {
        this.users = data.users ;
        this.profils = data.profils ;
      },
      error : (err : ApiResponse)=> {
        if(err){
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
        }else{
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Un problème est servenu. Veuillez contacter l'administrateur" }) ;
        }
      }
    })
  }

  membres() : FormArray {
    return this.membreForm.get("membres") as FormArray
  }

  newMembre(): FormGroup {
    return this.fb.group({
      idUser: ['', [Validators.required] ],
      profil: ['', [Validators.required]],
      actif: [true, [Validators.required]],
      disableModif : [true]
    }
    )
  }

  addNew() {
    this.membres().push(this.newMembre());
  }

  onSubmit() {
    this.submitted = true;

    if(this.membreForm.valid && this.membreForm.value.membres.length>0 ){
      this.membreService.addMembreWithoutMandat(this.membreForm.value.membres,this.organe).subscribe({
        next : (data : ApiResponse)=> {
          this.messageService.add({ severity: 'success', summary: 'Message', detail: data.message }) ;
          this.initListMembre() ;
        },
        error : (err : ApiResponse)=> {
          if(err){
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
          }else{
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Un problème est servenu. Veuillez contacter l'administrateur" }) ;
          }
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Formulaire d'ajout des membres invalide" }) ;
    }
  }

  //Supprimer un membre
  removeMembre(i:number) {
    if(this.membres().controls[i].get("idMembre")?.value) {
      this.confirmationService.confirm({
        message: "Etes vous sure de vouloire supprimer Le membre : "+ this.membres().controls[i].get("idUser")?.value + " de cet organe ?",
        header: 'Confirmation de suppression',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.membreService.deleteMembre(this.membres().controls[i].get("idMembre")?.value).subscribe(
            {
              next: (data : ApiResponse)=> {
                this.messageService.add({ severity: 'success', summary: 'Message', detail: data.message }) ;
                this.membres().removeAt(i);
              },
              error : (err : ApiResponse) => {
                if(err.message){
                  this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
                }else{
                  this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Un problème est servenu. Veuillez contacter l'administrateur" }) ;
                }
              }
            }
          )
        },
        reject : () =>{

        }
      })
    }else{
      this.membres().removeAt(i);
    }
  }

  //Enable le button de modification du membre
  activeModif( index : number ) {
    this.membres().controls[index].patchValue({disableModif : false});
  }

  //Editer un membre existant
  editMembre (index : number) {

    if(this.membres().controls[index].get("idMembre")?.value ) {
      if(this.validationEdit(index)) {

        this.membreService.editMembreWithoutMandat(Number(this.organe),this.membres().controls[index].get("idMembre")?.value,this.membres().controls[index].get("idUser")?.value

                                                    ,this.membres().controls[index].get("profil")?.value,this.membres().controls[index].get("actif")?.value)
        .subscribe(
        {
          next : (data : ApiResponse)=> {
            this.messageService.add({ severity: 'success', summary: 'Message', detail: data.message }) ;
            this.initListMembre() ;
          },
          error : (err : ApiResponse) => {
            if(err.message){
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
            }else{
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Un problème est servenu. Veuillez contacter l'administrateur" }) ;
            }

          }
        }

        )
      }else {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Formulaire d'ajout des membres invalide" }) ;
      }
    }
    else{
      if(this.validationEdit(index)) {

        this.membreService.editMembreWithoutMandat(Number(this.organe),0,this.membres().controls[index].get("idUser")?.value
                                                    ,this.membres().controls[index].get("profil")?.value,this.membres().controls[index].get("actif")?.value).subscribe({
        next : (data : ApiResponse)=> {
            this.messageService.add({ severity: 'success', summary: 'Message', detail: data.message }) ;
            this.initListMembre() ;
          },
          error : (err : ApiResponse)=> {
            if(err.message){
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
            }else{
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Un problème est servenu. Veuillez contacter l'administrateur" }) ;
            }
          }
        });
      }else {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Formulaire d'ajout des membres invalide" }) ;
      }
    }

  }

   /*************************************** Validation Controle ******************************************************************************************************/

   validationEdit(index : number) : boolean {

    if(!this.membres().controls[index].get("idUser")?.value || !this.membres().controls[index].get("profil")?.value) {

        return false;
      }
    return true ;
  }

}
