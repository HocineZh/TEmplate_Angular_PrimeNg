import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import {PasswordModule} from 'primeng/password';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import { LoginService } from './services/login.service';
import { HttpClientModule } from '@angular/common/http';
import { AppConfigModule } from 'src/app/shared/template/config/app.config.module';
import { InitPasswordComponent } from './components/init-password/init-password.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [
    LoginComponent,
    InitPasswordComponent

  ],
  imports: [
    AuthenticationRoutingModule,
    AppConfigModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    InputTextModule,
    PasswordModule,
    ProgressSpinnerModule,
    ReactiveFormsModule,
    ToastModule
  ],
  providers : [LoginService, MessageService]

})
export class AuthenticationModule { }
