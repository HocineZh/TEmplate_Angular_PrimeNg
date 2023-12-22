import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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

import { ModelFonctionnaliteRoutingModule } from './model-fonctionnalite-routing.module';
import { AddModelFctComponent } from './components/add-model-fct/add-model-fct.component';
import { ListModelFctComponent } from './components/list-model-fct/list-model-fct.component';
import { UpdateModelFctComponent } from './components/update-model-fct/update-model-fct.component';
import { ModelFonctionnaliteService } from './services/model-fonctionnalite.service';
import { RouterLink, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';


@NgModule({
  declarations: [
    AddModelFctComponent,
    ListModelFctComponent,
    UpdateModelFctComponent
  ],
  imports: [
    CommonModule,
    ModelFonctionnaliteRoutingModule,
    AppConfigModule,
    TableModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    CommonModule,
    DialogModule,
    HttpClientModule,
    MessagesModule,
    RouterModule,
    ToolbarModule,
    RouterModule
  ],
  providers: [ModelFonctionnaliteService,MessageService]
})
export class ModelFonctionnaliteModule { }
