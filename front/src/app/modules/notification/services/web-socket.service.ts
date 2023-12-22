import { Injectable } from '@angular/core';
import {IMessage, RxStomp} from '@stomp/rx-stomp';
import {Observable, Observer, Subject, Subscription, catchError, switchAll, tap} from 'rxjs';
import {AnonymousSubject} from 'rxjs/internal/Subject';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import {environment} from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class WebSocketService  {

  private rxStomp!: RxStomp;
  private subscription!: Subscription;

  constructor(){
    this.getNewRxStomp();
  }

  getNewRxStomp(){

    if(!this.rxStomp){
      this.rxStomp = new RxStomp();
      this.rxStomp.configure({
        brokerURL: environment.WS_URL,
        reconnectDelay: 0
        // debug: (msg: string): void => {
        //   console.log(new Date(), msg);
        // },
      });
    }
    return this.rxStomp;
  }

  activate(){
    this.rxStomp.activate();
  }


  subscripte(distination: string, calback: (value: IMessage) => void ){
    this.subscription = this.rxStomp
    .watch({ destination: distination })
    .subscribe(calback);
  }

  async  unsubscripte(){
      this.subscription.unsubscribe();
      await this.rxStomp.deactivate();
}

}
