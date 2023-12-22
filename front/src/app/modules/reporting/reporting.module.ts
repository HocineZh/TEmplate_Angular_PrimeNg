import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportingRoutingModule } from './reporting-routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { BilanOrganesComponent } from './components/bilan-organes/bilan-organes.component';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';





@NgModule({
  declarations: [
    BilanOrganesComponent
  ],
  imports: [
    CommonModule,
    ReportingRoutingModule,
    FormsModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    ToastModule,
    TableModule
  ]
})
export class ReportingModule { }
