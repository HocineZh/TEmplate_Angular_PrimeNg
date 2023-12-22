import { LoginService } from './../../services/login.service';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventBusService } from 'src/app/shared/services/event-bus.service';
import { UserInfoResponse } from '../../model/login';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginButton : any ={
    text: 'Login',
    type: 'default',
    useSubmitBehavior: true,
  }
  loadingVisible : boolean = false ;
  messageErreur !: string ;
  submitted : boolean = false ;
  isLoginFailed : boolean = false ;
  loginForm: FormGroup = new FormGroup({
    login: new FormControl(''),
    password: new FormControl(''),
  });


  constructor(private loginService : LoginService, private router : Router ,  private formBuilder: FormBuilder, private eventBusService : EventBusService ) {

  }



  ngOnInit(): void {
    this.loginService.authCheck().subscribe({
      next : (data :boolean) => {
        if(data){
          this.router.navigate(['/dashboard']) ;
        }
      }
    })

    this.loginForm = this.formBuilder.group(
      {
        login: [
          '',
          [
            Validators.required,
          ]
        ],

        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
          ]
        ]
      }
    );
  }

  get f(): { [key: string]: any } {
    return this.loginForm.controls;
  }


  onFormSubmit (e :any)  {
    this.loadingVisible = true ;
    this.submitted = true ;
    if(this.loginForm.valid){
      this.loginService.login(this.loginForm.value.login, this.loginForm.value.password).subscribe(
        {

          next : (data : UserInfoResponse) => {
            this.isLoginFailed = false ;
            this.eventBusService.setCurrentUser(data);
            this.router.navigate(['/dashboard']) ;
            this.loadingVisible = false ;
          },
          error : (err : any) => {
            this.loadingVisible = false ;
            this.isLoginFailed = true ;
            if(err.status === "LOCKED") {
              this.messageErreur = "Votre compte est blocké vous devez ressayer après qulques minutes !! " ;
            }else {
              this.messageErreur = "Nom d'utilisateur ou mot de passe est incorrect" ;
            }
          }
        }
      )
    }else {
      this.loadingVisible = false ;
      this.isLoginFailed = true ;
    }

  }
}
