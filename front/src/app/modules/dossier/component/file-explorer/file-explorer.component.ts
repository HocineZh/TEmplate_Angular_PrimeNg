import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MessageService, TreeNode} from 'primeng/api';
import {DossierService} from '../../services/dossier.service';
import {getPrimeNGIconFromMimeType} from '../../_helper';
import {DialogService} from 'primeng/dynamicdialog';
import {CreateFolderDialogComponent} from './components/create-folder-dialog/create-folder-dialog.component';
import {DeleteFolderDialogComponent} from './components/delete-folder-dialog/delete-folder-dialog.component';
import {RenameItemDialogComponent} from './components/rename-item-dialog/rename-item-dialog.component';
import {UploadFileDialogComponent} from './components/upload-file-dialog/upload-file-dialog.component';
import {GrantPermissionDialogComponent} from './components/grant-permission-dialog/grant-permission-dialog.component';
import {PrivilegeDos} from '../../model/privilege-dos';
import {SharedServiceService} from '../../services/shared-service.service';
import {Observable, Subscription, map, of, switchMap} from 'rxjs';
import {EventBusService} from 'src/app/shared/services/event-bus.service';
import {User} from 'src/app/modules/users/model/user';
import {DocumentService} from '../../services/document.service';
import {ActivatedRoute} from '@angular/router';
import {childrenDosResponse} from '../../model/privilege-dos-response';
import {ApiResponse} from 'src/app/shared/models/shared';
import {Dossier} from '../../model/dossier.model';
import {PrivDocument} from '../../model/priv-document.model';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss']
})
export class FileExplorerComponent implements OnInit, OnDestroy {

  folders: TreeNode[]=[];

  currentFolder!: TreeNode;
  path: TreeNode[] = [];
  selectedItems: TreeNode[] = [];
  getMoreFoldersLoading: boolean = false;
  selectedViewMode: "grid"|"list" = "grid";

  searchKeyword: string =""
  targetFolder !: number;
  onBegin: boolean = false;
  modelOpened: boolean = false;
  keyListnerSubscripte: Subscription;

  @ViewChild("seachInput" ) searchInput!: ElementRef;

  constructor(  private folderService: DossierService,
                private documentService: DocumentService,
                private dialogService: DialogService,
                private messageService: MessageService,
                private keyBoardEventListerService: SharedServiceService,
                private eventBusService: EventBusService,
                private route : ActivatedRoute
                ) { 
                  this.keyListnerSubscripte = this.keyBoardEventListerService.keyboardEventListner.subscribe({
                    next: (eventName: string) => {
                      switch (eventName) {
                        case "new-folder":
                          this.openNewFolderDialog()
                          break
                        case "upload":
                            this.openUploadFileDialog()
                            break
                        case "delete":
                            this.openDeleteItemDialog()
                            break
                        case "grant-permission":
                            this.openGrantPermissionDialog()
                            break
                        case "rename":
                            this.openRenameItemDialog()
                            break
                      case "refresh":
                            this.refresh()
                            break
                            case "search":
                            this.searchInput.nativeElement.focus()
                            break
                        default:
                          break;
                      }
                    }
                  })
                 }
  ngOnDestroy(): void {
    this.keyListnerSubscripte?.unsubscribe();
  }
  ngOnInit(): void {
     this.route.params.subscribe((params) => {
      this.targetFolder = Number(params["parentId"] ?? "1") ?? 1
      this.getUserFolders(this.targetFolder, this.targetFolder !== 1);
     });
  }

