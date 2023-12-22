import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
const routerOptions: ExtraOptions = {
  anchorScrolling: 'enabled'
};
const authenticationModule = () => import('./modules/authentication/authentication.module').then(m => m.AuthenticationModule)

const adminModule = () => import('./modules/admin/admin.module').then(m => m.AdminModule)


const routes: Routes = [
  {path: '', redirectTo:'auth' , pathMatch: 'full' },
  {path: 'auth', loadChildren : authenticationModule },
  {path: 'admin', loadChildren : adminModule },

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true,  anchorScrolling: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
