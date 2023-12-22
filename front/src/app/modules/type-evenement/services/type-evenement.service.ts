import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConstant } from 'src/app/shared/constant';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypeEvenementService {

  constructor(private httpClient : HttpClient) { }

   //Lister les types évènements
   getTypesEvenement() : Observable <any> {
    return this.httpClient.get(environment.BASE_URL + ApiConstant.TYPE_EVENEMENT_PREFIX + 'getAll');
  }

   //Lister les types évènements except CA
  getTypesEvenementExceptCA() : Observable <any> {
    return this.httpClient.get(environment.BASE_URL + ApiConstant.TYPE_EVENEMENT_PREFIX + 'getAllExceptCA');
  }


}
