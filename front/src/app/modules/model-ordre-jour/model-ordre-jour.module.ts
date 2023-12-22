import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
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
import { ModelOrdreJourService } from './services/model-ordre-jour.service';
import { AppConfigModule } from 'src/app/shared/template/config/app.config.module';
import { ModelOrdreJourRoutingModule } from './model-ordre-jour-routing.module';
import { AddModelOjComponent } from './components/add-model-oj/add-model-oj.component';
import { UpdateModelOjComponent } from './components/update-model-oj/update-model-oj.component';
import { ListModelOjComponent } from './components/list-model-oj/list-model-oj.component';
import { HttpClientModule } from '@angular/common/http';
import { MessagesModule } from 'primeng/messages';
import { ViewModelOjComponent } from './components/view-model-oj/view-model-oj.component';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { SetModelPojComponent } from '../model-point-ordre/component/set-model-poj/set-model-poj.component';
import { ModelPointOrdreModule } from '../model-point-ordre/model-point-ordre.module';

@NgModule({
    declarations: [
       
        AddModelOjComponent,
        UpdateModelOjComponent,
        ListModelOjComponent,
        ViewModelOjComponent,
        
    ],
    imports: [
        ModelOrdreJourRoutingModule,
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
        DividerModule,
        ModelPointOrdreModule
    ],
    providers: [ModelOrdreJourService,MessageService]
})
export class ModelOrdreJourModule { }