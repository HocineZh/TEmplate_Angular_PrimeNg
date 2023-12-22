import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DossierRoutingModule } from './dossier-routing.module';
import { AddDossierComponent } from './component/add-dossier/add-dossier.component';
import { ListDossierComponent } from './component/list-dossier/list-dossier.component';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DossierService } from './services/dossier.service';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TreeModule } from 'primeng/tree';
import { FileExplorerComponent } from './component/file-explorer/file-explorer.component';
import { TableModule } from 'primeng/table';
import { CreateFolderDialogComponent } from './component/file-explorer/components/create-folder-dialog/create-folder-dialog.component';
import { DeleteFolderDialogComponent } from './component/file-explorer/components/delete-folder-dialog/delete-folder-dialog.component';
import {DialogService} from 'primeng/dynamicdialog';
import { RenameItemDialogComponent } from './component/file-explorer/components/rename-item-dialog/rename-item-dialog.component';
import { UploadFileDialogComponent } from './component/file-explorer/components/upload-file-dialog/upload-file-dialog.component';
import {UploaderComponent} from './component/file-explorer/components/uploader/uploader.component';
import {FileUploadModule} from 'primeng/fileupload';
import {MessageService} from 'primeng/api';
import {CheckboxModule} from 'primeng/checkbox';
import { GrantPermissionDialogComponent } from './component/file-explorer/components/grant-permission-dialog/grant-permission-dialog.component';
import {DragDropModule} from 'primeng/dragdrop';
import { MultiSelectModule } from 'primeng/multiselect';
import {BrowserModule} from '@angular/platform-browser';
import { KeyBoardShortKeyDirective } from './component/file-explorer/directives/key-board-short-key.directive';


@NgModule({
  declarations: [
    AddDossierComponent,
    ListDossierComponent,
    FileExplorerComponent,
    CreateFolderDialogComponent,
    DeleteFolderDialogComponent,
    RenameItemDialogComponent,
    UploadFileDialogComponent,
    UploaderComponent,
    GrantPermissionDialogComponent,
    KeyBoardShortKeyDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DossierRoutingModule,
    ToolbarModule,
    ToastModule,
    DialogModule,
    InputTextModule,
    RadioButtonModule,
    HttpClientModule,
    ButtonModule,
    DropdownModule,
    TreeModule,
    TableModule,
    FileUploadModule,
    CheckboxModule,
    DragDropModule,
    MultiSelectModule,
  ],
  providers : [DossierService, DialogService, MessageService ]
})
export class DossierModule { }
