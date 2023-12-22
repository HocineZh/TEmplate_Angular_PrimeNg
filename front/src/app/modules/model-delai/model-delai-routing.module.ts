import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListModelDelaiComponent } from './components/list-model-delai/list-model-delai.component';
import { AddModelDelaiComponent } from './components/add-model-delai/add-model-delai.component';

const routes: Routes = [
  {path : '' ,
  children : [
    {path : "" ,redirectTo : "list" , pathMatch: 'full' },
    {path : "list" , component : ListModelDelaiComponent , data: {breadcrumb: 'List des modèle de délai'}},
    {path : "addModel" , component : AddModelDelaiComponent , data: {breadcrumb: 'Ajouter modèle de délai'}},
    {path : "editModel/:id" , component : AddModelDelaiComponent , data: {breadcrumb: 'Modifier un Utilisateur'}},

  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModelDelaiRoutingModule { }
