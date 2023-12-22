import { Injectable } from '@angular/core';
import { ModelDelai } from '../model/model-delai';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConstant } from 'src/app/shared/constant';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModelDelaiService {

  constructor(private httpClient: HttpClient) { }

  getAllModelDelai(): Observable<ModelDelai[]> {
    return this.httpClient.get<ModelDelai[]>(environment.BASE_URL + ApiConstant.DELAI_PREFIX + `getAllModelDelai`);
  }

  createModelDelai(model: ModelDelai): Observable<Object> {
    console.log("model reponse_convocation"+model.reponseConvocation);
    //return this.httpClient.post(environment.BASE_URL + ApiConstant.DELAI_PREFIX + `createModel`, model);
    return this.httpClient.post(environment.BASE_URL + ApiConstant.DELAI_PREFIX + "createModel", model);
  }

  getModelById(id: number): Observable<ModelDelai> {
    let params = new HttpParams().set("id",id);
    return this.httpClient.get<ModelDelai>(environment.BASE_URL + ApiConstant.DELAI_PREFIX + "findModelById",{params:params});
  }

  update(data: ModelDelai): Observable<any> {
    return this.httpClient.put(environment.BASE_URL + ApiConstant.DELAI_PREFIX + "updateModelDelais", data);
  }

  deleteModelDelai(id: number): Observable<any> {
    let params = new HttpParams().set("id",id);
    console.log('deleteModelOJ', id);
    return this.httpClient.delete(environment.BASE_URL + ApiConstant.DELAI_PREFIX + "deleteModel",{params:params});
  }

}
