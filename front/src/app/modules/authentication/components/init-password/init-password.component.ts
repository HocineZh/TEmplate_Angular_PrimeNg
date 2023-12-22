import { Component } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginService } from '../../services/login.service';
import { ApiResponse } from 'src/app/shared/models/shared';


@Component({
  selector: 'app-init-password',
  templateUrl: './init-password.component.html',
  styleUrls: ['./init-password.component.scss']
})
export class InitPasswordComponent {

  submitted : boolean = false ;
  hasError : boolean = true ;
  token !: string ;
  messageError !: string | undefined  ;
  passwordForm !: FormGroup ;


  constructor(private loginService : LoginService , private formBuilder: FormBuilder,private messageService : MessageService ,  private activatedRoute : ActivatedRoute, private router : Router ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(
      {
        next : (params : Params) => {
          this.token = params['token'] ;
          this.loginService.verifinitPassword(this.token).subscribe(
            {
              next : (data : ApiResponse) => {
                this.hasError = false ;

              },
              error : (err : ApiResponse) => {
                this.hasError = true ;
                this.messageError = err.message ;
              }
            }
          )
        }
      }
    )

    //Initialiser form
    this.passwordForm = this.formBuilder.group(
      {
        password: ['',[Validators.required , Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{14,}')]],
        confirmPassword: ['',[Validators.required]],
      }, {
        validator: [this.ConfirmedValidator('password', 'confirmPassword')]
      }as AbstractControlOptions

    );
  }

  onFormSubmit(event : any) {
    this.submitted = true ;
    if(this.passwordForm.valid) {
      this.loginService.modifPassword(this.token,this.passwordForm.value.password).subscribe(
        {
          next : (data : ApiResponse) => {
            this.messageService.add({ severity: 'success', summary: 'Message', detail: data.message }) ;
            this.router.navigate(['/login']);
          },
          error : (err : ApiResponse) => {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
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
