import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConstant } from 'src/app/shared/constant';
import { Orientation } from '../models/orientation';

import { OrientationStructureSuivi, SuiviOrientation, SuiviOrientationDetail } from '../models/orientation-structure-suivi';
import { ApiResponse } from 'src/app/shared/models/shared';

import { Famille } from '../models/famille';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class OrientationService {
  private orientationUrl: string;

  constructor(private httpClient : HttpClient) {
    this.orientationUrl = environment.BASE_URL + ApiConstant.ORIENTATION_PREFIX;
  }

  public findAll(): Observable<Orientation[]> {
    return this.httpClient.get<Orientation[]>(this.orientationUrl+ 'getAllOrientation');
  }


  public findAllFamille(type:String): Observable<Famille[]> {
    console.log("type "+type);
    return this.httpClient.get<Famille[]>(environment.BASE_URL + ApiConstant.PARAM_PREFIX + `getAllByFamille/${type}`);
  }


  public saveOSS(orientationSS: OrientationStructureSuivi,files: File[], evenementId: number): Observable <ApiResponse> {
console.log("save "+orientationSS+" files "+files);
    const formData: FormData = new FormData();
    formData.append('ossReq', JSON.stringify(orientationSS));
    formData.append('evenementId', evenementId.toString());
    files.forEach((file,index) => {
      formData.append('file[]', file);
    });
    return this.httpClient.post<ApiResponse>(this.orientationUrl+ "saveOrientation" ,formData)
    //return this.httpClient.post<ApiResponse>(this.orientationUrl+ "saveOrientation",orientationSS);
  }

  getOrientationById(id: number): Observable<any>{
    let httpparam = new HttpParams()
    .set("id",id)
    return this.httpClient.get<any>(environment.BASE_URL + ApiConstant.ORIENTATION_PREFIX + "getOrientationById",{params: httpparam});
  }

  findSuiviOrientationById(id_so: number): Observable<any>{
    let httpparam = new HttpParams()
    .set("id",id_so)
    console.log("id_so "+id_so)
    return this.httpClient.get<any>(environment.BASE_URL + ApiConstant.ORIENTATION_PREFIX + "findSuiviOrientationById",{params: httpparam});
  }

  updateOrientation( data: any): Observable<any>{
    return this.httpClient.put(environment.BASE_URL+ApiConstant.ORIENTATION_PREFIX+`updateOrientation`,data);
  }

  deleteOrientation(id: number): Observable<any>{
    console.log('deleteOrientation',id)
    let httpparam = new HttpParams()
    .set("id",id)
    return this.httpClient.delete(environment.BASE_URL + ApiConstant.ORIENTATION_PREFIX + "deleteOrientation",{params: httpparam});
  }

  public findAllOrientationStructure(): Observable<any> {
    return this.httpClient.get<any>(this.orientationUrl+ 'getAllOrientationSuiviStructure');
  }

  public saveSuiviOrientation(suiviorientation: SuiviOrientation, files: File[]): Observable <ApiResponse>{
    console.log('saveSuiviOrientation',suiviorientation.orientationStructureSuivi!.id)
    const formData: FormData = new FormData();
    formData.append('suiviReq', JSON.stringify(suiviorientation));
    //formData.append('evenementId', evenementId.toString());
    files.forEach((file,index) => {
      formData.append('file[]', file);
    });
    return this.httpClient.post<ApiResponse>(this.orientationUrl + "saveSuiviOrientation",formData);
  }


  getOrientationSSById(id: number): Observable<any>{
    let httpparam = new HttpParams()
    .set("id",id)
    return this.httpClient.get<any>(environment.BASE_URL+ApiConstant.ORIENTATION_PREFIX+"getOSSById",{params: httpparam});
  }

  getAllSuiviOrientations(orientationSuiviId: number): Observable<SuiviOrientation[]>{
    let httpparam = new HttpParams()
    .set("orientationSuiviId",orientationSuiviId)
    console.log("getAllSuiviOrientations : "+orientationSuiviId);
    return this.httpClient.get<SuiviOrientation[]>(this.orientationUrl+ "getAllSuiviOrientations",{params: httpparam});
  }

  findLastSuivi(ossId: number): Observable<SuiviOrientation>{
    let httpparam = new HttpParams()
    .set("ossId",ossId)
    console.log("getAllSuiviOrientations : "+ossId);
    return this.httpClient.get<SuiviOrientation>(this.orientationUrl+ "findLastSuivi",{params: httpparam});
  }



  findLastSuiviByEvent(evenementId: number,structureId: number): Observable<SuiviOrientationDetail>{
    let httpparam = new HttpParams()
    .set("evenementId",evenementId)
    .set("structureId",0);
    console.log("getAllSuiviOrientations : "+evenementId);
    return this.httpClient.get<SuiviOrientationDetail>(this.orientationUrl+ "findLastSuiviByEvent",{params: httpparam});
  }

  findLastSuiviAll(): Observable<SuiviOrientationDetail>{

    return this.httpClient.get<SuiviOrientationDetail>(this.orientationUrl+ "findLastSuiviAll");
  }

  getDocumentsOrientation(orientationId: number): Observable<any> {

    let httpparam = new HttpParams()
    .set("orientationId",orientationId)

    return this.httpClient.get(
      this.orientationUrl + 'getDocOrientations', { params: httpparam }

    );
  }


}
