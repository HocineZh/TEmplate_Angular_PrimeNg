import { Component } from '@angular/core';
import { ListEvenementsComponent } from '../list-evenements/list-evenements.component';

@Component({
  selector: 'app-filters-sidebar',
  templateUrl: './filters-sidebar.component.html',
  styleUrls: ['./filters-sidebar.component.scss']
})
export class FiltersSidebarComponent {

  constructor(public parent : ListEvenementsComponent){

  }

  onClearFilter(){
    this.parent.clearFilter();
    this.parent.evenementView.applyFilters = false;

  }
  onFilter(){
    this.parent.evenementView.applyFilters = true;
    this.parent.firstLoadFilters = false;
    this.parent.filtrer();
    

  }

}
