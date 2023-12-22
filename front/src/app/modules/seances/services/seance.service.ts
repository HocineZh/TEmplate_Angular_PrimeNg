import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConstant } from 'src/app/shared/constant';
import { Seance } from '../model/seance';
import { ApiResponse } from 'src/app/shared/models/shared';
import { Etats } from 'src/app/shared/models/etats';
import { environment } from 'src/environments/environment';
import { Evenement } from '../../evenements/models/evenement';
import { JetonPresence } from '../model/jeton-presence';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SeanceService {

  constructor(private httpClient : HttpClient) { }

  addSeance(dateDebut:Date,dateFin:Date,lieu:string,etatsByEtatsid:Etats, evenementByEvenementid:Evenement, numeroSeance: number) : Observable <ApiResponse> {

    return this.httpClient.post<ApiResponse>(environment.BASE_URL + ApiConstant.SEANCE_PREFIX + 'create',{dateDebut,dateFin,lieu,etatsByEtatsid,evenementByEvenementid,numeroSeance})
  }

  AddPresence (listPresence : JetonPresence[], idSeance : number) : Observable<ApiResponse> {
    const formData: FormData = new FormData();
    formData.append('listPresence', JSON.stringify(listPresence));
    formData.append('idSeance' , idSeance.toString());

    return this.httpClient.post<ApiResponse>(environment.BASE_URL + ApiConstant.SEANCE_PREFIX + "addPresence" ,formData)
  }

  getAllPresent (seanceId : number ) : Observable<JetonPresence[]>{
    let httpparam = new HttpParams().set("id",seanceId);
    return this.httpClient.get<JetonPresence[]>(environment.BASE_URL + ApiConstant.SEANCE_PREFIX + 'getListPresent' ,{params : httpparam})
  }
  getPresentWithRemplacent (seanceId : number ) : Observable<any[]>{
    let httpparam = new HttpParams().set("seanceId",seanceId);
    return this.httpClient.get<any[]>(environment.BASE_URL + ApiConstant.SEANCE_PREFIX + 'getPresentWithRemplacent' ,{params : httpparam})
  }



  updateSeance(id: number,dateDebut:Date,dateFin:Date,lieu:string,etatsByEtatsid:Etats,numeroSeance: number ,evenementByEvenementid : Evenement) : Observable <ApiResponse> {

    return this.httpClient.put<ApiResponse>(environment.BASE_URL + ApiConstant.SEANCE_PREFIX + 'editSeance',{id,dateDebut,dateFin,lieu,etatsByEtatsid,numeroSeance , evenementByEvenementid})
  }

  getAllSeance() : Observable <Seance[]> {
    return this.httpClient.get<Seance[]>(environment.BASE_URL + ApiConstant.SEANCE_PREFIX + 'getAllSeance')
  }

  getAllSeanceByEvenement(idEvent : number) : Observable <Seance[]> {
    let params = new HttpParams().set("idEvent",idEvent);
    return this.httpClient.get<Seance[]>(environment.BASE_URL + ApiConstant.SEANCE_PREFIX + 'getAllSeanceByEvenement',{params : params})
  }

  //retourner une seance
  getSeance (id : number ) : Observable<Seance>{
    let params = new HttpParams().set("id",id);
    return this.httpClient.get<Seance>(environment.BASE_URL + ApiConstant.SEANCE_PREFIX + 'getSeance' ,{params : params})
  }

  //Ouvrir une seance
  openSeance(id:number) : Observable<ApiResponse>
  {
    return this.httpClient.put<ApiResponse>(environment.BASE_URL + ApiConstant.SEANCE_PREFIX + "openSeance",{id});
  }

  //Fermer une seance
  closeSeance(id:number) : Observable<ApiResponse>
  {
   return this.httpClient.put<ApiResponse>(environment.BASE_URL + ApiConstant.SEANCE_PREFIX + "closeSeance",{id});
  }

  //Supprimer un organe
  deleteSeance(id:number) : Observable<any>
  {
   let params = new HttpParams().set("id",id);
   return this.httpClient.delete(environment.BASE_URL + ApiConstant.SEANCE_PREFIX + "deleteSeance",{params : params});
  }

  //Supprimer des seances
  deleteMultipleSeance(ids:any) : Observable<any>
  {
   let params = new HttpParams().set("ids",ids);
   return this.httpClient.delete(environment.BASE_URL + ApiConstant.SEANCE_PREFIX + "deleteMultipleSeance",{params : params});
  }

  setQuorum (id : number, quorumAtteint: boolean) : Observable<ApiResponse> {

    return this.httpClient.put<ApiResponse>(environment.BASE_URL + ApiConstant.SEANCE_PREFIX + "setQuorum" ,{id,quorumAtteint})
  }

}
