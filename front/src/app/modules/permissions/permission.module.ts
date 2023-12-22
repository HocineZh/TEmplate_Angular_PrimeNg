import { InputTextareaModule } from 'primeng/inputtextarea';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionRoutingModule } from './permission-routing.module';
import { ListRolesComponent } from './components/list-roles/list-roles.component';
import { AddRoleComponent } from './components/add-role/add-role.component';
import { ListPrivilegesComponent } from './components/list-privileges/list-privileges.component';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PickListModule } from 'primeng/picklist';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { SplitPipe } from 'src/app/shared/pipe/split.pipe';
import { LayoutModule } from 'src/app/shared/template/layout.module';


@NgModule({
  declarations: [
    AddRoleComponent,
    ListPrivilegesComponent,
    ListRolesComponent,

  ],
  imports: [
    ButtonModule,
    CalendarModule,
    CommonModule,
    ConfirmDialogModule,
    DialogModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    MultiSelectModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    PermissionRoutingModule,
    PickListModule,
    RadioButtonModule,
    ReactiveFormsModule,
    LayoutModule
  ],
  providers : [ConfirmationService, MessageService]

})
export class RoleModule { }