  getUserFolders(parentId: number, onBegin = false): void {
    this.getMoreFoldersLoading = true;
    this.onBegin = onBegin;
      this.folderService.getAuthUserFolders(parentId, this.searchKeyword).subscribe({
        next: (response: childrenDosResponse): void =>  {
          this.getMoreFoldersLoading = false;
      
          let object : TreeNode = {
            data: response.dossier,
            type: "folder",
            label: response.dossier.designation,
            expandedIcon: 'pi pi-folder-open', 
            collapsedIcon: 'pi pi-folder', 
            icon: 'pi pi-folder folder-icon', 
            children: []
          }
      
          let subFolder: TreeNode[] = (response.children.map((subFolder) =>{
            return {
              data: subFolder,
              type: "folder",
              label: subFolder.dossier.designation,
              expandedIcon: 'pi pi-folder-open', 
              collapsedIcon: 'pi pi-folder', 
              icon: 'pi pi-folder folder-icon',
              children: []
            }
          }))
      
          let documents: TreeNode[] = []; 
          response.documents.forEach((doc): any => {
            doc.document.version.forEach((docversion) => {
              documents.push({
                data: {
                  privilegeDocument: doc,
                  version: docversion.version
                },
                type: "file",
                label: doc.document.nom + (docversion.version !== 1 ? ` ( version ${docversion.version} )` : ""),
                icon:  getPrimeNGIconFromMimeType(doc.document.mimeType),
              })
            })
          })
      
          object.children = subFolder.concat(documents)
          if(parentId == 1 || onBegin){
            this.folders = [];
            this.path = [];
            this.folders.push(object);
            this.currentFolder = this.folders[0];
            this.path.push(this.currentFolder)
          }

          this.selectedItems = [];
          this.currentFolder.children = object.children;  
          onBegin = false;
        },
        error: (error: ApiResponse)=>{
          this.folders = [];
          this.getMoreFoldersLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error :' + error.message })
        }
      })
    
    
  }

  doubleClick(item: TreeNode){
    if(item.type === "folder"){
      this.selectedItems = [];
      this.currentFolder = item
      this.getUserFolders(this.currentFolder.data?.dossier.id ?? 1);
      this.path = this.buildPath() ?? [];
    }
  }

  buildPath(folderTree: TreeNode[] = this.folders, currentPath: TreeNode[] = []): TreeNode[] | null{
    for (const node of folderTree) {
      const newPath = [...currentPath, node];
      if (node === this.currentFolder) {
        return newPath;
      }else{
        const pathInChild = this.buildPath(node.children, newPath);
        if (pathInChild) {
          return pathInChild;
        }
      }
    }
  
    return null; // Folder not found
  }

//  buildTreeNode(folders: Dossier[], index: number = 0): TreeNode[] {
//     const children: TreeNode[] = [];
  
//     while (index < folders?.length ) {
//       const folder = folders[index];
//       const treeNode: TreeNode = { 
//         data: folder,
//         type: "folder",
//         label: folder.designation,
//         expandedIcon: 'pi pi-folder-open', 
//         collapsedIcon: 'pi pi-folder', 
//         icon: 'pi pi-folder folder-icon', 
//       };
  
//       // Check if the next folder is a child of the current folder
//       const subfolders = this.buildTreeNode(folders, index + 1);
//       if (subfolders.length > 0) {
//         treeNode.children = subfolders;
//       }
  
//       children.push(treeNode);
  
//       // Move to the next folder at the same level
//       index++;
//     }
  
//     return children;
//   }

  singleClick(selectedItem: TreeNode){
      if(this.selectedItems.find(item => item == selectedItem) !== undefined){
        this.selectedItems = this.selectedItems.filter(item => item != selectedItem);
      }else{
        this.selectedItems.push(selectedItem);
      }
  }

  refresh(){
    this.getUserFolders(this.currentFolder?.data?.dossier?.id ?? 1);
  }

  onSelectFromTree($event: any){
    if(this.currentFolder?.data?.dossier?.id !== undefined || this.currentFolder !== $event.node){
      if($event.node.type === "folder"){
        this.doubleClick($event.node);
      }else{
        this.currentFolder = $event.node.parent;
      }
      this.singleClick($event.node);
    }
    this.path = this.buildPath() ?? [];
  }

  returnBack(index = this.path.length){
    if(index > 1){
      this.currentFolder = this.path[index - 2]
      this.path = this.path.slice(0, this.path.indexOf(this.currentFolder) + 1);
    }
  }

  goTo(index: number): void {
    this.currentFolder = this.path[index]
    this.path = this.path.slice(0, index + 1);
  }


  parentHasPermission(permission:string){
    return this.currentFolder?.data?.privilege?.includes(permission) ?? false

  }

  hasPermission(permission : string){
    let selectedFolders = this.selectedItems.filter(item => item.type === "folder");
    let foldersHasPermission = selectedFolders.filter(folder => folder.data?.privilege?.includes(permission) ?? false);
    let selectedDocuments = this.selectedItems.filter(item => item.type === "file");
    let documentsHasPermissions = selectedDocuments.filter(document => document.data?.privilegeDocument?.privilege.includes(permission) ?? false);
    if((selectedFolders.length > 0 && foldersHasPermission.length == 0) || (selectedDocuments.length > 0 && documentsHasPermissions.length == 0)){
      return false;
    }
    return true;
  }

