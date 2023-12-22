import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MembreRoutingModule } from './membre-routing.module';
import { AddMembreComponent } from './components/add-membre/add-membre.component';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AddMembreWithoutMandatComponent } from './components/add-membre-without-mandat/add-membre-without-mandat.component';
import { ListMembreComponent } from './components/list-membre/list-membre.component';
import { MultiSelectModule } from 'primeng/multiselect';



@NgModule({
  declarations: [
    AddMembreComponent,
    AddMembreWithoutMandatComponent,
    ListMembreComponent
  ],
  imports: [
    ToggleButtonModule,
    CalendarModule,
    CommonModule,
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    FileUploadModule,
    FormsModule,
    InputTextModule,
    MembreRoutingModule,
    MultiSelectModule,
    ReactiveFormsModule,
    TableModule,
    ToastModule,
    ToggleButtonModule,
    ToolbarModule,

  ],
  providers :[MessageService,ConfirmationService],
  exports : [AddMembreComponent,AddMembreWithoutMandatComponent]
})
export class MembreModule { }
