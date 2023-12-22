import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {  DocumentDetails, UtilisationUlt, UtilisationUltRequest } from '../models/document';
import { ApiConstant } from 'src/app/shared/constant';
import { ApiResponse } from 'src/app/shared/models/shared';
import { MailContent } from '../models/mail';
import { environment } from 'src/environments/environment';

let headers = new HttpHeaders({
  'Content-Type': 'application/pdf',
  responseType: 'blob',
  observe: 'response'
})


@Injectable({
  providedIn: 'root'
})
export class DocumentService {


  constructor(private httpClient: HttpClient) { }

  upload(files: File[], evenementId: number): Observable<ApiResponse> {
    const formData: FormData = new FormData();
    formData.append('evenementId', evenementId.toString());
    files.forEach((file, index) => {
      formData.append('file[]', file);
    });

    return this.httpClient.post<ApiResponse>(environment.BASE_URL + ApiConstant.DOCUMENT_PREFIX + "chargerDocument", formData);
  }


  uploadNewVersion(files: File[], evenementId: number, ecrasable: boolean): Observable<ApiResponse> {
    const formData: FormData = new FormData();
    formData.append('evenementId', evenementId.toString());
    formData.append('ecrasable', ecrasable.toString());
    files.forEach((file, index) => {
      formData.append('file[]', file);
    });

    return this.httpClient.post<ApiResponse>(environment.BASE_URL + ApiConstant.DOCUMENT_PREFIX + "chargerDocumentVersion", formData);
  }


  listUtilisations(typeOrganeId: number, typeDocId: number): Observable<UtilisationUlt[]> {
    console.log("listUtilisations", typeOrganeId, typeDocId);
    let params = new HttpParams()
      .set("typeOrganeId", typeOrganeId)
      .set("typeDocId", typeDocId);
    return this.httpClient.get<UtilisationUlt[]>(environment.BASE_URL + ApiConstant.UTILISATION_ULT_PREFIX + "getUtilisationUlt", { params: params });
  }

getLastVersion(docId: number): Observable<any> {
  let httpparam = new HttpParams().set("docId", docId);
    return this.httpClient.get(environment.BASE_URL + ApiConstant.VERSION_PREFIX + 'getLastVersionsDoc', { params: httpparam})

}




  newVersion(files: File[], evenementId: number): Observable<ApiResponse> {
    const formData: FormData = new FormData();
    formData.append('evenementId', evenementId.toString());
    files.forEach((file, index) => {
      formData.append('file[]', file);
    });

    return this.httpClient.post<ApiResponse>(environment.BASE_URL + ApiConstant.DOCUMENT_PREFIX + "saveNewVersion", formData);
  }


  downloadFile(idDocument: number): Observable<Blob> {
    let httpparam = new HttpParams().set("idDocument", idDocument);
    console.log("download");
    return this.httpClient.get(environment.BASE_URL + ApiConstant.DOCUMENT_PREFIX + 'downloadDocuement', { params: httpparam, headers: headers, responseType: 'blob' })
  }


  downloadLastVersionFile(idDocument: number): Observable<Blob> {
    let httpparam = new HttpParams().set("idDocument", idDocument);
    return this.httpClient.get(environment.BASE_URL + ApiConstant.DOCUMENT_PREFIX + 'downloadLastVersion', { params: httpparam, headers: headers, responseType: 'blob' })
  }

  deleteFile(docuement: DocumentDetails[]): Observable<ApiResponse> {
    let httpparam = new HttpParams().set("document", JSON.stringify(docuement));
    return this.httpClient.delete(environment.BASE_URL + ApiConstant.DOCUMENT_PREFIX + 'deleteDocument', { params: httpparam })
  }

  getDocumentsPVsEvenement(evenementId: number): Observable<any> {

    let queryParams = new HttpParams();
    queryParams = queryParams.appendAll({ evenementId: evenementId });

    return this.httpClient.get(
      environment.BASE_URL + ApiConstant.DOCUMENT_PREFIX + 'getListPVsByEvenement', { params: queryParams }

    );
  }

  deleteSelectedDoc(idDocument: any) {
    console.log("deleteSelectedDoc");
    let queryParams = new HttpParams();
    queryParams = queryParams.appendAll({ idDocument: idDocument });

    return this.httpClient.delete(
      environment.BASE_URL + ApiConstant.DOCUMENT_PREFIX + 'deleteSelectedDoc', { params: queryParams }

    );
  }

  saveUtilisationUlt(util: UtilisationUltRequest): Observable<ApiResponse> {
    console.log(util);
    return this.httpClient.post<ApiResponse>(environment.BASE_URL + ApiConstant.UTILISATION_ULT_PREFIX + "saveSelectedUtilDoc", util);

  }

  listSelectedUtilisations(idDocument: number): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.appendAll({ idDocument: idDocument });
    return this.httpClient.get(
      environment.BASE_URL + ApiConstant.UTILISATION_ULT_PREFIX + 'getListSelectedUtilByDoc', { params: queryParams }

    );
  }

  getListVersionDocByEvenement(evenementId: number): Observable<any> {

    let queryParams = new HttpParams();
    queryParams = queryParams.appendAll({ evenementId: evenementId });

    return this.httpClient.get(
      environment.BASE_URL + ApiConstant.DOCUMENT_PREFIX + 'getListVersionDocByEvenement', { params: queryParams }
    );
  }

  publierDoc(idDocument: number): Observable<ApiResponse> {
    const formData: FormData = new FormData();
    formData.append('docId', idDocument.toString());
    return this.httpClient.put<ApiResponse>(environment.BASE_URL + ApiConstant.DOCUMENT_PREFIX + 'diffuserDoc', formData);
  }

  validerDoc(idDocument: number): Observable<any> {

    const formData: FormData = new FormData();
    formData.append('docId', idDocument.toString());
    return this.httpClient.put<any>(environment.BASE_URL + ApiConstant.DOCUMENT_PREFIX + 'validerDoc', formData);
  }

  sendMail(mailDoc: MailContent): Observable<any> {
    console.log("sendMail");
    return this.httpClient.post<any>(environment.BASE_URL + ApiConstant.DOCUMENT_PREFIX + 'sendMailDocumentMembres', mailDoc);
  }

}
