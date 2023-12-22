import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListRolesComponent } from './components/list-roles/list-roles.component';
import { AddRoleComponent } from './components/add-role/add-role.component';
import { AuthCanGuard } from 'src/app/_helpers/auth-can.guard';
import { ListPrivilegesComponent } from './components/list-privileges/list-privileges.component';
import { ConfirmationService } from 'primeng/api';


const routes: Routes = [
  {path : '' ,
    children : [
      {path : "" ,redirectTo : "list" , pathMatch: 'prefix' },
      {path : "list" , component : ListRolesComponent , data: {breadcrumb: 'Liste des rôles',permissions : ['role.list']},canActivate:[AuthCanGuard]},
      {path : "addRole" , component : AddRoleComponent , data: {breadcrumb: 'Ajouter un nouveau Role',permissions : ['role.add']},canActivate:[AuthCanGuard]},
      {path : "addRole/:id" , component : AddRoleComponent , data: {breadcrumb: 'Modifier Role',permissions : ['role.add','role.update']},canActivate:[AuthCanGuard]},
      {path : "listPrivilege" , component : ListPrivilegesComponent , data: {breadcrumb: 'Liste des privileges',permissions : ['privilege.list']},canActivate:[AuthCanGuard]},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionRoutingModule { }
