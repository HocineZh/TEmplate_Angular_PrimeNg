import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentRoutingModule } from './document-routing.module';
import { ListDocumentComponent } from './components/list-document/list-document.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { HttpClientModule } from '@angular/common/http';
import { DocumentService } from './services/document.service';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { SplitterModule } from "primeng/splitter";
import { AccordionModule } from 'primeng/accordion';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';

import { DividerModule } from 'primeng/divider';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { ChipModule } from 'primeng/chip';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AvatarModule } from 'primeng/avatar';
import { CheckboxModule } from 'primeng/checkbox';
import { PanelModule } from 'primeng/panel';
import { NoteDocumentComponent } from './components/note-document/note-document.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LayoutModule } from 'src/app/shared/template/layout.module';

@NgModule({
  declarations: [
    ListDocumentComponent,
    NoteDocumentComponent
  ],
  imports: [
    CommonModule,
    DocumentRoutingModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    TableModule,
    MenuModule,
    HttpClientModule,
    ToolbarModule,
    DialogModule,
    InputSwitchModule,
    DropdownModule,
    FileUploadModule,
    MessagesModule,
    TabMenuModule,
    SplitterModule,
    AccordionModule,
    PanelMenuModule,
    MultiSelectModule,
    RadioButtonModule,
    DividerModule,
    CalendarModule,
    ChipsModule,
    ChipModule,
    InputTextareaModule,
    SelectButtonModule,
    AvatarModule,
    CheckboxModule,
    PanelModule,
    DividerModule,
    ConfirmDialogModule,
    LayoutModule

  ],

  providers: [DocumentService, MessageService]
})
export class DocumentModule { }
