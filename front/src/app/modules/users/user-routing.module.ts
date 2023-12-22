import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUserComponent } from './components/list-user/list-user.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { ListUserLogsComponent } from './components/list-user-logs/list-user-logs.component';
import { AuthCanGuard } from 'src/app/_helpers/auth-can.guard';
import { RenitPasswordComponent } from './components/renit-password/renit-password.component';
const routes: Routes = [
  {path : '' ,
    children : [
      {path : "" ,redirectTo : "list" , pathMatch: 'prefix' },
      {path : "list" , component : ListUserComponent , data: {breadcrumb: 'Liste des utilisateurs',permissions : ['user.list']},canActivate:[AuthCanGuard]},
      {path : "addUser" , component : AddUserComponent , data: {breadcrumb: 'Ajouter Nouvel Utilisateur',permissions : ['user.add']},canActivate:[AuthCanGuard]},
      {path : "editUser/:id" , component : AddUserComponent , data: {breadcrumb: 'Modifier un Utilisateur',permissions : ['user.update','user.add']},canActivate:[AuthCanGuard]},
      {path : "visualise/:id" , component : AddUserComponent , data: {breadcrumb: 'Modifier un Utilisateur',permissions : ['user.update','user.add']},canActivate:[AuthCanGuard]},
      {path : "listUserLogs" , component : ListUserLogsComponent , data: {breadcrumb: 'Liste des Logs des utilisateurs '},canActivate:[AuthCanGuard]},
      {path : "renitPassword" , component : RenitPasswordComponent , data: {breadcrumb: 'Réinitialisation du mot de passe'},canActivate:[AuthCanGuard]},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
