import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InitPasswordComponent } from './components/init-password/init-password.component';

const routes: Routes = [
  { path: "",
      children : [
        {path : "" ,redirectTo : "login" ,pathMatch: 'prefix' },
        {path : "login" , component : LoginComponent },
        {path : "initPassword" , component : InitPasswordComponent }
      ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
