import { Component, OnInit } from '@angular/core';
import {MessageService, TreeNode} from 'primeng/api';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {BehaviorSubject, forkJoin} from 'rxjs';
import {PrivilegeDos} from 'src/app/modules/dossier/model/privilege-dos';
import {UserPermission} from 'src/app/modules/dossier/model/user-permission.model';
import {DocumentService} from 'src/app/modules/dossier/services/document.service';
import {DossierService} from 'src/app/modules/dossier/services/dossier.service';
import {User} from 'src/app/modules/users/model/user';
import {UserService} from 'src/app/modules/users/services/user.service';

@Component({
  selector: 'app-grant-permission-dialog',
  templateUrl: './grant-permission-dialog.component.html',
  styleUrls: ['./grant-permission-dialog.component.scss']
})
export class GrantPermissionDialogComponent implements OnInit{
  path: string = "";
  loading: boolean = false;
  items!: TreeNode[];
  permission$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  activeUsers: User[]= [];
  selectedUsers: UserPermission[]= [];
  hasEmptyPrivilege: UserPermission[]= [];
  currentUserIndex: number[] = [];
  draggedItem : User | undefined | null;;
  readPermissions: boolean = false;
  writePermissions: boolean = false;
  deletedPermission: boolean = false;
  loadingGetUser: boolean = false;
  searchInput: string = ""

 constructor( public ref: DynamicDialogRef,
              private messageService: MessageService ,
              private config: DynamicDialogConfig,
              private userService: UserService ,
              private dossierService: DossierService,
              private documentService: DocumentService
              ){
      this.items = this.config.data.items;
 }
  ngOnInit(): void {
    if(this.items.length === 1){
      this.getAlreadySelectedUsers();
    }else{
      this.getActiveUsers();
    }
    this.permission$.asObservable().subscribe({
      next: (perm) => {
        this.currentUserIndex.forEach(index => {
          let trimedPerm = perm.trim();
          this.selectedUsers[index].privilege = trimedPerm;
          if(trimedPerm == ""){
            this.hasEmptyPrivilege.push(this.selectedUsers[index]);
          }else{
            this.hasEmptyPrivilege = this.hasEmptyPrivilege.filter(item => item.user.id !==this.selectedUsers[index].user.id);
          }
        })
      }
    })
  }

  dragStart(user: User) {
    this.draggedItem = user;
}

drop() {
    if (this.draggedItem) {
        let userPrivilege: UserPermission = {user: this.draggedItem, privilege :""}
        let draggedItemIndex = this.activeUsers.findIndex((item) => {return item.id === this.draggedItem?.id} );
        this.selectedUsers = [...(this.selectedUsers as UserPermission[]), userPrivilege];
        this.activeUsers = this.activeUsers?.filter((val, i) => i != draggedItemIndex);
        this.draggedItem = null;
        this.hasEmptyPrivilege.push(userPrivilege);
    }
}

userNotHasPrivilege(userPerm: UserPermission){
  return this.hasEmptyPrivilege.find(item =>{ return  item.user.id === userPerm.user.id}) !== undefined;
}

setReadPermission($event: any){
  if(this.writePermissions == false && this.deletedPermission == false){
    this.readPermissions = false;
  }else{
    this.readPermissions = true;
  }
  this.setPermission();
}

selectUser(user: User){
  this.draggedItem = user;
  this.drop();
}

unSelectUser(user: User) {
  let draggedItemIndex = this.selectedUsers.findIndex((u) => {return u.user.id === user.id} );
  this.activeUsers = [...(this.activeUsers as User[]), user];
  this.selectedUsers = this.selectedUsers?.filter((val, i) => i != draggedItemIndex);
}

dragEnd() {
    this.draggedItem = null;
}

getActiveUsers(keyWords: string = "null"): void{
  this.loadingGetUser = true;
  this.userService.getActiveUser(keyWords).subscribe({
    next: (response): void => {
      this.loadingGetUser = false;
      this.activeUsers = this.filterUserIFSelected(response)
    },
    error: (err): void => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error :' + err?.message ?? "" })
    }
  })
}

onSearchInputChange($event: any): void{
  if(this.searchInput.length > 0){
    this.getActiveUsers(this.searchInput);
  }else{
    this.getActiveUsers();
  }
}

// getUserByIndex(index: number) {
//   return this.selectedUsers[index]
// }

filterUserIFSelected(usersArray: User[]): User[]{
  return usersArray.filter((user) => {return this.selectedUsers.findIndex(selectedUser => {return selectedUser.user.id == user.id}) === -1})
}

 grantPermission(){
  //let  selectedIds = this.selectedUsers.map(({  user }) => user.id);
  let selectedFolders = this.items.filter(item => item.type === "folder").map((item: TreeNode<PrivilegeDos> )=>{return item.data?.dossier.id ?? 0});
  let selectedDocuments = this.items.filter(item => item.type === "file").map((item: TreeNode<any> )=>{return item.data?.privilegeDocument.document.id ?? 0});
  let Documentsdata = {
    itemsId: selectedDocuments,
    users: this.selectedUsers,
  }
  let Foldersdata = {
    itemsId: selectedFolders,
    users: this.selectedUsers,
  }
  forkJoin([this.documentService.setDocumentPemission(Documentsdata), this.dossierService.grantFolderPermission(Foldersdata)]).subscribe({
    next: (response) =>{
      if(response){
        this.ref.close(true);
        this.messageService.add({ severity: 'success', summary: 'Accorder des permissions', detail: "Document permission updated successfully." })
      }
    },

    error: (error) => {
      this.ref.close(false)
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error :' + error?.message ?? "" })
    }
  })
}

getAlreadySelectedUsers(){
  if(this.items[0].type == "file"){
    this.documentService.getUsersByDocumentId(this.items[0].data.privilegeDocument.document.id).subscribe({
      next: (response: UserPermission[]) => {
        //this.selectedUsers = response.map((item) => {return item.user})
        this.selectedUsers = response.map(item => {item.privilege = item.privilege.trim(); return item});
        this.getActiveUsers();
      }
    })
  }else{
    this.dossierService.getUsersByDossierId(this.items[0].data.dossier.id).subscribe({
      next: (response: UserPermission[]) => {
        //this.selectedUsers = response.map((item) => {return item.user})
        this.selectedUsers = response.map(item => {item.privilege = item.privilege.trim(); return item});
        this.getActiveUsers();
      }
    })
  }
}

setPermission(){
  let permission: string = "";
  if(this.readPermissions){
    permission += "r";
  }
  if(this.writePermissions){
    permission += "w"
  }
  if(this.deletedPermission){
    permission += "d"
  }

  this.permission$.next(permission.trim());
   
}


getPermissions(permissions: string){
  if(permissions.length === 0){
    this.readPermissions = false;
    this.writePermissions = false;
    this.deletedPermission = false;
  }
  if(permissions.includes("r")){
    this.readPermissions = true;
  }else{
    this.readPermissions = false;
  }

  if(permissions.includes("w")){
    this.writePermissions = true;
  }else{
    this.writePermissions = false;
  }

  if(permissions.includes("d")){
    this.deletedPermission = true;
  }else{
    this.deletedPermission = false;
  }
}

userIsSelectedForPrivilege(user: UserPermission){
  let userIndex = this.getSelectedUserIndex(user);
  return this.currentUserIndex.find(index => {return index === userIndex}) !== undefined
}

getSelectedUserIndex(user: UserPermission){
  return  this.selectedUsers.findIndex((u) => {return user.user.id === u.user.id});
}

onUserSelectedClick(user: UserPermission){
  let userIndex = this.getSelectedUserIndex(user);
  if(this.userIsSelectedForPrivilege(user)){
    this.currentUserIndex = this.currentUserIndex.filter(index => {return index !== userIndex});
    if(this.currentUserIndex.length === 0){
      this.getPermissions("");
    }
  }else{
    this.currentUserIndex.push(userIndex)
    if(this.currentUserIndex.length === 1){
      this.getPermissions(user.privilege.trim());
    }

    if(this.currentUserIndex.length > 1){
      this.getPermissions("");
    }
  }
}
}
