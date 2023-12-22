import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListModelOjComponent } from './components/list-model-oj/list-model-oj.component';
import { AddModelOjComponent } from './components/add-model-oj/add-model-oj.component';
import { UpdateModelOjComponent } from './components/update-model-oj/update-model-oj.component';
import { ViewModelOjComponent } from './components/view-model-oj/view-model-oj.component';


const routes: Routes = [
  {path : '' ,
  children : [
    {path : "" ,redirectTo : "list" , pathMatch: 'full' },
    {path : "list" , component : ListModelOjComponent , data: {breadcrumb: 'Liste des modèle dordre de jour'}},
    {path : "addModel" , component : AddModelOjComponent , data: {breadcrumb: 'Ajouter modèle dordre de jour'}},
    {path : 'updateModel/:id' , component : UpdateModelOjComponent , data: {breadcrumb: 'modifier modèle dordre de jour'}},
    {path : 'viewModel/:id' , component : ViewModelOjComponent , data: {breadcrumb: 'Consulter modèle dordre de jour'}}
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModelOrdreJourRoutingModule { }
