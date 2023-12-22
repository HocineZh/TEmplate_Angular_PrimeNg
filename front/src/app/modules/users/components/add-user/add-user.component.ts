import { UserService } from './../../services/user.service';
import {  User, UserDetails } from './../../model/user';
import { Structure } from './../../../hierarchy/model/hierarchy';
import { HierarchyService } from './../../../hierarchy/services/hierarchy.service';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Role } from 'src/app/modules/permissions/model/permission';
import { PermissionService } from 'src/app/modules/permissions/service/permission.service';
import { ApiResponse } from 'src/app/shared/models/shared';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PAYS } from 'src/app/shared/constant';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {

  roles : Role [] =[]  ;
  structures !: Structure[] ;
  pays  = PAYS ;
  user : User = {} ;
  userId !: number ;
  submitted : boolean = false ;
  isAddFailed : boolean = false ;
  userForm !: FormGroup ;
  readOnly : boolean = false ;
  constructor(private userService : UserService , private permissionService : PermissionService  , private formBuilder: FormBuilder,
              private messageService : MessageService , private hierarchyService :HierarchyService, private activatedRoute : ActivatedRoute , private router : Router ) {}

  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.params["id"];
    this.readOnly = this.router.url.includes("visualise") ? true : false ;
    if(this.userId){
      this.userService.getUser(this.userId).
      pipe(first())
      .subscribe((user : UserDetails) => {
        let editingUser = {
          ...(user.user),roles : (user.roles)
        }
        this.userForm.patchValue(editingUser) ;
        if(this.readOnly){
          this.userForm.disable();
        }
      });
    }

    this.getAllRoles();
    this.getAllStructure();
    this.initForm();

  }

  initForm() {
    this.userForm = this.formBuilder.group(
      {
        login: ['',[Validators.required]],
        prenom: ['',[Validators.required]],
        nom: ['',[Validators.required]],
        email: ['',[Validators.required, Validators.email]],
        dateNaiss : [''],
        fax: [null],
        roles: [[],[Validators.required]],
        structure: ['',[Validators.required]],
        phone : [null,[Validators.required]],
        fonction : ['' , [Validators.required]],
        adresse : [''],
        pays : [''],
        etatCivil : ['']
      }
    );
  }
  getAllRoles() {
    this.permissionService.getAllRole().subscribe(
      {
        next : (data: Role[]) => {
          this.roles = data ;
        },
        error : (err : ApiResponse) =>{
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
        }
      }
    )
  }
  getAllStructure(){
    this.hierarchyService.getAllStructure().subscribe(
      {
        next : (data :Structure[]) => {
          this.structures = data ;
        },
        error : (err : ApiResponse) =>{
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
        }
      }
    )
  }

  saveUser() {
    this.submitted = true ;
    if(this.userForm.valid) {
      if(this.userId){
        this.userService.editUser(this.userId,this.userForm.value.nom,this.userForm.value.prenom,this.userForm.value.email,this.userForm.value.login
                                  ,this.userForm.value.phone,this.userForm.value.fax,this.userForm.value.pays,this.userForm.value.fonction,
                                  this.userForm.value.adresse,this.userForm.value.roles,this.userForm.value.structure,this.userForm.value.dateNaiss,this.userForm.value.etatCivil).subscribe(
          {
            next : (data :ApiResponse) => {
              this.messageService.add({ severity: 'success', summary: 'Succés', detail: data.message }) ;
            },
            error : (err : ApiResponse) =>{
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
            }
          }
        )
      }else {
        this.userService.addUser(this.userForm.value.nom,this.userForm.value.prenom,this.userForm.value.email,this.userForm.value.login
          ,this.userForm.value.phone,this.userForm.value.fax,this.userForm.value.pays,this.userForm.value.fonction,
          this.userForm.value.adresse,this.userForm.value.roles,this.userForm.value.structure,this.userForm.value.dateNaiss,this.userForm.value.etatCivil).subscribe(
            {
            next : (data :ApiResponse) => {
            this.messageService.add({ severity: 'success', summary: 'Succés', detail: data.message }) ;
            this.initForm();
            this.submitted = false ;
            },
            error : (err : ApiResponse) =>{
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
            }
            }
          )
      }

    }else{
      this.isAddFailed =true ;
    }

  }


  annuler () {
    this.router.navigate(["/users/list"]);
  }
  get f(): { [key: string]: any } {
    return this.userForm.controls;
  }



}
