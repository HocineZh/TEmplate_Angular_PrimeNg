import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrientationRoutingModule } from './orientation-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressSpinnerModule} from 'primeng/progressspinner';
import { InputTextModule} from 'primeng/inputtext';
import { ButtonModule} from 'primeng/button';
import { OrientationService } from './services/orientation.service';
import { HttpClientModule } from '@angular/common/http';
import { AppConfigModule } from 'src/app/shared/template/config/app.config.module';
import { Table, TableModule } from 'primeng/table';
import { Toast, ToastModule} from 'primeng/toast';
import { ToggleButton, ToggleButtonModule} from 'primeng/togglebutton';
import { ProgressBar, ProgressBarModule} from 'primeng/progressbar';
import { Slider, SliderModule} from 'primeng/slider';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { RatingModule } from 'primeng/rating';
import { AddOrientationComponent } from './components/add-orientation/add-orientation.component';
import { UpdateOrientationComponent } from './components/update-orientation/update-orientation.component';
import { ListOrientationComponent } from './components/list-orientation/list-orientation.component';
import { SuiviOrientationComponent } from './components/suivi-orientation/suivi-orientation.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { TimelineModule } from 'primeng/timeline';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { ListboxModule } from 'primeng/listbox';
import { FieldsetModule } from 'primeng/fieldset';
import {SidebarModule} from 'primeng/sidebar';
import { DividerModule } from 'primeng/divider';
import { SplitButtonModule } from 'primeng/splitbutton';
import { LayoutModule } from 'src/app/shared/template/layout.module';
import { GenericLegendComponent } from './components/generic-legend/generic-legend.component';

@NgModule({
  declarations: [
    AddOrientationComponent,
    UpdateOrientationComponent,
    ListOrientationComponent,
    SuiviOrientationComponent,
    GenericLegendComponent
  ],
  imports: [
    OrientationRoutingModule,
    AppConfigModule,
    ButtonModule,
    TableModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    InputTextModule,
    ProgressSpinnerModule,
		ToastModule,
    ToggleButtonModule,
    ProgressBarModule,
    SliderModule,
    DropdownModule,
    RatingModule,
    MultiSelectModule,
    ReactiveFormsModule,
    RadioButtonModule,
    DialogModule,
    FileUploadModule,
    ToolbarModule,
    InputTextareaModule,
    CalendarModule,
    InputNumberModule,
    TimelineModule,
    MessagesModule,
    ListboxModule,
    FieldsetModule,
    ProgressBarModule,
    SidebarModule,
    DividerModule,
    SplitButtonModule,
    LayoutModule

  ],
  providers : [MessageService,ConfirmationService]
})
export class OrientationModule { }
