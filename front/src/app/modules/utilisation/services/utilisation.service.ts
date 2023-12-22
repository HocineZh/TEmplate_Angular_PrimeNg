import { Injectable } from '@angular/core';
import { ModelProcess } from '../../model-process/models/model-process';
import { environment } from 'src/environments/environment';
import { ApiConstant } from 'src/app/shared/constant';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UtilisationService {

  constructor(private httpClient: HttpClient) { }



  getAllModelUtil(): Observable<any[]>{
    return this.httpClient.get<ModelProcess[]>(environment.BASE_URL + ApiConstant.PROCESS_PREFIX + `getAllModelUtil`);

  }

  createUtilisation(util: any): Observable<any>{

    return this.httpClient.post(environment.BASE_URL + ApiConstant.UTILISATION_ULT_PREFIX + `createUtil`, util);

  }

  getUtilById(id: number): Observable<any>{

    return this.httpClient.get<any>(environment.BASE_URL+ApiConstant.PROCESS_PREFIX+'getModelUtilId');
  }

  updateModelProcess( data: any): Observable<any>{
    return this.httpClient.put(environment.BASE_URL+ApiConstant.PROCESS_PREFIX+`updateModelUtil`,data);

  }

  update(id: any, data: any): Observable<ModelProcess> {
    console.log("data "+data);
    return this.httpClient.put(`${environment.BASE_URL}${ApiConstant.PROCESS_PREFIX}updateModelUtil/${id}`, data);
  }

  deleteProcess(id: number): Observable<any>{
    console.log('deleteProcess',id)
    return this.httpClient.delete(`${environment.BASE_URL}${ApiConstant.PROCESS_PREFIX}deleteModelProcess/${id}`);
  }
}
