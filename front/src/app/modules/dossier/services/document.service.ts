import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ApiConstant} from 'src/app/shared/constant';
import {environment} from 'src/environments/environment';
import {UserPermission} from '../model/user-permission.model';
import {map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private httpClient: HttpClient) { }


  deleteDocument(data: any){
    return this.httpClient.post<boolean>(environment.BASE_URL +ApiConstant.DOCUMENT_PREFIX+`delete`, data);
  }

  uploadDocument(data: FormData){
    return this.httpClient.post<boolean>(environment.BASE_URL +ApiConstant.DOCUMENT_PREFIX+"store", data);
  }

  getDocumentsTypes(){
    return this.httpClient.get<DocumentType[]>(environment.BASE_URL +ApiConstant.DOCUMENT_PREFIX+"types")
  }

  setDocumentPemission(data: any){
    return this.httpClient.post<boolean>(environment.BASE_URL +ApiConstant.DOCUMENT_PREFIX+"grant-permissions", data);
  }

  getUsersByDocumentId(id: number){
    return this.httpClient.get<UserPermission[]>(environment.BASE_URL +ApiConstant.DOCUMENT_PREFIX + id + "/users")
  }

  download(data: any){
    return this.httpClient.post(environment.BASE_URL +ApiConstant.DOCUMENT_PREFIX + "download-zip", data, { responseType: 'blob' }).pipe(map((response: any)=>{
      return {
          data: response
      };
  }));

  }

  renameDocument(documentId: number, newName: string){
    return this.httpClient.post(environment.BASE_URL +ApiConstant.DOCUMENT_PREFIX + `rename/${documentId}`, {name: newName})
  }
}
