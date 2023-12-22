import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationRoutingModule } from './notification-routing.module';
import { DialogModule } from 'primeng/dialog';
import {NotificationService} from './services/notification.service';
import {HttpClientModule} from '@angular/common/http';
import { NotificationBellComponent } from './components/notification-bell/notification-bell.component';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {StyleClassModule} from 'primeng/styleclass';
import {TooltipModule} from 'primeng/tooltip';
import {ImportantNotifDialogComponent} from './components/important-notif-dialog/important-notif-dialog.component';
import {BadgeModule} from 'primeng/badge';
import {FormsModule} from '@angular/forms';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputTextModule} from 'primeng/inputtext';
import {MegaMenuModule} from 'primeng/megamenu';
import {MenuModule} from 'primeng/menu';
import {RadioButtonModule} from 'primeng/radiobutton';
import {RouterModule} from '@angular/router';
import {SidebarModule} from 'primeng/sidebar';


@NgModule({
  declarations: [
    NotificationBellComponent,
    ImportantNotifDialogComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    NotificationRoutingModule,
    DialogModule,
    RippleModule,
    StyleClassModule,
    TooltipModule,
    HttpClientModule,
    BadgeModule,
    FormsModule,
    InputSwitchModule,
    InputTextModule,
    MegaMenuModule,
    MenuModule,
    RadioButtonModule,
    RouterModule,
    SidebarModule,
  ],
  exports: [NotificationBellComponent, ImportantNotifDialogComponent],
  providers: [NotificationService]
})
export class NotificationModule { }
