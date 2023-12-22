import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTypeOrganeComponent } from './components/list-type-organe/list-type-organe.component';
import { AddTypeOrganeComponent } from './components/add-type-organe/add-type-organe.component';
import { EditTypeOrganeComponent } from './components/edit-type-organe/edit-type-organe.component';
import { AuthCanGuard } from 'src/app/_helpers/auth-can.guard';

const routes: Routes = [
  {path : '' ,
    children : [
      {path : "" ,redirectTo : "list" , pathMatch: 'full' },
      {path : "list" , component : ListTypeOrganeComponent , data: {breadcrumb: 'Liste des types organes',permissions : ['typeOrgane.list']},canActivate:[AuthCanGuard]},
      {path : "addTypeOrgane" , component : AddTypeOrganeComponent , data: {breadcrumb: 'Ajouter nouveau type organe',permissions : ['typeOrgane.add']},canActivate:[AuthCanGuard]},
      {path : "editTypeOrgane/:id" , component : EditTypeOrganeComponent , data: {breadcrumb: 'Modifier un type organe',permissions : ['typeOrgane.update']},canActivate:[AuthCanGuard]},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypeOrganeRoutingModule { }
