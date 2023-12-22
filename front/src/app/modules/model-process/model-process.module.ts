import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModelProcessRoutingModule } from './model-process-routing.module';
import { ListModelProcessComponent } from './components/list-model-process/list-model-process.component';
import { UpdateModelProcessComponent } from './components/update-model-process/update-model-process.component';
import { ModelProcessService } from './services/model-process.service';
import { AppConfigModule } from 'src/app/shared/template/config/app.config.module';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { HttpClientModule } from '@angular/common/http';
import { MessagesModule } from 'primeng/messages';
import { BrowserModule } from '@angular/platform-browser';
import { AddModelProcessComponent } from './components/add-model-process/add-model-process.component';
import { MessageService } from 'primeng/api';
import { LayoutModule } from 'src/app/shared/template/layout.module';


@NgModule({
  declarations: [
    AddModelProcessComponent,
    ListModelProcessComponent,
    UpdateModelProcessComponent
  ],
  imports: [
    CommonModule,
    ModelProcessRoutingModule,
    AppConfigModule,
    TableModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    InputTextModule,
    InputTextareaModule,
    CommonModule,
    DialogModule,
    HttpClientModule,
    MessagesModule,
    LayoutModule,
    InputTextareaModule,
    ToolbarModule,
    FormsModule
  ],
  providers: [ModelProcessService, MessageService]
})
export class ModelProcessModule { }
