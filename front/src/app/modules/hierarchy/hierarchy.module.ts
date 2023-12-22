import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HierarchyRoutingModule } from './hierarchy-routing.module';
import { ListSocieteComponent } from './components/list-societe/list-societe.component';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog' ;
import { LayoutModule } from 'src/app/shared/template/layout.module';
import { SliderModule } from 'primeng/slider';
import { ToolbarModule } from 'primeng/toolbar';


@NgModule({
  declarations: [
    ListSocieteComponent,
  ],
  imports: [
    ButtonModule,
    CommonModule,
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    HierarchyRoutingModule,
    InputTextModule,
    LayoutModule,
    SliderModule,
    TableModule,
    ToastModule,
    ToolbarModule
  ],
  providers : [ConfirmationService,MessageService]

})
export class HierarchyModule { }
