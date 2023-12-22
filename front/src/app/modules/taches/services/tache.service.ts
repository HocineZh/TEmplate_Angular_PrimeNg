import { ApiConstant } from 'src/app/shared/constant';
import { ApiResponse } from 'src/app/shared/models/shared';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tache, Modele, Etat, EventResponse, TacheReponse, TachesCard } from '../model/tache.model';




const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TacheService {


  constructor(private httpClient : HttpClient) { }


                                    //Pour le component "Lister les taches"

  createTache(nom : string, description : string) : Observable<ApiResponse>{
    return this.httpClient.post<ApiResponse>(environment.BASE_URL+ApiConstant.TACHE_PREFIX+"add", {nom, description})
  }

  getAllTaches(): Observable<Tache[]> {
    return this.httpClient.get<Tache[]>(environment.BASE_URL+ApiConstant.TACHE_PREFIX+"allTaches")
  }

  updateTache(id : number, nom : string, description : string) : Observable<ApiResponse>{
    return this.httpClient.put<ApiResponse>(environment.BASE_URL+ApiConstant.TACHE_PREFIX+"update", {id, nom, description})
  }

  deleteTache(ids : number[]) : Observable<ApiResponse>{
    const param = new HttpParams().set("ids", ids.join(','));
    return this.httpClient.delete<ApiResponse>(environment.BASE_URL+ApiConstant.TACHE_PREFIX+"delete/",{params : param})
  }

  setOrder(listOrdonee : any) : Observable<ApiResponse>{
    return this.httpClient.put<ApiResponse>(environment.BASE_URL+ApiConstant.TACHE_PREFIX+"order",{listOrdonee})
  }



                                    //Pour le component "Lister les modeles"

  getAllModeles(): Observable<Modele[]> {
    return this.httpClient.get<Modele[]>(environment.BASE_URL+ApiConstant.TACHE_PREFIX+"allModeles")
  }

  deleteModele(ids : number[]) : Observable<ApiResponse>{
    const param = new HttpParams().set("ids", ids.join(','));
    return this.httpClient.delete<ApiResponse>(environment.BASE_URL+ApiConstant.TACHE_PREFIX+"deleteModele/", {params : param});
  }


                                    //Pour le component "ajouter modele"

  addModele(nom : string, taches : Tache[]) : Observable<ApiResponse>{
    return this.httpClient.post<ApiResponse>(environment.BASE_URL+ApiConstant.TACHE_PREFIX+"addModele",{nom, taches});
  }

  updateModele(id : number, nom : string, taches : Tache[]) : Observable<ApiResponse>{
    return this.httpClient.put<ApiResponse>(environment.BASE_URL+ApiConstant.TACHE_PREFIX+"updateModele", {id, nom, taches});
  }

  getModeleById(id : number) : Observable<Modele>{
    const params = new HttpParams().set('id', id);

    return this.httpClient.get<Modele>(environment.BASE_URL+ApiConstant.TACHE_PREFIX+"getModele/",{params})
  }


                                    //Pour le component "kanban"

  createTacheReel(nom : string, echeance : String, idEvenement : number, ordreExecution : number) : Observable<ApiResponse>{
    console.log("****************")
    console.log(idEvenement, ordreExecution);

    return this.httpClient.post<ApiResponse>(environment.BASE_URL+ApiConstant.TACHE_PREFIX+"addTache",{nom, echeance, idEvenement, ordreExecution})
  }

  allTachesByEvent(eventId : number) : Observable<any>{
    const params = new HttpParams().set('id', eventId);
    return this.httpClient.get<any>(environment.BASE_URL+ApiConstant.TACHE_PREFIX+"allTachesByEvent",{params})
  }

  geAllEtatsTaches() : Observable<Etat[]>{
    return this.httpClient.get<Etat[]>(environment.BASE_URL+ApiConstant.TACHE_PREFIX+"allEtatsTache")
  }

  addSuiviTache(date : string,taux : number, etatsid : number, tacheEventid : string) : Observable<ApiResponse>{
    return this.httpClient.post<ApiResponse>(environment.BASE_URL+ApiConstant.TACHE_PREFIX+"addSuiviTache", {date, taux, etatsid, tacheEventid})
  }

  updateTacheReelle(id : string, nom : string, echeance : string) : Observable<ApiResponse>{
    return this.httpClient.put<ApiResponse>(environment.BASE_URL+ApiConstant.TACHE_PREFIX+"updateTache",{id, nom, echeance})
  }

  deleteTacheReelle(id : string) : Observable<ApiResponse>{
    const params = new HttpParams().set("id", id);
    return this.httpClient.delete(environment.BASE_URL+ApiConstant.TACHE_PREFIX+"deleteTache",{params});
  }

                                      //Pour le component "eventList"
  getAllEventsByUser(id : number) : Observable<EventResponse[]>{
    const params= new HttpParams().set('id', id);
    return this.httpClient.get<EventResponse[]>(environment.BASE_URL+ApiConstant.TACHE_PREFIX+"userEvents", {params});
  }

  getAllTachesEnCours(events : number[]) : Observable<TacheReponse[]>{
    const params = new HttpParams().set('idsEvents', events.join(','));
    return this.httpClient.get<TacheReponse[]>(environment.BASE_URL+ApiConstant.TACHE_PREFIX+"tachesEnCours", {params});
  }

  getEtatsTachesEvenement(id : number) : Observable<any[]>{
    const params = new HttpParams().set('idEvent', id);
    return this.httpClient.get<any[]>(environment.BASE_URL+ApiConstant.TACHE_PREFIX+"EtatsTachesEvenementByEvent", {params})
  }

  ordreChange(cards: TachesCard[]) : Observable<ApiResponse>{

  const formdata = new FormData()
    formdata.set("cards",JSON.stringify(cards))
    return this.httpClient.put<ApiResponse>(environment.BASE_URL+ApiConstant.TACHE_PREFIX+"ordreChange",{cards})
  }
}

