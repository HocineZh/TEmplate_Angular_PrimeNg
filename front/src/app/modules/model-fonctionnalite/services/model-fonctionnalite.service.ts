import { Injectable } from '@angular/core';
import { Message } from 'primeng/api';
import { Observable } from 'rxjs';
import { ApiConstant } from 'src/app/shared/constant';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModelFonctionnalite } from '../models/model-Fonctionnalite';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModelFonctionnaliteService {

  constructor(private httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  getAllFonctionnalite(): Observable<ModelFonctionnalite[]>{
    return this.httpClient.get<any[]>(environment.BASE_URL + ApiConstant.FONCT_PREFIX + `getAllFct`);
  }

  findAllFctBy(process: number): Observable<ModelFonctionnalite[]> {
    return this.httpClient.get<any>(`${environment.BASE_URL}${ApiConstant.FONCT_PREFIX}getAllFctByProcess/${process}`);
  }

  createFonctionnalite(id: number, fct: ModelFonctionnalite): Observable<Object>{
    return this.httpClient.post(`${environment.BASE_URL}${ApiConstant.FONCT_PREFIX}createModelFct/${id}`,fct);
  }

  getFonctionnaliteById(id: number): Observable<ModelFonctionnalite>{
    return this.httpClient.get<any>(`${environment.BASE_URL}${ApiConstant.FONCT_PREFIX}getFonctionnaliteById/${id}`);
  }

  updateFonctionnalite(id: number, data: any): Observable<ModelFonctionnalite>{
    return this.httpClient.put(`${environment.BASE_URL}${ApiConstant.FONCT_PREFIX}updateModelFct/${id}`,data);
  }

  update(id: any, data: any): Observable<ModelFonctionnalite> {
    console.log("data "+data);
    return this.httpClient.put(`${environment.BASE_URL}${ApiConstant.FONCT_PREFIX}updateModelFct/${id}`, data);
  }

  deleteFonctionnalite(id: number): Observable<any>{
    console.log('deleteProcess',id)
    return this.httpClient.delete(`${environment.BASE_URL}${ApiConstant.FONCT_PREFIX}deleteModelFct/${id}`);
  }

  private log(message: Message) {
    //this.messageService.add(message);
  }

  findByTitle(nom: any): Observable<ModelFonctionnalite[]> {
    return this.httpClient.get<ModelFonctionnalite[]>(`${environment.BASE_URL}${ApiConstant.FONCT_PREFIX}?title=${nom}`);
  }

}
