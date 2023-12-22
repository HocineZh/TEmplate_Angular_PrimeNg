import { Injectable } from '@angular/core';
import { ModelPOJ } from '../models/model-point-ordre';
import { ApiConstant } from 'src/app/shared/constant';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { SetModelPOJs } from '../../model-ordre-jour/models/setModelPOJs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/shared/models/shared';

@Injectable({
  providedIn: 'root'
})
export class ModelPointOrdreService {
 /* const headers = new HttpHeaders()
  .append(
    'Content-Type',
    'application/json'
  );*/
  //const body=JSON.stringify(myObject);
  constructor(private httpClient: HttpClient) { }



  getAllModelPOJ(): Observable<ModelPOJ[]>{
    return this.httpClient.get<ModelPOJ[]>(environment.BASE_URL + ApiConstant.MODELPOJ_PREFIX + `ModelPointOrdres`);
  }

  getPointOrdreNotInModel(id: number): Observable<ModelPOJ[]>{
    return this.httpClient.get<ModelPOJ[]>(environment.BASE_URL + ApiConstant.MODELPOJ_PREFIX + `getPointOrdreNotInModel/`+id);
  }

  getPointOrdreInModel(id: number): Observable<ModelPOJ[]>{
    return this.httpClient.get<ModelPOJ[]>(environment.BASE_URL + ApiConstant.MODELPOJ_PREFIX + `getPointOrdreInModel/`+id);
  }


  createModelPOJ(modelpoj: ModelPOJ): Observable<Object>{
    return this.httpClient.post(environment.BASE_URL + ApiConstant.MODELPOJ_PREFIX + `createModelPOJ`, modelpoj);
  }

  getModelPOJById(id: number): Observable<ModelPOJ>{
    return this.httpClient.get<ModelPOJ>(`${environment.BASE_URL}${ApiConstant.MODELPOJ_PREFIX}getModelPOJById/${id}`);
  }

  updateModelPOJ(id: any, data: any): Observable<ApiResponse>{
    return this.httpClient.put<ApiResponse>(`${environment.BASE_URL}${ApiConstant.MODELPOJ_PREFIX}updateModelPointOrdre/${id}`,data);
  }

  deleteModelPOJ(id: number): Observable<ApiResponse>{
    console.log('deleteModelPOJ',id)
    return this.httpClient.delete(`${environment.BASE_URL}${ApiConstant.MODELPOJ_PREFIX}deleteModelPOJ/${id}`);
  }

  setModelPointOrdre(modelId :number,modelpoj:number): Observable<ApiResponse>{
   const formData: FormData = new FormData();
    formData.append('modelpo', modelpoj.toString());
    formData.append('modelId' , modelId.toString()); 
    return this.httpClient.post<ApiResponse>(environment.BASE_URL + ApiConstant.MODELPOJ_PREFIX+ 'setPointForModelOJ',formData);

  }
  retirerModelsPOJ(idModel: number): Observable<any>{
    let httpparam = new HttpParams().set("idModel",idModel);
    return this.httpClient.delete(environment.BASE_URL + ApiConstant.MODELPOJ_PREFIX + "retirerModelPOJ", {params : httpparam});
  }

  

}
