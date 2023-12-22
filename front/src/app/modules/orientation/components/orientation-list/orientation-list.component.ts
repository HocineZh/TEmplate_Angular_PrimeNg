import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OrientationRoutingModule } from '../../orientation-routing.module';
import { OrientationModule } from '../../orientation.module';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { OrientationService } from '../../services/orientation.service';

@Component({
  selector: 'app-orientation-list',
  templateUrl: './orientation-list.component.html',
  styles: [`
  :host ::ng-deep .p-timeline-event-opposite {
      flex: 0;
      padding: 0 !important;
  }
`,]
})


export class OrientationListComponent implements OnInit {

  statuses: any[] = [];
  activityValues: number[] = [0, 100];
  representatives: String[] = [" ", " "];
  isExpanded: boolean = false;
  idFrozen: boolean = false;
  loading: boolean = true;
  @ViewChild('filter') filter!: ElementRef;

  constructor(private orientationService: OrientationService, private router: Router, private formBuilder: FormBuilder) {
    /*this.OrientationService.getAllData()
    .subscribe(data => {

    })*/
  }

  ngOnInit(): void {

  }


  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}


