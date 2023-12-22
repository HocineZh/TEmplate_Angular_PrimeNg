import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSeanceComponent } from './components/list-seance/list-seance.component';
import { AddSeanceComponent } from './components/add-seance/add-seance.component';
import { EditSeanceComponent } from './components/edit-seance/edit-seance.component';

const routes: Routes = [
  {path : '' ,
    children : [
      {path : "" ,redirectTo : "list" , pathMatch: 'full' },
      {path : "list" , component : ListSeanceComponent , data: {breadcrumb: 'Liste des séances'}},
      {path : "addSeance" , component : AddSeanceComponent , data: {breadcrumb: 'Ajouter Nouvelle séance'}},
      {path : "editSeance/:id" , component : EditSeanceComponent , data: {breadcrumb: 'Modifier une séance'}},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeancesRoutingModule { }
