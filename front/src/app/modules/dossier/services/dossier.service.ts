import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConstant } from 'src/app/shared/constant';
import { Folder } from '../model/folder';
import { TreeNode } from 'primeng/api';
import { environment } from 'src/environments/environment';
import {childrenDosResponse} from '../model/privilege-dos-response';
import {DocumentType} from '../model/document-type.model';
import {UserPermission} from '../model/user-permission.model';
import {map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DossierService {

  constructor(private httpClient: HttpClient) { }

  getFoldersLarge() {
    return this.httpClient.get<any>(environment.BASE_URL +ApiConstant.DOCUMENT_PREFIX+"folders")
        .toPromise()
        .then(res => res.folders_large as Folder[])
        .then(data => data);
}

public save(parent: number,f: Folder) {
  return this.httpClient.post<Folder>(environment.BASE_URL +ApiConstant.DOCUMENT_PREFIX+ `createFolder/${parent}`, f);
}

getFiles() {
  return this.httpClient.get<any>('assets/arborescence/arbo.json')
    .toPromise()
    .then(res => <TreeNode[]>res.data);
  }

  getDossierById(id: number) {
    return this.httpClient.get<Folder>(environment.BASE_URL+ ApiConstant.DOCUMENT_PREFIX + `getDossierById/${id}`);
  }

  getAuthUserFolders(parentId : number = 1, keyword: string ="") {
    return this.httpClient.get<childrenDosResponse>(environment.BASE_URL +ApiConstant.DOSSIER_PREFIX+"me/" + parentId + "?keyword=" + keyword)
  }

  createFolder(newFolder :any){
    return this.httpClient.post<boolean>(environment.BASE_URL +ApiConstant.DOSSIER_PREFIX+"new-folder", newFolder);
  }

  grantFolderPermission(data :any){
    return this.httpClient.post<boolean>(environment.BASE_URL +ApiConstant.DOSSIER_PREFIX+"grant-permissions", data);
  }

  deleteFolder(data: any){
    return this.httpClient.post<boolean>(environment.BASE_URL +ApiConstant.DOSSIER_PREFIX+"delete", data);
  }

  getUsersByDossierId(id: number){
    return this.httpClient.get<UserPermission[]>(environment.BASE_URL +ApiConstant.DOSSIER_PREFIX + id + "/users")
  }

  renameFolder(oldPath: string, newPath: string){
    return this.httpClient.post<boolean>(environment.BASE_URL +ApiConstant.DOSSIER_PREFIX+"rename", {oldPath: oldPath, newPath: newPath});
  }

}
