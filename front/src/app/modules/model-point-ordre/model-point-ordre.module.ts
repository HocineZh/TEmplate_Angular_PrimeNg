import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListModelPojComponent } from './component/list-model-poj/list-model-poj.component';
import { AddModelPojComponent } from './component/add-model-poj/add-model-poj.component';
import { UpdateModelPojComponent } from './component/update-model-poj/update-model-poj.component';
import { ModelPointOrdreRoutingModule } from './model-point-ordre-routing.module';
import { AppConfigModule } from 'src/app/shared/template/config/app.config.module';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
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
import { MessagesModule } from 'primeng/messages';
import { HttpClientModule } from '@angular/common/http';
import { ModelPointOrdreService } from './services/model-point-ordre.service';
import { SetModelPojComponent } from './component/set-model-poj/set-model-poj.component';
import { PickListModule } from 'primeng/picklist';
import { OrderListModule } from 'primeng/orderlist';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { DataViewModule } from 'primeng/dataview';
import { ModelOrdreJourService } from '../model-ordre-jour/services/model-ordre-jour.service';
import { MessageService } from 'primeng/api';


@NgModule({
  declarations: [
    ListModelPojComponent,
    AddModelPojComponent,
    UpdateModelPojComponent,
    SetModelPojComponent
  ],
  imports: [
    CommonModule,
    ModelPointOrdreRoutingModule,
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
    DataViewModule,
		PickListModule
  ],
  providers: [ModelPointOrdreService,MessageService],
  exports : [SetModelPojComponent]
})
export class ModelPointOrdreModule { }
