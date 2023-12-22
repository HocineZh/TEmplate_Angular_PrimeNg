import { Injectable } from '@angular/core';
import { ApiConstant } from 'src/app/shared/constant';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from 'primeng/api';
import { ModelProcess } from '../models/model-process';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModelProcessService {

  constructor(private httpClient: HttpClient) { }



  getAllModelProcess(): Observable<ModelProcess[]>{
    return this.httpClient.get<ModelProcess[]>(environment.BASE_URL + ApiConstant.PROCESS_PREFIX + `getAllModelProcess`);

  }

  createProcess(process: ModelProcess): Observable<any>{

    return this.httpClient.post(environment.BASE_URL + ApiConstant.PROCESS_PREFIX + `createModelProcess`, process);

  }

  getProcessById(id: number): Observable<ModelProcess>{

    return this.httpClient.get<any>(`${environment.BASE_URL}${ApiConstant.PROCESS_PREFIX}getModelProcessById/${id}`);
  }

  updateModelProcess(id: any, data: ModelProcess): Observable<any>{
    return this.httpClient.put(`${environment.BASE_URL}${ApiConstant.PROCESS_PREFIX}updateModelProcess/${id}`,data);

  }

  update(id: any, data: any): Observable<any> {
    console.log("data "+data);
    return this.httpClient.put(`${environment.BASE_URL}${ApiConstant.PROCESS_PREFIX}updateModelProcess/${id}`, data);
  }

  deleteProcess(id: number): Observable<any>{
    console.log('deleteProcess',id)
    return this.httpClient.delete(`${environment.BASE_URL}${ApiConstant.PROCESS_PREFIX}deleteModelProcess/${id}`);
  }

  private log(message: Message) {
    //this.messageService.add(message);
  }
}
