import { UserInfoResponse } from './../../modules/authentication/model/login';
import { Injectable } from '@angular/core';
import { EventData } from '../models/event';
import { BehaviorSubject, Observable, Subject, Subscription, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventBusService {

  private subject$ = new Subject<EventData>();
  private privileges$ = new BehaviorSubject<string[]>([]);
  selectedPrivileges$ = this.privileges$.asObservable();
  private currentuser = new BehaviorSubject<UserInfoResponse>({});


  constructor() { }

  emit(event: EventData) {
    this.subject$.next(event);
  }

  on(eventName: string, action: any): Subscription {
    return this.subject$.pipe(
      filter((e: EventData) => e.name === eventName),
      map((e: EventData) => e["value"])).subscribe(action);
  }

  setPrirvileges(privileges: string[]) {
    this.privileges$.next(privileges);
  }

  getPrivileges() : Observable<string[]> {
    return this.selectedPrivileges$ ;
  }


  setCurrentUser(user : UserInfoResponse) {
    this.currentuser.next(user);
  }

  getCurrentUser() : Observable<UserInfoResponse> {
    return this.currentuser.asObservable() ;
  }

  hasPrivilges(hprivileges : string[]) : any{

    let privilegesUser : String[] = this.privileges$.getValue();


    if( hprivileges!== null){
          let existPrv = hprivileges.some(value => {
            return privilegesUser.includes(value);
          });
          return existPrv;

    }else{
            return false;
    }

  }



}
