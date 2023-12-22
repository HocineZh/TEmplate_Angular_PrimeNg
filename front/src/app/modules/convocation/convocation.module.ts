import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConvocationRoutingModule } from './convocation-routing.module';

import { ConvocationComponent } from './components/convocation/convocation.component';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';

import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from 'src/app/shared/template/layout.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConvocationService } from './services/convocation.service';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConvocationModelComponent } from './components/convocation-model/convocation-model.component';
import { DialogModule } from 'primeng/dialog';
import { MandatModelComponent } from './components/mandat-model/mandat-model.component';



@NgModule({
  declarations: [ConvocationComponent, ConvocationModelComponent, MandatModelComponent],
  imports: [
    CommonModule,
    ConvocationRoutingModule,
    DialogModule,
    DropdownModule,
    FileUploadModule,
    FormsModule,
    InputTextModule,
    LayoutModule,
    SelectButtonModule,

    ToastModule,
    ToolbarModule
  ],
  providers : [MessageService,ConfirmationService,ConvocationService] ,
  exports :[ConvocationComponent,ConvocationModelComponent]
})
export class ConvocationModule { }
