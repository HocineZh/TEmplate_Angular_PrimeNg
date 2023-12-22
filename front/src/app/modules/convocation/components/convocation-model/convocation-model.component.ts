import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewChildren } from '@angular/core';
import { Evenement } from 'src/app/modules/evenements/models/evenement';
import { DetailsMembres } from 'src/app/modules/membres/model/membre';

@Component({
  selector: 'app-convocation-model',
  templateUrl: './convocation-model.component.html',
  styleUrls: ['./convocation-model.component.scss']
})
export class ConvocationModelComponent {
  @ViewChild('divToPrint') elementHTML !: ElementRef;
  @Output() element = new EventEmitter<ElementRef>();
  @Input() selectedEvenement !: Evenement ;
  @Input() selectedMembre !: DetailsMembres ;
  currentDate !: Date ;


  constructor() {

  }

  ngOnInit(): void {
      this.currentDate = new Date() ;
  }

  ngAfterViewInit(): void {
    this.element.emit(this.elementHTML);
  }

  exportPdf(){

  }

}
