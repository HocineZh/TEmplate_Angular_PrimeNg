import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ListUserComponent } from './components/list-user/list-user.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { UserRoutingModule } from './user-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from "primeng/multiselect";
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { PasswordModule } from 'primeng/password';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LayoutModule } from 'src/app/shared/template/layout.module';
import { ListUserLogsComponent } from './components/list-user-logs/list-user-logs.component';
import { RenitPasswordComponent } from './components/renit-password/renit-password.component';
import { DatePipe } from '@angular/common';



@NgModule({
  declarations: [
    ListUserComponent,
    AddUserComponent,
    ListUserLogsComponent,
    RenitPasswordComponent
  ],
  imports: [
    ButtonModule,
    CalendarModule,
    CardModule,
    ChartModule,
    CommonModule,
    ConfirmDialogModule,
    DropdownModule,
    FormsModule,
    HttpClientModule,
    InputNumberModule,
    InputTextareaModule,
    InputTextModule,
    LayoutModule,
    MenuModule,
    MultiSelectModule,
    OverlayPanelModule,
    PasswordModule,
    RippleModule,
    RadioButtonModule,
    RatingModule,
    ReactiveFormsModule,
    TableModule,
    ToastModule,
    ToggleButtonModule,
		ToolbarModule,
    UserRoutingModule
  ],
  providers : [MessageService,ConfirmationService,DatePipe ]

})
export class UserModule { }
