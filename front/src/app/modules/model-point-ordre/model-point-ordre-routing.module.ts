import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListModelPojComponent } from './component/list-model-poj/list-model-poj.component';
import { AddModelPojComponent } from './component/add-model-poj/add-model-poj.component';
import { UpdateModelPojComponent } from './component/update-model-poj/update-model-poj.component';
import { SetModelPojComponent } from './component/set-model-poj/set-model-poj.component';

const routes: Routes = [
  {path : '' ,
  children : [
    {path : "" ,redirectTo : "list" , pathMatch: 'full' },
    {path : "list" , component : ListModelPojComponent , data: {breadcrumb: 'Liste des modèle point dordre de jour'}},
    {path : "addModelPoint" , component : AddModelPojComponent , data: {breadcrumb: 'Ajouter modèle point dordre de jour'}},
    {path : "updateModelPoint/:id" , component : UpdateModelPojComponent , data: {breadcrumb: 'modifier modèle point dordre de jour'}},
    {path : "setModelPoint" , component : SetModelPojComponent , data: {breadcrumb: 'Ajouter modèle point dordre de jour'}}
  ]
}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModelPointOrdreRoutingModule { }
