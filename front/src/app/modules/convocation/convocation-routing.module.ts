import { ConvocationComponent } from './components/convocation/convocation.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthCanGuard } from 'src/app/_helpers/auth-can.guard';
import { ConvocationModelComponent } from './components/convocation-model/convocation-model.component';

const routes: Routes = [
  {path : '' ,
    children : [
      {path : "" ,redirectTo : "reponse" , pathMatch: 'prefix' },
      {path : "reponse" , component : ConvocationComponent , data: {breadcrumb: 'Convocation'}, canActivate:[AuthCanGuard] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConvocationRoutingModule { }
