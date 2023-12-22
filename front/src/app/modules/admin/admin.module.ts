import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedComponentComponent } from './shared-component/shared-component.component';
import { AppConfigModule } from 'src/app/shared/template/config/app.config.module';
import { LayoutModule } from 'src/app/shared/template/layout.module';
import {NotificationModule} from '../notification/notification.module';
import { MessageService } from 'primeng/api';
registerLocaleData(localeFr, 'fr-FR');


@NgModule({
  declarations: [SharedComponentComponent],

  imports: [
    AdminRoutingModule,
    LayoutModule,
    CommonModule,
    AppConfigModule,
    NotificationModule,

  ],
  providers: [MessageService,{
    provide: LOCALE_ID,
    useValue: 'fr-FR',
    }]
})
export class AdminModule { }