  isOwner(): Observable<boolean>{
    let selectedFolders = this.selectedItems.filter(item => item.type === "folder");
    let selectedDocuments = this.selectedItems.filter(item => item.type === "file");
    return this.eventBusService.getCurrentUser().pipe(
        map((currentUser: User) => {
          let foldersOwner = selectedFolders.filter(folder => currentUser.id === folder.data.dossier.owner.id);
          let documentsOwner = selectedDocuments.filter(document =>currentUser.id === document.data.privilegeDocument.document.owner.id);
          if((selectedFolders.length > 0 && foldersOwner.length == 0) || (selectedDocuments.length > 0 && documentsOwner.length == 0)){
            return false;
          }
          return true;
        })
      ); 
  }

  
  openNewFolderDialog(){
    if(!this.modelOpened && this.parentHasPermission("w")){
      this.modelOpened = true
      const ref = this.dialogService.open(CreateFolderDialogComponent, {
        header: 'Nouveau dossier',
        modal: true,
        data: {path: this._pathToString()}
      }).onClose.subscribe((res: boolean) => {
        this.modelOpened = false
        if(res){
          this.refresh()
        }
      });
    }
    
  }

  openDeleteItemDialog(){
    if(!this.modelOpened && this.hasPermission("d")){
        this.modelOpened = true;
        this.dialogService.open(DeleteFolderDialogComponent, {
          header: "Supprimer un élément",
          modal: true,
          data: {parentFolder: this.currentFolder, selectedItems: this.selectedItems}
        }).onClose.subscribe({
          next: (response) => {
            this.modelOpened = false;
            if(response){
              this.refresh();
            }
          }
        })
    }
    
  }

  openRenameItemDialog(){
    if(!this.modelOpened && this.hasPermission("w") && this.selectedItems.length === 1){
      this.modelOpened = true;
      const ref = this.dialogService.open(RenameItemDialogComponent, {
        header: "Renommer l'élément",
        modal: true,
        data: {parentFolder: this.currentFolder, item: this.selectedItems[0], path: this._pathToString()}
      }).onClose.subscribe({
        next:(response) => {
          this.modelOpened = false;
          if(response){
            this.refresh()
          }
        }
      })
    }
    
  }
  openUploadFileDialog(){
    if(!this.modelOpened && this.parentHasPermission("w")){
      this.modelOpened = true;
      this.dialogService.open(UploadFileDialogComponent, {
        header: "importer un fichier",
        modal: true,
        data: {parentFolder: this.currentFolder}
      }).onClose.subscribe({
        next: (response) => {
          this.modelOpened = false;
          if(response){
            this.refresh();
          }
        }
      })
    }
  }

  openGrantPermissionDialog(){
      this.modelOpened = true;
      this.dialogService.open(GrantPermissionDialogComponent, {
        header: "Accorder des permissions",
        modal: true,
        data: {items: this.selectedItems}
      }).onClose.subscribe({
        next: (response) => {
          this.modelOpened = false
          if(response){
            this.refresh();
          }
        }
      })
    
  }


  download(){
    let selectedFolders = this.selectedItems.filter(item => item.type === "folder").map((item: TreeNode<PrivilegeDos> )=>{return item.data?.dossier.id ?? 0});
    let selectedDocuments = this.selectedItems.filter(item => item.type === "file").map((item: TreeNode<any> )=>{return {documentId : item.data?.privilegeDocument.document.id ?? 0, version : item.data?.version ?? 1}});
    let data = {
      "documents": selectedDocuments,
      "folders":selectedFolders
    }
    this.documentService.download(data).subscribe({
        next: (response) => {
          var binaryData = [];
          binaryData.push(response.data);
          var url = window.URL.createObjectURL(new Blob(binaryData));
          var a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.setAttribute('target', 'blank');
          a.href = url;
          a.download = "download_gogs.zip";
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
        },
        error: (error) => {

        }
      })
  }

  _pathToString(){
    return (this.path.filter(path => path.data?.dossier !== undefined).map((path: TreeNode) => {
      return path.data.dossier?.designation}
      )).join('/').toString()
  }
}
