import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionMembreRoutingModule } from './permission-membre-routing.module';
import { AddProfilComponent } from './compoenents/add-profil/add-profil.component';
import { ListProfilComponent } from './compoenents/list-profil/list-profil.component';
import { ListPrivilegesComponent } from './compoenents/list-privileges/list-privileges.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PermissionMembreService } from './services/permission-membre.service';
import { PickListModule } from 'primeng/picklist';
import { RadioButtonModule } from 'primeng/radiobutton';
import { LayoutModule } from 'src/app/shared/template/layout.module';


@NgModule({
  declarations: [
    AddProfilComponent,
    ListProfilComponent,
    ListPrivilegesComponent
  ],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DialogModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    PermissionMembreRoutingModule,
    PickListModule,
    RadioButtonModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    LayoutModule
  ],
  providers:[MessageService,ConfirmationService,PermissionMembreService]
})
export class PermissionMembreModule { }
