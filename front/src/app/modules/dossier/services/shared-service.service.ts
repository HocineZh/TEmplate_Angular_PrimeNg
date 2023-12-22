import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {

  keyboardEventListner$: BehaviorSubject<string> = new BehaviorSubject<string>("");

  
  keyboardEventListner = this.keyboardEventListner$.asObservable();

}
