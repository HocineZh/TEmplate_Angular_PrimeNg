import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListDossierComponent } from './component/list-dossier/list-dossier.component';
import {FileExplorerComponent} from './component/file-explorer/file-explorer.component';

const routes: Routes = [ {path : '' ,
children : [
  {path : "" ,redirectTo : "list" , pathMatch: 'full' },
  {path : "list/:parentId" , component : FileExplorerComponent , data: {breadcrumb: 'Liste des Dossiers'}},

]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DossierRoutingModule { }
