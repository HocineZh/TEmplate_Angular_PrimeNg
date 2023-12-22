import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthCanGuard } from 'src/app/_helpers/auth-can.guard';




const routes: Routes = [
  {path : '' ,
    children : [
      {path : "" ,redirectTo : "all" , pathMatch: 'prefix' },
      {path : "all" , component : DashboardComponent , data: {breadcrumb: 'Dashboard'}, canActivate:[AuthCanGuard] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
