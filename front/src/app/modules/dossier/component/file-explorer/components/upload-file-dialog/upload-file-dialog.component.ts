import { Component, OnInit } from '@angular/core';
import {MessageService, TreeNode} from 'primeng/api';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {DocumentType} from 'src/app/modules/dossier/model/document-type.model';
import {Document} from 'src/app/modules/dossier/model/document.model';
import {DocumentService} from 'src/app/modules/dossier/services/document.service';

@Component({
  selector: 'app-upload-file-dialog',
  templateUrl: './upload-file-dialog.component.html',
  styleUrls: ['./upload-file-dialog.component.scss']
})
export class UploadFileDialogComponent implements OnInit{
  parentFolder!: TreeNode;
  loading: boolean = false;
  documentsTypes: any[] = [];
  documents: any[] = [];
  selectedDocumentType!: DocumentType;
  files: any[] = [];
  selectedDocument!: Document;
  ecrasable: boolean = false;
  notable: boolean = false;

  constructor(public ref: DynamicDialogRef,
              public config: DynamicDialogConfig,
              private documentService: DocumentService,
              private messageService: MessageService
              ){
    this.parentFolder = config.data.parentFolder;
    ref.onClose.subscribe(() => {});
  }

  ngOnInit(): void {
    this.getDocumentsType();
    this.getDocuments();
  }

  uploadedFile($event: any[]): void{
    this.files = $event;
  }

  uploadFile(){
    this.loading = !this.loading;
    let formData: FormData = new FormData();

    for(let file of this.files){
      formData.append("files", file);
    }
    formData.append("parentFolder", this.parentFolder.data.dossier.id.toString());
    formData.append("ecrasable", this.ecrasable.toString());
    formData.append("notable", this.notable.toString());
    formData.append("idDocument", this.selectedDocument !== undefined ? this.selectedDocument.id.toString() : "0")

    if(this.selectedDocumentType){
      formData.append("idType", this.selectedDocumentType?.id.toString()); 
    }

    this.documentService.uploadDocument(formData).subscribe({
      next: (result)=>{

        if(result){
          this.messageService.add({ severity: 'success', summary: 'Upload document', detail: "document uploaded successfully" })
        }else{
          this.messageService.add({ severity: 'error', summary: 'Upload document', detail: 'Error'})
        }
        this.ref.close(result);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Upload document', detail: 'Error :' + error.message })
        this.ref.close(false);
      }
    })
  }

  getDocuments(){
    this.documents =  this.parentFolder?.children?.filter(child =>  child.type === "file").filter(child => child.data.version == 1)
    .map(privilegeDoc => privilegeDoc.data.privilegeDocument.document)
     ?? [];
  }

  getDocumentsType(){
    this.documentService.getDocumentsTypes().subscribe({
      next: (response) => {
        this.documentsTypes = response;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Document types', detail: `Error ${error?.message ?? ""}`  })
      }
    })
  }
}
