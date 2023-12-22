import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BilanOrganesComponent } from './components/bilan-organes/bilan-organes.component';
import { AuthCanGuard } from 'src/app/_helpers/auth-can.guard';


const routes: Routes = [
  {path : '' ,
    children : [
      {path : "" ,redirectTo : "bilan_organes" , pathMatch: 'full' },
      {path : "bilan_organes" , component : BilanOrganesComponent  , data: {breadcrumb: 'Bilan des organes'},canActivate:[AuthCanGuard]},
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
  
})
export class ReportingRoutingModule { }
