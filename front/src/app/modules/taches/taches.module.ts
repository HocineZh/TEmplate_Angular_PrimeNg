import { AddTacheComponent } from './components/add-tache/add-tache.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AvatarModule } from 'primeng/avatar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CreerModeleComponent } from './components/creer-modele/creer-modele.component';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DropdownModule } from 'primeng/dropdown';
import { EventListComponent } from './components/event-list/event-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InplaceModule } from 'primeng/inplace';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { LayoutModule } from 'src/app/shared/template/layout.module';
import { ListModelesComponent } from './components/list-modeles/list-modeles.component';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgModule } from '@angular/core';
import { OrderListModule } from 'primeng/orderlist';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { TacheCardComponent } from './components/kanban/tache-card/tache-card.component';
import { TacheKanbanAppComponent } from './components/kanban/tache-kanban-parent/kanban.app.component';
import { TacheKanbanService } from './services/tache-kanban.service';
import { TacheListComponent } from './components/kanban/tache-list/tache-list.component';
import { TacheSidebarComponent } from './components/kanban/tache-sidebar/tache-sidebar.component';
import { TachesRoutingModule } from './taches-routing.module';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';




@NgModule({
  declarations: [AddTacheComponent, CreerModeleComponent, EventListComponent, ListModelesComponent, TacheCardComponent, TacheKanbanAppComponent, TacheListComponent, TacheSidebarComponent],
  imports: [
    AutoCompleteModule,
    AvatarGroupModule,
    AvatarModule,
    //BrowserAnimationsModule,
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    ChipsModule,
    CommonModule,
    ConfirmDialogModule,
    DialogModule,
    DividerModule,
    DragDropModule,
    DropdownModule,
    FormsModule,
    InplaceModule,
    InputNumberModule,
    InputTextareaModule,
    InputTextModule,
    LayoutModule,
    MenuModule,
    MultiSelectModule,
    OrderListModule,
    OverlayPanelModule,
    PanelMenuModule,
    PickListModule,
    ProgressBarModule,
    ReactiveFormsModule,
    RippleModule,
    SidebarModule,
    TableModule,
    TachesRoutingModule,
    TieredMenuModule,
    ToastModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule
  ],
  providers : [ConfirmationService, MessageService, TacheKanbanService]
})
export class TachesModule { }
