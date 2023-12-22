import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListEvenementsComponent } from './components/list-evenements/list-evenements.component';
import { AddEvenementComponent } from './components/add-evenement/add-evenement.component';
import { EditEvenementComponent } from './components/edit-evenement/edit-evenement.component';
import { CalendrierEvenementsComponent } from './components/calendrier-evenements/calendrier-evenements.component';
import { AuthCanGuard } from 'src/app/_helpers/auth-can.guard';

const routes: Routes = [
  {path : '' ,
    children : [
      {path : "" ,redirectTo : "list" , pathMatch: 'full' },
      {path : "list" , component : ListEvenementsComponent , data: {breadcrumb: 'Liste des évènements', permissions : ['evenement.list','evenement.listOwn']} ,canActivate:[AuthCanGuard]},
      {path : "calendrier" , component : CalendrierEvenementsComponent , data: {breadcrumb: 'Calendrier des évènements', permissions : ['evenement.list','evenement.listOwn']} ,canActivate:[AuthCanGuard]},
      {path : "add" , component : AddEvenementComponent , data: {breadcrumb: 'Ajouter un évènement', permissions : ['evenement.createOwn']} ,canActivate:[AuthCanGuard]},
      {path : "edit/:id" , component : EditEvenementComponent , data: {breadcrumb: 'Détails évènement', permissions : ['evenement.details','evenement.detailsOwn']} ,canActivate:[AuthCanGuard]}, 
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class evenementsRoutingModule { }
