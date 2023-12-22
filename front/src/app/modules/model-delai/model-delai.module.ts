import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModelDelaiRoutingModule } from './model-delai-routing.module';
import { AddModelDelaiComponent } from './components/add-model-delai/add-model-delai.component';
import { ListModelDelaiComponent } from './components/list-model-delai/list-model-delai.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { TableCheckbox, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { HttpClientModule } from '@angular/common/http';
import { AppConfigModule } from 'src/app/shared/template/config/app.config.module';
import { FileUploadModule } from 'primeng/fileupload';
import { ModelDelaiService } from './services/model-delai.service';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@NgModule({
  declarations: [
    AddModelDelaiComponent,
    ListModelDelaiComponent
  ],
  imports: [
    CommonModule,
    ModelDelaiRoutingModule,
    AppConfigModule,
    TableModule,
    FormsModule,
    ToolbarModule,
    InputNumberModule,
    InputTextModule,
    DialogModule,
    HttpClientModule,
    MessagesModule,
    FileUploadModule,
    ToastModule
  ],
  providers: [ModelDelaiService,MessageService]
})
export class ModelDelaiModule { }
