import { PermissionMembreService } from './../../services/permission-membre.service';
import { Component } from '@angular/core';
import { Privileges, Profil, ProfilDetails } from '../../model/permission-membre';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiResponse } from 'src/app/shared/models/shared';

@Component({
  selector: 'app-add-profil',
  templateUrl: './add-profil.component.html',
  styleUrls: ['./add-profil.component.scss']
})
export class AddProfilComponent {

  privileges : Privileges [] = [] ;
  targetPrivileges : Privileges [] = [] ;
  profil : Profil = {} ;
  submitted : boolean = false ;
  buttonText !: string ;

  constructor(private permissionMembreService : PermissionMembreService ,private router : Router , private messageService : MessageService , private route: ActivatedRoute  ) {}

  ngOnInit(): void {

    //Initialiser les données s'il s'agit de modification
    if(this.route.snapshot.paramMap.get('id')){
      this.buttonText = "Modifier le profil" ;
      let id: number = +this.route.snapshot.paramMap.get('id')!;
      this.permissionMembreService.getProfil(id).subscribe(
        {
          next : (data : ProfilDetails) => {
            this.profil = data.profil! ;
            this.targetPrivileges = data.privileges! ;
            this.getAllPrivileges("edit",data.privileges!);
          },
          error : (err : ApiResponse) =>
          {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
            this.router.navigate(["/roles/list"]);
          }
        }
      )
    }
    else{
      this.buttonText = "Ajouter un profil" ;
      this.getAllPrivileges("add",[]);
    }


  }

  getAllPrivileges (type : string , target : Profil[]){
    this.permissionMembreService.getAllPrivilege().subscribe (
      {
        next : (data : Privileges[]) => {
          this.privileges = data ;
          if(type ==="edit") {
            this.privileges = this.privileges.filter( ar => !target.find(rm => (rm.id === ar.id)));;
          }
        },
        error : (err : ApiResponse) =>
        {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
        }
      }
    )
  }

  addProfil() {
    this.submitted = true ;
    if (this.profil.nom?.trim()) {

        //Si le mode Edit
        if(this.profil.id) {
          if(this.profil.nom && this.profil.duplicated != null){
            this.permissionMembreService.editProfil(this.profil.id,this.profil.nom,this.profil.description,this.profil.duplicated,this.targetPrivileges).subscribe(

              {
                next : (data : ApiResponse) => {
                  this.messageService.add({ severity: 'success', summary: 'Succès', detail: data.message, life: 50000 });
                },
                error : (err : ApiResponse) =>
                {
                  ;
                  this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message })
                }
              }
            )
          }
        }
        //Si le mode ajouter
        else {
          console.log(this.profil.duplicated);
          if(this.profil.nom && this.profil.duplicated != null){
            this.permissionMembreService.addProfil(this.profil.nom,this.profil.description,this.profil.duplicated,this.targetPrivileges).subscribe(

              {
                next : (data : ApiResponse) => {
                  this.messageService.add({ severity: 'success', summary: 'Succès', detail: data.message, life: 3000 });
                  this.profil = {};
                  this.submitted = false ;
                },
                error : (err : ApiResponse) =>
                {

                  this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message })
                }
              }
            )
          }

        }

    }
  }
}
