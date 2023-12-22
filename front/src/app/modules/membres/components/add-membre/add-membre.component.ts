import { DocumentService } from 'src/app/modules/document/services/document.service';
import { FileService } from './../../../../shared/services/file.service';
import { MembreService } from './../../services/membre.service';
import { PermissionMembreService } from './../../../permission-membre/services/permission-membre.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from './../../../users/services/user.service';
import { Component, Input, OnChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { User } from 'src/app/modules/users/model/user';
import { ApiResponse } from 'src/app/shared/models/shared';
import { Profil } from 'src/app/modules/permission-membre/model/permission-membre';
import { EditMembreResponse, InitMembreDataResponse, MembreRequest } from '../../model/membre';
import { Router } from '@angular/router';
import { first, filter } from 'rxjs';
import { datComp, dateValidation } from 'src/app/shared/validator/customValidator.validator';
import { options } from '@fullcalendar/core/preact';



@Component({
  selector: 'app-add-membre',
  templateUrl: './add-membre.component.html',
  styleUrls: ['./add-membre.component.scss']
})
export class AddMembreComponent {
  @Input() organe !: number ;
  @Input() type !: string ;
  /*****************Membre Add dialog variable ****************************************** */
  membreForm !: FormGroup;
  users !: User[];
  submitted : boolean = false ;
  profils !: Profil[] ;


  constructor(private fb:FormBuilder  ,private confirmationService : ConfirmationService ,private messageService : MessageService ,
              private membreService : MembreService , private router : Router , public fileService : FileService , private documentService : DocumentService  ) {
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
            date_debut_mandat : new FormControl(membre.date_debut_mandat),
            date_fin_mandat : new FormControl(membre.date_fin_mandat),
            fichier_just : new FormControl(membre.document.nom ? this.fileService.generateFile(membre.document.extension!,membre.document.nom!) : null),
            id_fichier : new FormControl(membre.document.idFile),
            actif : new FormControl(membre.actif== 1 ? true : false),
            disableModif : new FormControl(true),
            idMembre : new FormControl(membre.idMembre),
            fileSize : new FormControl(membre.document.size)
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
      date_debut_mandat : ['', Validators.required],
      date_fin_mandat : ['', [Validators.required ]  ],
      fichier_just: [null],
      id_fichier: [null],
      actif: [true],
      disableModif : [true],
      idMembre : [null],
      fileSize : [null]
    },{validators : datComp() }
    )
  }

  addNew() {
    this.membres().push(this.newMembre());
  }



  onUpload(event : any , index : number){
    this.membres().controls[index].patchValue({fichier_just: event.currentFiles[0]});
    //Dans le cas de modification
    if(this.type=="edit") {
      this.membres().controls[index].patchValue({disableModif : false});
    }
  }

  onSubmit() {
    this.submitted = true;

    if(this.membreForm.valid && this.membreForm.value.membres.length>0 ){
      this.membreService.addMembre(this.membreForm.value.membres,this.organe).subscribe({
        next : (data : ApiResponse)=> {
          this.messageService.add({ severity: 'success', summary: 'Message', detail: data.message }) ;
          window.location.reload();
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

  //Supprimer fichier non enregistré
  onRemovedFile(event : any , index : number) {
    this.membres().controls[index].patchValue({fichier_just: null});
  }
  //Supprimer un fichier déjà enregistrer dans la bdd
  deleteSavedFile(number : string , index : number) {
    this.confirmationService.confirm({
      message: "Etes vous sure de vouloire supprimer le fichier justifcatif ?",
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.documentService.deleteFile([{idDocument : this.membres().controls[index].get("id_fichier")?.value, version : 0}]).subscribe(
          {
            next : (data : ApiResponse) => {
              this.membres().controls[index].patchValue({fichier_just: null , id_fichier : null});
              this.messageService.add({ severity: 'success', summary: 'Message', detail: data.message }) ;
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
  }

  //Télécharger un fichier existant
  downloadFile (idDocument : number ,name: string ) {
    this.documentService.downloadFile(idDocument).subscribe(
      {
        next : (data : Blob) =>{
          let url = window.URL.createObjectURL(data);
          let a = document.createElement('a');
          a.download = name ;
          document.body.appendChild(a);
          a.href = url;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
        }
      }
    )
  }

  //Enable le button de modification du membre
  activeModif( index : number ) {
    this.membres().controls[index].patchValue({disableModif : false});
  }

  //Editer un membre existant
  editMembre (index : number) {

    if(this.membres().controls[index].get("idMembre")?.value ) {
      if(this.validationEdit(index)) {

        this.membreService.editMembre(Number(this.organe),this.membres().controls[index].get("idMembre")?.value,this.membres().controls[index].get("idUser")?.value,this.membres().controls[index].get("profil")?.value,
                                      this.membres().controls[index].get("date_debut_mandat")?.value,this.membres().controls[index].get("date_fin_mandat")?.value,
                                      this.membres().controls[index].get("actif")?.value, !this.membres().controls[index].get("id_fichier")?.value ? this.membres().controls[index].get("fichier_just")?.value : null)
        .subscribe(
        {
          next : (data : ApiResponse)=> {
            this.messageService.add({ severity: 'success', summary: 'Message', detail: data.message }) ;
            window.location.reload();
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


        this.membreService.editMembre(Number(this.organe),0,this.membres().controls[index].get("idUser")?.value,this.membres().controls[index].get("profil")?.value,
                                      this.membres().controls[index].get("date_debut_mandat")?.value,this.membres().controls[index].get("date_fin_mandat")?.value,
                                      1,this.membres().controls[index].get("fichier_just")?.value ? this.membres().controls[index].get("fichier_just")?.value : null).subscribe({
        next : (data : ApiResponse)=> {
            this.messageService.add({ severity: 'success', summary: 'Message', detail: data.message }) ;
            window.location.reload();
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
    if(!this.membres().controls[index].get("idUser")?.value || !this.membres().controls[index].get("profil")?.value
      || !this.membres().controls[index].get("date_debut_mandat")?.value || !this.membres().controls[index].get("date_fin_mandat")?.value || !this.validationDateEdit(index)) {
        return false;
      }
    return true ;
  }

  validationDateEdit(index : number) :boolean {
    return dateValidation(this.membres().controls[index].get("date_debut_mandat")?.value,this.membres().controls[index].get("date_fin_mandat")?.value)
  }

  findOcc(arr : FormArray, key : string){
    let arr2 : any = [];

    arr.controls.forEach((x)=>{

      // Checking if there is any object in arr2
      // which contains the key value
       if(arr2.some((val : any)=>{ return val[key] == x.get(key)?.value })){

         // If yes! then increase the occurrence by 1
         arr2.forEach((k : any)=>{
           if(k[key] === x.get(key)?.value){
             k["occurrence"]++
           }
        })

       }else{
         // If not! Then create a new object initialize
         // it with the present iteration key's value and
         // set the occurrence to 1
         let a : any = {}
         a[key] = x.get(key)?.value
         a["occurrence"] = 1
         arr2.push(a);
       }
    })
    return arr2
  }




  f(i:number): { [key: string]: any } {
    return this.membres().controls[i];
  }


}


