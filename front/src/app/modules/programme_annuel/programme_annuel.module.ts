import { NgModule,LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuModule } from 'primeng/menu';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { OverlayPanelModule } from 'primeng/overlaypanel';

import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { programme_annuelRoutingModule } from './programme_annuel-routing.module';


import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';

import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DividerModule } from 'primeng/divider';
import { TabViewModule } from 'primeng/tabview';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumber, InputNumberModule } from 'primeng/inputnumber';
import { ChipModule } from 'primeng/chip';
import { SidebarModule } from 'primeng/sidebar';
import { AccordionModule } from 'primeng/accordion';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


import { EvenementPrevisionnelService } from './services/evenementPrevisionnel.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarAppComponent } from './components/calendar/calendar.app.component';
import localeFr from '@angular/common/locales/fr';

import { registerLocaleData } from '@angular/common';
import { evenementsModule } from '../evenements/evenements.module';

import { ToolbarModule } from 'primeng/toolbar';
import { PrivilegeDirective } from 'src/app/shared/directive/privilege.directive';
import { PrivilegeEvenementDirective } from '../evenements/directives/privilege-evenement.directive';
import { PrvFiltersSidebarComponent } from './components/prv-filters-sidebar/prv-filters-sidebar.component';
import { LayoutModule } from 'src/app/shared/template/layout.module';
registerLocaleData(localeFr, 'fr-FR');

@NgModule({
  declarations: [
    CalendarAppComponent,
    PrvFiltersSidebarComponent

  ],
  imports: [
    CommonModule,
    programme_annuelRoutingModule,
    MenuModule,
    evenementsModule,
    TimelineModule,
    ButtonModule,
    RippleModule,
    TableModule,
    ChartModule,
    LayoutModule,
    OverlayPanelModule,
    CardModule,
    InputTextModule,
    InputTextareaModule,
    FormsModule,
    InputSwitchModule,
    SelectButtonModule,
    DividerModule,
    TabViewModule,
    FullCalendarModule,
    DialogModule,
    CalendarModule,
    DropdownModule,
    ToastModule,
    SplitButtonModule,
    ConfirmDialogModule,
    CheckboxModule,
    InputNumberModule,
    ChipModule,
    SidebarModule,
    AccordionModule,
    ProgressSpinnerModule,
    ToolbarModule,



  ],
  providers: [{
    provide: LOCALE_ID,
    useValue: 'fr-FR',
  },EvenementPrevisionnelService]
})
export class programme_annuelModule { }
