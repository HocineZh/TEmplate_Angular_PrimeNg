import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMembreComponent } from './components/add-membre/add-membre.component';
import { ListMembreComponent } from './components/list-membre/list-membre.component';

const routes: Routes = [
  {path : '' ,
    children : [
      {path : "" ,redirectTo : "add" , pathMatch: 'prefix' },
      {path : "add" , component : AddMembreComponent , data: {breadcrumb: 'Liste des societes'}},
      {path : "listMembres/:id" , component : ListMembreComponent , data: {breadcrumb: 'Liste des membres'}}
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembreRoutingModule { }
