import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListDocumentComponent } from './components/list-document/list-document.component';
import { AuthCanGuard } from 'src/app/_helpers/auth-can.guard';



const routes: Routes = [
  {path : '' ,
  children : [
    {path : "" ,redirectTo : "list" , pathMatch: 'full' },
     {path : "list" , component : ListDocumentComponent , data: {breadcrumb: 'List les orientations',permissions : ['document.list']},canActivate:[AuthCanGuard]},


  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentRoutingModule { }
