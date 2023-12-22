import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConstant } from 'src/app/shared/constant';
import { ApiResponse } from 'src/app/shared/models/shared';
import { environment } from 'src/environments/environment';
import { FileResponse, MembreInfo } from '../../membres/model/membre';

import { User } from '../../users/model/user';
import { CurrentReponse, RemplcamentDetail } from '../../convocation/model/convocation.model';

@Injectable({
  providedIn: 'root'
})
export class ConvocationService {

  constructor(private http: HttpClient) { }

  editResponseConvocation( idEvenement : number ,reponse : string ) : Observable<ApiResponse> {
    return this.http.put<ApiResponse>(environment.BASE_URL + ApiConstant.CONVOCATION_PREFIX + 'reponseConvocation' , {idEvenement,reponse}) ;
  }

  editResponseConvocationRemplacent( idEvenement : number ,idMembre : number , documentJust : File) : Observable<ApiResponse> {
    const formData: FormData = new FormData();
    formData.set("idEvenement",idEvenement.toString());
    formData.set("idMembre",idMembre.toString());
    formData.set("documentJust",documentJust);

    return this.http.put<ApiResponse>(environment.BASE_URL + ApiConstant.CONVOCATION_PREFIX +'reponseRemplacentMandate' , formData) ;
  }

  editResponseConvocationRemplacentWithotumAndat( idEvenement : number,idMembre : number ,documentJust : File,fonction : string ,informationRemplacent : string  ) : Observable<ApiResponse> {
    const formData: FormData = new FormData();
    formData.set("idEvenement",idEvenement.toString());
    formData.set("idMembre",idMembre.toString());
    formData.set("fonction",fonction);
    formData.set("informationRemplacent",informationRemplacent);
    formData.set("documentJust",documentJust);
    return this.http.put<ApiResponse>(environment.BASE_URL + ApiConstant.CONVOCATION_PREFIX +'reponseRemplacentMandateNotExist' , formData) ;
  }

  getMembreInfo(idOrgane : number) : Observable<MembreInfo[]>{
    let httpparam = new HttpParams()
    .set("idOrgane",idOrgane.toString())
    return this.http.get<MembreInfo[]>(environment.BASE_URL + ApiConstant.CONVOCATION_PREFIX + 'getMembreInfo' , {params:httpparam});

  }

  getCurrentConvocationEtat(idEvenement : number) : Observable<CurrentReponse>{
    let httpparam = new HttpParams()
    .set("idEvenement",idEvenement.toString())
    return this.http.get<CurrentReponse>(environment.BASE_URL + ApiConstant.CONVOCATION_PREFIX + 'getCurrentConvocationEtat' , {params:httpparam});
  }

  deleteRemplacement (idSeanceConvocation : number , idDocument : number) : Observable<ApiResponse>{
    let httpparam = new HttpParams()
    .set("idSeanceConvocation",idSeanceConvocation).set("idDocument",idDocument)
    return this.http.delete<ApiResponse>(environment.BASE_URL + ApiConstant.CONVOCATION_PREFIX + 'deleteDemanderemplacement' , {params:httpparam});
  }

  getListRemplcament(idEvenement : number) : Observable<RemplcamentDetail[]>{
    let httpparam = new HttpParams()
    .set("idEvenement",idEvenement)
    return this.http.get<RemplcamentDetail[]>(environment.BASE_URL + ApiConstant.CONVOCATION_PREFIX + 'getRemplacements' , {params:httpparam});
  }


  uploadConvSigne(idEvenement : number,idMembre : number , file : File | null): Observable<ApiResponse> {
    const formData: FormData = new FormData();
    formData.append('idEvenement', JSON.stringify(idEvenement));
    formData.append('idMembre', JSON.stringify(idMembre));
    formData.append('file', file ? file : JSON.stringify(null));
    return this.http.post<ApiResponse>(environment.BASE_URL + ApiConstant.CONVOCATION_PREFIX +"uploadConvocationSigne" ,formData) ;
  }

  deleteConvSigne(idFile : number): Observable<ApiResponse> {
    let httpparam = new HttpParams().set("idFile",JSON.stringify(idFile));
    return this.http.delete<ApiResponse>(environment.BASE_URL + ApiConstant.CONVOCATION_PREFIX +"deleteConvocationSigne" ,{params:httpparam }) ;
  }

  initRemplacentPossible(): Observable<User[]> {
    return this.http.get<User[]>(environment.BASE_URL + ApiConstant.CONVOCATION_PREFIX +"getAllRemplacentPossible") ;
  }

  addRemplacement( idRemplcament : number , idUser : number,idSeanceConvoction : number ,idFile : number,idProfil  : number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(environment.BASE_URL + ApiConstant.CONVOCATION_PREFIX +"addRemplacent" , {idRemplcament , idUser,idSeanceConvoction,idFile,idProfil }) ;
  }


  getConvocationSigne( idEvenement : number) : Observable<FileResponse>{
    let httpparam = new HttpParams()
    .set("idEvenement",JSON.stringify(idEvenement))
    return this.http.get<FileResponse>(environment.BASE_URL + ApiConstant.CONVOCATION_PREFIX + 'getConvocationSigned' , {params:httpparam});
  }
}
