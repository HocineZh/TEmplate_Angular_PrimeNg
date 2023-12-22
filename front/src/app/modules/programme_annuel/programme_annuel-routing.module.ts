import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarAppComponent } from './components/calendar/calendar.app.component';

const routes: Routes = [
  {path : '' ,
    children : [
      {path : "" ,redirectTo : "calendrier" , pathMatch: 'full' },
      {path : "calendrier" , component : CalendarAppComponent , data: {breadcrumb: 'Programme annuel'}},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class programme_annuelRoutingModule { }
