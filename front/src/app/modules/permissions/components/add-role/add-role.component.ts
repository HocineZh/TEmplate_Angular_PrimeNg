import { Component } from '@angular/core';
import { PermissionService } from '../../service/permission.service';
import { MessageService } from 'primeng/api';
import { Privilege, Role, RoleDetails } from '../../model/permission';
import { ApiResponse } from 'src/app/shared/models/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent {
  privileges : Privilege [] = [] ;
  targetPrivileges : Privilege [] = [] ;
  role : Role = {} ;
  submitted : boolean = false ;

  buttonText !: string ;

  constructor(private permissionService : PermissionService ,private router : Router , private messageService : MessageService , private route: ActivatedRoute  ) {}

  ngOnInit(): void {

    //Initialiser les données s'il s'agit de modification
    if(this.route.snapshot.paramMap.get('id')){
      this.buttonText = "Modifier le role" ;
      let id: number = +this.route.snapshot.paramMap.get('id')!;
      this.permissionService.getRole(id).subscribe(
        {
          next : (data : RoleDetails) => {
            this.role = data.role! ;

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
      this.buttonText = "Ajouter un role" ;
      this.getAllPrivileges("add",[]);
    }


  }

  getAllPrivileges (type : string , target : Role[]){
    this.permissionService.getAllPrivilege().subscribe (
      {
        next : (data : Privilege[]) => {
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

  addRole() {
    this.submitted = true ;
    if (this.role.nom?.trim()) {
      if(this.targetPrivileges.length > 0 ) {
        //Si le mode Edit
        if(this.role.id) {

          this.permissionService.editRole(this.role.id,this.role.nom,this.role.description,this.targetPrivileges).subscribe(

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
        //Si le mode ajouter
        else {
          this.permissionService.addRole(this.role.nom,this.role.description,this.targetPrivileges).subscribe(

            {
              next : (data : ApiResponse) => {
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: data.message, life: 3000 });
                this.role = {};
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
