import { Component } from '@angular/core';
import {MessageService, TreeNode} from 'primeng/api';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {Dossier} from 'src/app/modules/dossier/model/dossier.model';
import {DocumentService} from 'src/app/modules/dossier/services/document.service';
import {DossierService} from 'src/app/modules/dossier/services/dossier.service';

@Component({
  selector: 'app-rename-item-dialog',
  templateUrl: './rename-item-dialog.component.html',
  styleUrls: ['./rename-item-dialog.component.scss']
})
export class RenameItemDialogComponent {
  parentFolder!: Dossier;

  path: string = "";

  item!: TreeNode;

  loading: boolean = false;

  folderName: string = "";

  constructor(private ref: DynamicDialogRef,
              private config: DynamicDialogConfig,
              private dossierService: DossierService,
              private documentService: DocumentService,
              private messageService: MessageService
              ){
    this.parentFolder = config.data.parentFolder;
    this.item = config.data.item
    this.path = config.data.path
  }

  renameItem(){
    if(this.item.type === "folder"){
      this.dossierService.renameFolder(this.path + "/" + this.item?.data?.dossier?.designation ?? "", this.path + "/" + this.folderName).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Renommer un dossier', detail: "Nom du dossier mis à jour avec succès" })
          this.ref.close(response);
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error :' + error.message })
          this.ref.close(false);
        }
      })
    }else{
      this.documentService.renameDocument(this.item.data.document.document.id, this.folderName).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Renommer un document', detail: "Le nom du document a été mis à jour avec succès" })
          this.ref.close(response);
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error :' + err.message })
          this.ref.close(false);
        }
      })
    }
  }
}
