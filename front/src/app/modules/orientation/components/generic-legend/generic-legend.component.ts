import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-generic-legend',
  templateUrl: './generic-legend.component.html',
  styleUrls: ['./generic-legend.component.scss']
})
export class GenericLegendComponent {
  @Input() title: string = '';
  @Input() legends: Legend[] =  [];
}

export class Legend {
  name?: string;
  color?: string;
}