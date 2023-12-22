import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOrganeComponent } from './components/list-organe/list-organe.component';
import { AddOrganeComponent } from './components/add-organe/add-organe.component';
import { EditOrganeComponent } from './components/edit-organe/edit-organe.component';
import { AuthCanGuard } from 'src/app/_helpers/auth-can.guard';

const routes: Routes = [
  {path : '' ,
    children : [
      {path : "" ,redirectTo : "list" , pathMatch: 'full' },
      {path : "list" , component : ListOrganeComponent , data: {breadcrumb: 'Liste des organes' , permissions : ['organe.list']} ,canActivate:[AuthCanGuard]},
      {path : "addOrgane" , component : AddOrganeComponent , data: {breadcrumb: 'Ajouter Nouvel organe'}},
      {path : "editOrgane/:id" , component : EditOrganeComponent , data: {breadcrumb: 'Modifier un organe'}},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganesRoutingModule { }
