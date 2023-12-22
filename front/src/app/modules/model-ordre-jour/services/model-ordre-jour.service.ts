import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModelOJ } from '../models/model-ordre-jour';
import { Observable, catchError } from 'rxjs';
import { ApiConstant } from 'src/app/shared/constant';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { SetModelPOJs } from '../models/setModelPOJs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/shared/models/shared';

@Injectable({
  providedIn: 'root'
})
export class ModelOrdreJourService {


  // constructor(private httpClient: HttpClient, private messageService: MessageService,private confirmationService: ConfirmationService) { }
  constructor(private httpClient: HttpClient) { }

  getAllModelOJ(): Observable<ModelOJ[]> {

    return this.httpClient.get<ModelOJ[]>(environment.BASE_URL + ApiConstant.MODELOJ_PREFIX + `getAllModelOJ`);

    //.pipe(
    //catchError(this.errorHandler));
  }

  createModelOJ(modeloj: ModelOJ): Observable<ModelOJ> {

    return this.httpClient.post(environment.BASE_URL + ApiConstant.MODELOJ_PREFIX + `createModelOJ`, modeloj);
  }

  getModelOJById(id: number): Observable<ModelOJ> {
    return this.httpClient.get<ModelOJ>(`${environment.BASE_URL}${ApiConstant.MODELOJ_PREFIX}findModelById/${id}`);

  }

  updateModelOJ(id: number, modeloj: ModelOJ): Observable<any> {

    return this.httpClient.put(environment.BASE_URL + ApiConstant.MODELOJ_PREFIX + 'updateModelOJ/' + id, modeloj);
  }

  update(id: any, data: any): Observable<any> {
    return this.httpClient.put(`${environment.BASE_URL}${ApiConstant.MODELOJ_PREFIX}updateModelOJ/${id}`, data);

  }

  deleteModelOJ(id: number): Observable<any> {
    console.log('deleteModelOJ', id);

    return this.httpClient.delete(`${environment.BASE_URL}${ApiConstant.MODELOJ_PREFIX}deleteModelOJ/${id}`);
  }

  private log(message: Message) {
    //this.messageService.add(message);
  }


  getJoinedPointModelById(id: number): Observable<SetModelPOJs> {
    return this.httpClient.get<SetModelPOJs>(`${environment.BASE_URL}${ApiConstant.MODELOJ_PREFIX}findJoinedPointModelById/${id}`);
  }

}
