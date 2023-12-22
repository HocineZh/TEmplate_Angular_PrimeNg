import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SeancesRoutingModule } from './seances-routing.module';
import { AddSeanceComponent } from './components/add-seance/add-seance.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
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
import { MenuModule } from 'primeng/menu';
import { SeanceService } from './services/seance.service';
import { ListSeanceComponent } from './components/list-seance/list-seance.component';
import { EditSeanceComponent } from './components/edit-seance/edit-seance.component';
import { DatePipe } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { EditPresenceComponent } from './components/edit-presence/edit-presence.component';
import {AvatarModule} from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { InputSwitchModule } from 'primeng/inputswitch';
import { KnobModule } from 'primeng/knob';
import { LayoutModule } from 'src/app/shared/template/layout.module';
import { TraitementPoSeanceComponent } from './components/traitement-po-seance/traitement-po-seance.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';



@NgModule({
  declarations: [
    AddSeanceComponent,
    ListSeanceComponent,
    EditSeanceComponent,
    EditPresenceComponent,
	TraitementPoSeanceComponent
  ],
  imports: [
    CommonModule,
    SeancesRoutingModule,
    CommonModule,
    FormsModule,
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
		MessagesModule,
		RadioButtonModule,
		ReactiveFormsModule,
		MenuModule,
		CheckboxModule,
		AvatarModule,
		AvatarGroupModule,
		InputSwitchModule,
		KnobModule,
		LayoutModule,
		ConfirmDialogModule
  ],
  exports:   [ ListSeanceComponent ],
  providers : [SeanceService,DatePipe]
})
export class SeancesModule { }
