import { Component } from '@angular/core';
import {MessageService, TreeNode} from 'primeng/api';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {forkJoin} from 'rxjs';
import {Dossier} from 'src/app/modules/dossier/model/dossier.model';
import {PrivilegeDos} from 'src/app/modules/dossier/model/privilege-dos';
import {DocumentService} from 'src/app/modules/dossier/services/document.service';
import {DossierService} from 'src/app/modules/dossier/services/dossier.service';

@Component({
  selector: 'app-delete-folder-dialog',
  templateUrl: './delete-folder-dialog.component.html',
  styleUrls: ['./delete-folder-dialog.component.scss']
})
export class DeleteFolderDialogComponent {
  parentFolder!: Dossier;
  selectedItems: TreeNode[] = [];
  loading: boolean = false;
  allVersions: boolean = false;

  folderName: String = "";

  constructor(  private ref: DynamicDialogRef,
                private config: DynamicDialogConfig,
                private dossierService: DossierService,
                private documentService: DocumentService,
                private messageService: MessageService
              ){
    this.parentFolder = this.config.data.parentFolder;
    this.selectedItems = this.config.data.selectedItems;
    this.ref.onClose.subscribe(() => {return this.folderName});
  }

  removeItem(){
    this.loading = !this.loading;
    let selectedFolders = this.selectedItems.filter(item => item.type === "folder");
    let selectedDocuments = this.selectedItems.filter(item => item.type === "file");
      this.remove(selectedFolders, selectedDocuments);
  }

  remove(selectedFolders: TreeNode[], selectedDocuments: TreeNode[]){

    let folderData = selectedFolders.map((folder:  TreeNode<PrivilegeDos>)=>{return folder.data?.dossier?.id});
    let documentData = selectedDocuments.map((doc ) => {return {documentId: doc.data.privilegeDocument.document.id, version : doc.data.version}});
    forkJoin([this.dossierService.deleteFolder({itemsToDelete: folderData}), this.documentService.deleteDocument({docVersions: documentData})])
    .subscribe({
      next: (response)=>{
        if(response[0] && response[1]){
          this.ref.close(response);
          this.messageService.add({ severity: 'success', summary: 'Suppression', detail: "les éléments sélectionnée supprimé avec succès" })
        }
      },
      error: (error) => {
        this.ref.close(false);
        this.messageService.add({ severity: 'error', summary: 'Suppression', detail: 'Error :' + error.message })
      }
    })
  }
}
