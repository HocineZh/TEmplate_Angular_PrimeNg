import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPrivilegesComponent } from './compoenents/list-privileges/list-privileges.component';
import { ListProfilComponent } from './compoenents/list-profil/list-profil.component';
import { AddProfilComponent } from './compoenents/add-profil/add-profil.component';

const routes: Routes = [
  {path : '' ,
    children : [
      {path : "" ,redirectTo : "list-profil" , pathMatch: 'prefix' },
      {path : "list-profil" , component : ListProfilComponent , data: {breadcrumb: 'Liste des profils'}},
      {path : "list-privilege" , component : ListPrivilegesComponent , data: {breadcrumb: 'Liste des privileges'}},
      {path : "add-profil" , component : AddProfilComponent , data: {breadcrumb: 'Liste des profils'}},
      {path : "add-profil/:id" , component : AddProfilComponent , data: {breadcrumb: 'Liste des profils'}},
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionMembreRoutingModule { }
