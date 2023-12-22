import { NgModule , LOCALE_ID } from '@angular/core';
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
import { evenementsRoutingModule } from './evenements-routing.module';


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
import { ToolbarModule } from 'primeng/toolbar';
import { MenuItem, MegaMenuItem, MessageService } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import {PanelModule} from 'primeng/panel';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumber, InputNumberModule } from 'primeng/inputnumber';
import {OrderListModule} from 'primeng/orderlist';
import { PickListModule } from 'primeng/picklist';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { AccordionModule } from 'primeng/accordion';
import { FileUploadModule } from 'primeng/fileupload';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToggleButtonModule } from 'primeng/togglebutton';
import {EditorModule} from 'primeng/editor';
import { ChipModule } from 'primeng/chip';
import { SidebarModule } from 'primeng/sidebar';
import { MenubarModule } from 'primeng/menubar';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import {AvatarModule} from 'primeng/avatar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';

import { EvenementService } from './services/evenement.service';
import { FullCalendarModule } from '@fullcalendar/angular';

import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { LayoutModule } from 'src/app/shared/template/layout.module';
import { ListEvenementsComponent } from './components/list-evenements/list-evenements.component';
import { CalendrierEvenementsComponent } from './components/calendrier-evenements/calendrier-evenements.component';
import { AddEvenementComponent } from './components/add-evenement/add-evenement.component';
import { EditEvenementComponent } from './components/edit-evenement/edit-evenement.component';
import { ImporterModelODJComponent } from './components/importer-model-odj/importer-model-odj.component';
import { AddPointOJComponent } from './components/add-point-oj/add-point-oj.component';
import { EditOdjComponent } from './components/edit-odj/edit-odj.component';
import { FiltersSidebarComponent } from './components/filters-sidebar/filters-sidebar.component';
import { PropositionsMembresOdjComponent } from './components/propositions-membres-odj/propositions-membres-odj.component';
import { ListPointsAjournesOgComponent } from './components/list-points-ajournes-og/list-points-ajournes-og.component';
import { SeancesModule } from '../seances/seances.module';
import { EditMembresComponent } from './components/edit-membres/edit-membres.component';

import { CommentairesPoComponent } from './components/commentaires-po/commentaires-po.component';
import { TranslateModule } from '@ngx-translate/core';
import { ConvocationModule } from '../convocation/convocation.module';
import { ListRemplacementComponent } from './components/list-remplacement/list-remplacement.component';
import { IntervenantsDepotDocumentsComponent } from './components/intervenants-depot-documents/intervenants-depot-documents.component';
import { TraitementPoSeanceComponent } from '../seances/components/traitement-po-seance/traitement-po-seance.component';
import { PrivilegeEvenementDirective } from './directives/privilege-evenement.directive';

registerLocaleData(localeFr, 'fr-FR');

@NgModule({
  declarations: [
    ListEvenementsComponent, CalendrierEvenementsComponent ,AddEvenementComponent, EditEvenementComponent, ImporterModelODJComponent, AddPointOJComponent, EditOdjComponent, PropositionsMembresOdjComponent, ListPointsAjournesOgComponent, FiltersSidebarComponent, EditMembresComponent, PrivilegeEvenementDirective ,CommentairesPoComponent, ListRemplacementComponent, CommentairesPoComponent, IntervenantsDepotDocumentsComponent
  ],
  imports: [
    TranslateModule,
    CommonModule,
    evenementsRoutingModule,
    SeancesModule,
    LayoutModule,
    MenuModule,
    ToolbarModule,
    TimelineModule,
    ButtonModule,
    RippleModule,
    TableModule,
    ChartModule,
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
    MenuModule,
    TabMenuModule,
    PanelModule,
    CheckboxModule,
    InputNumberModule,
    OrderListModule,
    PickListModule,
    ConfirmPopupModule,
    AccordionModule,
    FileUploadModule,
    AutoCompleteModule,
    ToggleButtonModule,
    EditorModule,
    SidebarModule,
    ChipModule,
    MenubarModule,
    PaginatorModule,
    SkeletonModule,
    AvatarModule,
    ProgressSpinnerModule,
    AvatarGroupModule,
    BadgeModule,
    ConvocationModule
  ],exports : [
    EditOdjComponent, FiltersSidebarComponent, EditMembresComponent, TranslateModule , EditMembresComponent , EditOdjComponent
  ],
  providers: [{
    provide: LOCALE_ID,
    useValue: 'fr-FR',
  },EvenementService,MessageService]
})
export class evenementsModule { }
