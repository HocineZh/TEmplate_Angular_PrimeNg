import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListModelFctComponent } from './components/list-model-fct/list-model-fct.component';
import { AddModelFctComponent } from './components/add-model-fct/add-model-fct.component';
import { UpdateModelFctComponent } from './components/update-model-fct/update-model-fct.component';

const routes: Routes = [
  {path : '' ,
  children : [
    //{path : "" ,redirectTo : "list" , pathMatch: 'full' },
    {path : "list/:id" , component : ListModelFctComponent , data: {breadcrumb: 'Liste des modèle de fonctionnalitées'}},
    {path : "addModel/:id" , component : AddModelFctComponent , data: {breadcrumb: 'Ajouter modèle de fonctionnalitées'}},
    {path : 'updateModel/:id/:process_id' , component : UpdateModelFctComponent , data: {breadcrumb: 'modifier modèle de fonctionnalitées'}},
//{path : 'viewModel/:id' , component : ViewModelFctComponent , data: {breadcrumb: 'Consulter modèle dordre de jour'}}
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModelFonctionnaliteRoutingModule { }
