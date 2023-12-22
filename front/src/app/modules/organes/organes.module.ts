import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OrganesRoutingModule } from './organes-routing.module';
import { ListOrganeComponent } from './components/list-organe/list-organe.component';
import { AddOrganeComponent } from './components/add-organe/add-organe.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { AutoCompleteModule } from "primeng/autocomplete";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextareaModule } from "primeng/inputtextarea";
import { OrganeService } from './services/organe.service';
import { HttpClientModule } from '@angular/common/http';
import { ToolbarModule } from 'primeng/toolbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import {MessagesModule} from 'primeng/messages';
import { EditOrganeComponent } from './components/edit-organe/edit-organe.component';
import { MembreModule } from '../membres/membre.module';
import { ProgressSpinnerModule } from 'primeng/progressspinner';




@NgModule({
  declarations: [
    ListOrganeComponent,
    AddOrganeComponent,
    EditOrganeComponent
  ],
  imports: [
    AutoCompleteModule,
    ButtonModule,
    CommonModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    InputMaskModule,
    InputNumberModule,
    InputTextareaModule,
		InputTextModule,
    HttpClientModule,
    MembreModule,
    MessagesModule,
    OrganesRoutingModule,
    ProgressBarModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    RatingModule,
    ReactiveFormsModule,
    RippleModule,
		SliderModule,
		TableModule,
    ToastModule,
    ToggleButtonModule,
		ToolbarModule,
  ],
  providers : [OrganeService]
})


export class OrganesModule { }
