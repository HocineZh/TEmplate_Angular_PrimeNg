import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConstant } from 'src/app/shared/constant';
import { ApiResponse } from 'src/app/shared/models/shared';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor(private http: HttpClient) {}

  login(login: string, password: string): Observable<any> {

    return this.http.post(
        environment.BASE_URL + ApiConstant.AUTH_PREFIX +'signin',
      {
        login,
        password,
      },
      httpOptions
    );
  }

  logout(idUser : number): Observable<any> {
    const formData: FormData = new FormData();
    formData.set("idUser",idUser.toString());
    return this.http.post( environment.BASE_URL + ApiConstant.AUTH_PREFIX + 'logout', formData);
  }

  verifinitPassword(token : string) : Observable<ApiResponse> {
    const httpparam = new HttpParams().set("token" , token);
    return this.http.get<ApiResponse>(environment.BASE_URL + ApiConstant.AUTH_PREFIX + 'initPasswordConfirm', {params : httpparam})
  }

  modifPassword(token : string , password : string) : Observable<ApiResponse>{
    return this.http.put<ApiResponse>(environment.BASE_URL + ApiConstant.AUTH_PREFIX + "modifPassword", {token,password});
  }

  authCheck() : Observable<boolean>{
    return this.http.get<boolean>(environment.BASE_URL + ApiConstant.AUTH_PREFIX + "autCheck");

  }



}
