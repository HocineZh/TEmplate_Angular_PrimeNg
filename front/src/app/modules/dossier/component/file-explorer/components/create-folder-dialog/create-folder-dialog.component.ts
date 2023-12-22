import { AfterViewChecked, Component, ElementRef, ViewChild } from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import {DossierService} from 'src/app/modules/dossier/services/dossier.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-create-folder-dialog',
  templateUrl: './create-folder-dialog.component.html',
  styleUrls: ['./create-folder-dialog.component.scss']
})
export class CreateFolderDialogComponent implements AfterViewChecked {
  
  path: string = "";
  loading: boolean = false;
  @ViewChild("folderNameInput") folderNameInput!: ElementRef;

  folderName: String = "";

  constructor(public ref: DynamicDialogRef,private messageService: MessageService , public config: DynamicDialogConfig, private dossierService: DossierService){
    this.path = config.data.path;
  }
  ngAfterViewChecked(): void {
    this.folderNameInput.nativeElement.focus();
  }

  createFolder(){
    this.loading = true;

    let data = {
      folderName: this.folderName,
      path: this.path
    }
    this.dossierService.createFolder(data).subscribe({
      next: (response) => {
        if(response){
          this.messageService.add({ severity: 'success', summary: 'Create folder', detail: "Folder created successfully" })
        }
        this.ref.close(response);
      },
      error: (error) => {
        this.ref.close(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error :' + error.message })
      }
    })
  }
}
