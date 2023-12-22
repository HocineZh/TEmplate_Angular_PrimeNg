import { Component, Input } from '@angular/core';
import { MandatRemplacement } from '../../model/convocation.model';

@Component({
  selector: 'app-mandat-model',
  templateUrl: './mandat-model.component.html',
  styleUrls: ['./mandat-model.component.scss']
})
export class MandatModelComponent {
  @Input() mandatRemplacent : MandatRemplacement = {};
}
