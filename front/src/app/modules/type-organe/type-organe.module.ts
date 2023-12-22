import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypeOrganeRoutingModule } from './type-organe-routing.module';
import { AddTypeOrganeComponent } from './components/add-type-organe/add-type-organe.component';
import { ListTypeOrganeComponent } from './components/list-type-organe/list-type-organe.component';
import { EditTypeOrganeComponent } from './components/edit-type-organe/edit-type-organe.component';
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
import { CalendarModule } from "primeng/calendar";
import { ChipsModule } from "primeng/chips";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { InputTextareaModule } from "primeng/inputtextarea";
import { HttpClientModule } from '@angular/common/http';
import { ToolbarModule } from 'primeng/toolbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import {MessagesModule} from 'primeng/messages';
import { LayoutModule } from 'src/app/shared/template/layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddTypeOrganeComponent,
    ListTypeOrganeComponent,
    EditTypeOrganeComponent
  ],
  imports: [
    CommonModule,
    TypeOrganeRoutingModule,
    CommonModule,
    FormsModule,
	ReactiveFormsModule,
		TableModule,
		RatingModule,
		ButtonModule,
		SliderModule,
		ToggleButtonModule,
		RippleModule,
		MultiSelectModule,
		ProgressBarModule,
		ToastModule,
		AutoCompleteModule,
		CalendarModule,
		ChipsModule,
		DropdownModule,
		InputMaskModule,
		InputNumberModule,
		CascadeSelectModule,
		InputTextareaModule,
		InputTextModule,
		HttpClientModule,
		DialogModule,
		ToolbarModule,
    LayoutModule,
		MessagesModule,
		RadioButtonModule
  ]
})
export class TypeOrganeModule { }
