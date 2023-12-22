import { Component } from '@angular/core';
import { CalendarAppComponent } from '../calendar/calendar.app.component';

@Component({
  selector: 'app-prv-filters-sidebar',
  templateUrl: './prv-filters-sidebar.component.html',
  styleUrls: ['./prv-filters-sidebar.component.scss']
})
export class PrvFiltersSidebarComponent {

  constructor(public parent : CalendarAppComponent){

  }

  onClearFilter(){
    this.parent.clearFilter();

  }
  onFilter(){

    this.parent.filtrer();

  }
}
