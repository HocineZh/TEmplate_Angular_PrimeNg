import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {ApiConstant} from 'src/app/shared/constant';
import {environment} from 'src/environments/environment';
import {Notification} from '../model/notification.model';
import {NotifMembre} from '../model/notif-membre.model';
import {Page} from '../../../shared/models/page.model';

@Injectable()
export class NotificationService {

  
  constructor(private http : HttpClient) { }

  getUserNotificaions(page : number = 0): Observable<Page<NotifMembre[]>>{
    return this.http.get<Page<NotifMembre[]>>(environment.BASE_URL + ApiConstant.NOTIF_PREFIX + 'me?page='+page)
  }

  getImportantNotif(): Observable<NotifMembre[]>{
    return this.http.get<NotifMembre[]>(environment.BASE_URL + ApiConstant.NOTIF_PREFIX + 'important')
  }

  hasreadNotification(notifId: number): Observable<Notification>{
    return this.http.put<Notification>(environment.BASE_URL + ApiConstant.NOTIF_PREFIX + `hasread/${notifId}`, {});
  }
}
