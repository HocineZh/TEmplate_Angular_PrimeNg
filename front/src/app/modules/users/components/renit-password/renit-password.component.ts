import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ApiResponse } from 'src/app/shared/models/shared';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-renit-password',
  templateUrl: './renit-password.component.html',
  styleUrls: ['./renit-password.component.scss']
})
export class RenitPasswordComponent implements OnInit {
  passwordForm !: FormGroup ;
  submitted : boolean = false ;

  constructor(private formBuilder: FormBuilder , private userService : UserService , private messageService : MessageService , private router : Router) {

  }
  ngOnInit(): void {
    //Initialiser form
    this.passwordForm = this.formBuilder.group(
      {
        oldPassword: ['',[Validators.required , Validators.pattern('^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=.*[0-9])(?=\\D*\\d)(?=.*[$@$!%?&])[A-Za-z\\d!$%@#£€*?&]{14,}$')]],
        newPassword : ['',[Validators.required , Validators.pattern('^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=.*[0-9])(?=\\D*\\d)(?=.*[$@$!%?&])[A-Za-z\\d!$%@#£€*?&]{14,}$')]],
        confirmNewPassword: ['',[Validators.required]],
      }, {
        validator: [this.ConfirmedValidator('newPassword', 'confirmNewPassword')]
      }as AbstractControlOptions

    );
  }

  onFormSubmit(e:any) {
    this.submitted = true ;
    if(this.passwordForm.valid) {
      this.userService.renitPassword (this.passwordForm.value.oldPassword,this.passwordForm.value.newPassword).subscribe(
        {
          next : (data : ApiResponse)=> {
            this.messageService.add({ severity: 'success', summary: 'Message', detail: data.message }) ;
            this.router.navigate(["/dashboard/all"]) ;
          },
          error : (err : ApiResponse)=> {
            this.messageService.add({ severity: 'error', summary: 'Message', detail: err.message }) ;

          }
        }
      )
    }
  }

  get f(): { [key: string]: any } {
    return this.passwordForm.controls;
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

}
