import { AuthCanGuard } from 'src/app/_helpers/auth-can.guard';
import { AddTacheComponent } from './components/add-tache/add-tache.component';
import { CreerModeleComponent } from './components/creer-modele/creer-modele.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { ListModelesComponent } from './components/list-modeles/list-modeles.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TacheKanbanAppComponent } from './components/kanban/tache-kanban-parent/kanban.app.component';


const routes: Routes = [
      {path : "" , redirectTo : "ListAll" , pathMatch: 'prefix' },
      {path : "list" , component : AddTacheComponent , data: {breadcrumb: 'Liste des tâches', permissions : ['parametrage.tache.list']}, canActivate:[AuthCanGuard]},
      {path : "modelTaches" , component : ListModelesComponent , data: {breadcrumb: 'Modèles des tâches', permissions : ['parametrage.tache.list']}, canActivate:[AuthCanGuard]},
      {path : "creerModele" , component : CreerModeleComponent , data: {breadcrumb: 'Créer un modèles des tâches', permissions : ['parametrage.tache.add']}, canActivate:[AuthCanGuard]},
      {path : "creerModele/:id" , component : CreerModeleComponent , data: {breadcrumb: 'Modifier un modèles des tâches', permissions : ['parametrage.tache.update']}, canActivate:[AuthCanGuard]},
      {path : "kan/:id" , component : TacheKanbanAppComponent , data: {breadcrumb: 'Ajouter une tâches', permissions : ['tache.list']}, canActivate:[AuthCanGuard]},
      {path : "ListAll" , component : EventListComponent , data: {breadcrumb: 'Toutes les tâches', permissions : ['tache.list']},  canActivate:[AuthCanGuard]},
    ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TachesRoutingModule { }
