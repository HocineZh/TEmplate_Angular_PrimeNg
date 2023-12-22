import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserLog } from '../model/user';
import { ApiConstant } from 'src/app/shared/constant';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserLogService {

  constructor(private httpClient : HttpClient) { }



  getAllusersLogs() : Observable <UserLog[]>
  {
      return this.httpClient.get<UserLog[]>(environment.BASE_URL + ApiConstant.USERLOGS_PREFIX + 'getAllUserLog')
  }

  getAllusersLogsByMonthYear(yearMonth: string) : Observable <UserLog[]>
  {

      let httpparam = new HttpParams().set("date", yearMonth);
      return this.httpClient.get<UserLog[]>(environment.BASE_URL + ApiConstant.USERLOGS_PREFIX + 'getAllUserLogInOneMonth', {params : httpparam})
  }
}
