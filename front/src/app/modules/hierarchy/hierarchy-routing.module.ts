import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSocieteComponent } from './components/list-societe/list-societe.component';
import { AuthCanGuard } from 'src/app/_helpers/auth-can.guard';

const routes: Routes = [
  {path : '' ,
    children : [
      {path : "" ,redirectTo : "list" , pathMatch: 'prefix' },
      {path : "list" , component : ListSocieteComponent , data: {breadcrumb: 'Liste des societes'},canActivate:[AuthCanGuard]},
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HierarchyRoutingModule { }
