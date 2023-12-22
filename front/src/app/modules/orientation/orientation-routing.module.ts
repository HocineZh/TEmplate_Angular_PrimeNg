import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOrientationComponent } from './components/list-orientation/list-orientation.component';
import { AddOrientationComponent } from './components/add-orientation/add-orientation.component';
import { UpdateOrientationComponent } from './components/update-orientation/update-orientation.component';
import { SuiviOrientationComponent } from './components/suivi-orientation/suivi-orientation.component';
import { AuthCanGuard } from 'src/app/_helpers/auth-can.guard';


const routes: Routes = [
  {path : '' ,
  children : [
    {path : "" ,redirectTo : "list" , pathMatch: 'full' },

    {path : "list" , component : ListOrientationComponent , data: {breadcrumb: 'List les orientations',permissions : ['orientation.list']},canActivate:[AuthCanGuard]},
    {path : "addOrientation" , component : AddOrientationComponent , data: {breadcrumb: 'Ajouter une orientation',permissions : ['orientation.add']},canActivate:[AuthCanGuard]},
    {path : "updateOrientation/:id" , component : UpdateOrientationComponent , data: {breadcrumb: 'Modifier une orientation',permissions : ['orientation.update','orientation.add']},canActivate:[AuthCanGuard]},
    {path : "suiviOrientation/:id" , component : SuiviOrientationComponent , data: {breadcrumb: 'Suivre l etat d avancement de l orientation',permissions : ['user.suivi']},canActivate:[AuthCanGuard]},


  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrientationRoutingModule { }
