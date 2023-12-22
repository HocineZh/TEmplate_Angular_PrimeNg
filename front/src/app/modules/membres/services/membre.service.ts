import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EditMembreResponse, InitMembreDataResponse, MembreRequest, MembreResponse } from '../model/membre';
import { ApiConstant } from 'src/app/shared/constant';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/shared/models/shared';
import { O } from '@fullcalendar/core/internal-common';







@Injectable({
  providedIn: 'root'
})
export class MembreService {

  constructor(private httpClient : HttpClient) { }

  initData() : Observable<InitMembreDataResponse>{
    return this.httpClient.get<InitMembreDataResponse>(environment.BASE_URL + ApiConstant.MEMBRE_PREFIX + "initData");
  }

  addMembre (membre : MembreRequest[] , idOrgane : number) : Observable<ApiResponse> {
    let emptyFile : File  = new File([],"empty") ;
    const formData: FormData = new FormData();
    formData.append('membre', JSON.stringify(membre));
    formData.append('idOrgane' , idOrgane.toString());
    membre.forEach((element,index) => {
      formData.append('file[]', element.fichier_just! ? element.fichier_just! : emptyFile);
    });

    return this.httpClient.post<ApiResponse>(environment.BASE_URL + ApiConstant.MEMBRE_PREFIX + "addMembre" ,formData)
  }

  addMembreWithoutMandat (membre : MembreRequest[] , idOrgane : number) : Observable<ApiResponse> {
    const formData: FormData = new FormData();
    formData.append('membre', JSON.stringify(membre));
    formData.append('idOrgane' , idOrgane.toString());
    return this.httpClient.post<ApiResponse>(environment.BASE_URL + ApiConstant.MEMBRE_PREFIX + "addMembreWithoutMandat" ,formData)
  }

  getAllActifMembresByOrgane (organeId : number ) : Observable<EditMembreResponse[]>{
    let httpparam = new HttpParams().set("organeId",organeId);
    return this.httpClient.get<EditMembreResponse[]>(environment.BASE_URL + ApiConstant.MEMBRE_PREFIX + 'getMembre' ,{params : httpparam})
  }

  getAllMembresByOrgane (organeId : number ) : Observable<MembreResponse>{
    let httpparam = new HttpParams().set("organeId",organeId);
    return this.httpClient.get<MembreResponse>(environment.BASE_URL + ApiConstant.MEMBRE_PREFIX + 'getAllMembreOfOrgane' ,{params : httpparam})
  }





  editMembre(idOrgane : number ,idMembre : number , idUser : number ,profil : number , date_debut_mandat : Date , date_fin_mandat : Date , actif : number , file : File | null): Observable<ApiResponse> {
    const formData: FormData = new FormData();
    formData.append('idOrgane', JSON.stringify(idOrgane));
    formData.append('idMembre', JSON.stringify(idMembre));
    formData.append('idUser', JSON.stringify(idUser));
    formData.append('date_debut_mandat', JSON.stringify(date_debut_mandat));
    formData.append('date_fin_mandat', JSON.stringify(date_fin_mandat));
    formData.append('profil', JSON.stringify(profil));
    formData.append('actif', JSON.stringify(actif));
    formData.append('file', file ? file : JSON.stringify(null));
    return this.httpClient.put<ApiResponse>(environment.BASE_URL + ApiConstant.MEMBRE_PREFIX +"editMembre" ,formData)
  }

  editMembreWithoutMandat(idOrgane : number ,idMembre : number , idUser : number ,profil : number, actif : number): Observable<ApiResponse> {
    const formData: FormData = new FormData();
    formData.append('idOrgane', JSON.stringify(idOrgane));
    formData.append('idMembre', JSON.stringify(idMembre));
    formData.append('idUser', JSON.stringify(idUser));
    formData.append('profil', JSON.stringify(profil));
    formData.append('actif', JSON.stringify(actif));
    return this.httpClient.put<ApiResponse>(environment.BASE_URL + ApiConstant.MEMBRE_PREFIX +"editMembreWithoutMandat" ,formData)
  }

  deleteMembre(idMembre : number ): Observable<ApiResponse> {
    let httpparam = new HttpParams().set("idMembre",idMembre);
    return this.httpClient.delete<ApiResponse>(environment.BASE_URL + ApiConstant.MEMBRE_PREFIX +"deleteMembre" , {params : httpparam})
  }


  getAllMembresByEvent (eventId : number ) : Observable<any[]>{
    let httpparam = new HttpParams().set("eventId",eventId);
    return this.httpClient.get<any[]>(environment.BASE_URL + ApiConstant.MEMBRE_PREFIX + 'getMembreByEvent' ,{params : httpparam})
  }
  listMembrePresent(idEvent: number):Observable<any>{
    let httpparam = new HttpParams().set("idEvent",idEvent);
    return this.httpClient.get<any>(environment.BASE_URL + ApiConstant.MEMBRE_PREFIX +"listMembrePresent" , {params : httpparam})
  }



}
