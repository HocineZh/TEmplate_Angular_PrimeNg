import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConstant } from 'src/app/shared/constant';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})

  export class PropositionsMembresService {

    constructor(private http: HttpClient){

    }

    getListPropositionsPoEvenement(evenementId:any) : Observable<any> {

        return this.http.get(
         environment.BASE_URL + ApiConstant.PROPOSITIONS_MEMBRES_PREFIX +'point_ordre/list/' + evenementId ,
          httpOptions
        );
   }

   addPropositionPoToEvenement(evenementId:any, newPoProposition:any  ) : Observable<any> {

    return this.http.post(
     environment.BASE_URL + ApiConstant.PROPOSITIONS_MEMBRES_PREFIX +'point_ordre/save/' + evenementId, newPoProposition,
      httpOptions
    );
  }

  updatePropositionPoEvenement(evenementId:any, poProposition:any  ) : Observable<any> {

    return this.http.post(
     environment.BASE_URL + ApiConstant.PROPOSITIONS_MEMBRES_PREFIX +'point_ordre/update/' + evenementId, poProposition,
      httpOptions
    );
  }

  deletePropositionsPoEvenement(evenementId:any, poPropositions:any[]  ) : Observable<any> {

    return this.http.post(
     environment.BASE_URL + ApiConstant.PROPOSITIONS_MEMBRES_PREFIX +'point_ordre/delete/' + evenementId, poPropositions,
      httpOptions
    );
  }

  changerEtatPropositionPoEvenement(evenementId:any, poPropositionId:any, etat:string  ) : Observable<any> {

    return this.http.post(
     environment.BASE_URL + ApiConstant.PROPOSITIONS_MEMBRES_PREFIX +'point_ordre/updateEtat', {evenementId : evenementId, popId : poPropositionId, etat : etat},
      httpOptions
    );
  }


}