import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListModelProcessComponent } from './components/list-model-process/list-model-process.component';
import { AddModelProcessComponent } from './components/add-model-process/add-model-process.component';
import { UpdateModelProcessComponent } from './components/update-model-process/update-model-process.component';

const routes: Routes = [
   {path : '' ,
  children : [
    {path : "" ,redirectTo : "list" , pathMatch: 'full' },
    {path : "list" , component : ListModelProcessComponent , data: {breadcrumb: 'Liste des modèle de process'}},
    {path : "addModel" , component : AddModelProcessComponent , data: {breadcrumb: 'Ajouter modèle de process'}},
    {path : 'updateModel/:id' , component : UpdateModelProcessComponent , data: {breadcrumb: 'modifier modèle de proceess'}},
//{path : 'viewModel/:id' , component : ViewModelFctComponent , data: {breadcrumb: 'Consulter modèle dordre de jour'}}
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModelProcessRoutingModule { }
