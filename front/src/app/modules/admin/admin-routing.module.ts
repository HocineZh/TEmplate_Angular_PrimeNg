import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedComponentComponent } from './shared-component/shared-component.component';


const dashboardModule = () => import('../dashboard/dashboard.module').then(m => m.DashboardModule);
const evenementsModule = () => import('../evenements/evenements.module').then(m => m.evenementsModule);
const hierarchyModule = () => import('../hierarchy/hierarchy.module').then(m => m.HierarchyModule);
const membreModule = () => import('../membres/membre.module').then(m => m.MembreModule) ;
const modelDelaiModule = () => import('../model-delai/model-delai.module').then(m => m.ModelDelaiModule) ;
const modelFctModule = () => import('../model-fonctionnalite/model-fonctionnalite.module').then(m => m.ModelFonctionnaliteModule) ;
const modelOrdreJourModule = () => import('../model-ordre-jour/model-ordre-jour.module').then(m => m.ModelOrdreJourModule) ;
const modelPointOrdreModule = () => import('../model-point-ordre/model-point-ordre.module').then(m => m.ModelPointOrdreModule) ;
const modelProcessModule = () => import('../model-process/model-process.module').then(m => m.ModelProcessModule) ;
const organeModule = () => import('../organes/organes.module').then(m => m.OrganesModule);
const orientationModule = () => import('../orientation/orientation.module').then(m => m.OrientationModule) ;
const permission_membre = () => import('../permission-membre/permission-membre.module').then(m => m.PermissionMembreModule) ;
const programme_annuelModule = () => import('../programme_annuel/programme_annuel.module').then(m => m.programme_annuelModule) ;
const roleModule = () => import('../permissions/permission.module').then(m => m.RoleModule) ;
const seanceModule = () => import('../seances/seances.module').then(m => m.SeancesModule);
const tachesModule = () => import('../taches/taches.module').then(m => m.TachesModule) ;
const usersModule = () => import('../users/user.module').then(m => m.UserModule) ;
const typeOrganeModule = () => import('../type-organe/type-organe.module').then(m => m.TypeOrganeModule);
const documentModule = () => import('../document/document.module').then(m => m.DocumentModule);
const convocationodule = () => import('../convocation/convocation.module').then(m =>m.ConvocationModule);
const dossierModule = () => import('../dossier/dossier.module').then(m => m.DossierModule)
const reportingModule = () => import('../reporting/reporting.module').then(m => m.ReportingModule)
const utilisationModule = () => import('../utilisation/utilisation.module').then(m => m.UtilisationModule);

const routes: Routes = [
  { path: "",component : SharedComponentComponent,
    children :[
      {path : "" ,redirectTo : "dashboard" , pathMatch: 'full' },
      {path: 'dashboard', loadChildren : dashboardModule },
      {path:'evenements',loadChildren : evenementsModule},
      {path: 'membres', loadChildren : membreModule },
      {path : 'modelDelai' , loadChildren: modelDelaiModule },
      {path : 'modelFonctionnalite' , loadChildren: modelFctModule },
      {path : 'modelOrdreJour' , loadChildren: modelOrdreJourModule },
      {path : 'modelPointOrdre' , loadChildren: modelPointOrdreModule },
      {path : 'modelProcess' , loadChildren: modelProcessModule },
      {path: 'organes', loadChildren : organeModule },
      {path: 'permission_membre', loadChildren : permission_membre },
      {path: 'programme_annuel', loadChildren : programme_annuelModule },
      {path: 'roles', loadChildren : roleModule },
      {path : 'seances', loadChildren : seanceModule },
      {path: 'societes', loadChildren : hierarchyModule },
      {path : 'suiviOrientation' , loadChildren: orientationModule },
      {path : 'taches', loadChildren : tachesModule },
      {path: 'users', loadChildren : usersModule },
      {path : 'suiviOrientation' , loadChildren: orientationModule },
      {path : 'modelOrdreJour' , loadChildren: modelOrdreJourModule },
      {path : 'modelPointOrdre' , loadChildren: modelPointOrdreModule },
      {path : 'modelProcess' , loadChildren: modelProcessModule },
      {path : 'modelFonctionnalite' , loadChildren: modelFctModule },
      {path : 'modelDelai' , loadChildren: modelDelaiModule },
      {path: 'seances', loadChildren : seanceModule },
      {path: 'typeOrgane', loadChildren : typeOrganeModule },
      {path : 'document' , loadChildren: documentModule },
      {path: 'conovocation', loadChildren : convocationodule },
      { path: 'dossier', loadChildren: dossierModule },
      { path: 'reporting', loadChildren: reportingModule },
     {path: 'utilisationModule', loadChildren: utilisationModule}]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
