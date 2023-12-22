import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UtilisationRoutingModule } from './utilisation-routing.module';
import { AddUtilTypeOgComponent } from './components/add-util-type-og/add-util-type-og.component';
import { ListUtilTypeOgComponent } from './components/list-util-type-og/list-util-type-og.component';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from 'src/app/shared/template/layout.module';


@NgModule({
  declarations: [
    AddUtilTypeOgComponent,
    ListUtilTypeOgComponent
  ],
  imports: [
    CommonModule,
    UtilisationRoutingModule,
    ToastModule,
    InputTextModule,
    FormsModule,
    LayoutModule
  ]
})
export class UtilisationModule { }
