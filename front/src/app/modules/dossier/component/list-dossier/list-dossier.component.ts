import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService, SelectItem, TreeNode } from 'primeng/api';
import { DocumentService } from 'src/app/modules/document/services/document.service';
import { Folder } from '../../model/folder';
import { DossierService } from '../../services/dossier.service';

@Component({
  selector: 'app-list-dossier',
  templateUrl: './list-dossier.component.html',
  styleUrls: ['./list-dossier.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ListDossierComponent implements OnInit {

  folders: Folder[] = [];
  parent : Folder ={}
  folder: Folder = {};

  files: TreeNode[] = [];

  message : string = '';

  selectedFolder: Folder = {};
  visibilite : string ='';
  submitted: boolean = false;
  productDialog: boolean = false;

  constructor(private dossierService: DossierService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService) {
                /*this.folders = [
                  {designation: 'Folder 1', parent: 1, icon: 'pi pi-folders'},
                  {designation: 'Folder 2', parent: 1, icon: 'pi pi-folders'},
                  {designation: 'Folder 3', parent: 1, icon: 'pi pi-folders'},
                  {designation: 'Folder 4', parent: 1, icon: 'pi pi-folders'},
                  {designation: 'Folder 5', parent: 1, icon: 'pi pi-folders'},
                  {designation: 'Folder 6', parent: 1, icon: 'pi pi-folders'},
                  {designation: 'Folder 7', parent: 1, icon: 'pi pi-folders'},
                  {designation: 'Folder 8', parent: 1, icon: 'pi pi-folders'},
                  {designation: 'Folder 9', parent: 1, icon: 'pi pi-folders'},
                  {designation: 'Folder 10', parent: 1, icon: 'pi pi-folders'},
              ];*/
  }

  ngOnInit() {
    this.dossierService.getFoldersLarge().then(data => this.folders = data);
    this.dossierService.getFiles().then(f => this.files = f);
  }

  openNew() {
    this.folder = {
      id: 0,
      designation: '',
      parent: 0,
      icon: 'pi pi-folder'
    };
    this.submitted = false;
    this.productDialog = true;
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }
  createFolder() {
    this.dossierService.save(this.folder.parent!, this.folder).subscribe(data => this.folders.push(this.folder));
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Dossier Créer', life: 3000 });
  }
}
