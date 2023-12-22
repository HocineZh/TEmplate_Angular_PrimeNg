import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  getFormattedDatePipe(date:Date){
    try{
    let datePipe = new DatePipe('fr-FR');
    return datePipe.transform(date, 'EEEE, d MMMM y');

    }catch(ex){
      return null

    }
  }
}
