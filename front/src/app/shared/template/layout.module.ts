import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppBreadcrumbComponent } from './components/app.breadcrumb.component';
import { AppMenuProfileComponent } from './components/app.menuprofile.component';
import { AppTopbarComponent } from './components/app.topbar.component';
import { AppRightMenuComponent } from './components/app.rightmenu.component';
import { AppMenuComponent } from './components/app.menu.component';
import { AppSidebarComponent } from './components/app.sidebar.component';
import { AppMenuitemComponent } from './components/app.menuitem.component';
import { AppFooterComponent } from './components/app.footer.component';

import { BadgeModule } from 'primeng/badge';

import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { RouterModule } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { StyleClassModule } from 'primeng/styleclass';
import { TooltipModule } from 'primeng/tooltip';
import { HttpClientModule } from '@angular/common/http';
import { PrivilegeDirective } from '../directive/privilege.directive';
import { PrivilegeEvenementDirective } from '../directive/privilege-evenement.directive';
import { DialogModule } from 'primeng/dialog';
import {NotificationModule} from 'src/app/modules/notification/notification.module';
import { ToastModule } from 'primeng/toast';
import {AvatarModule} from 'primeng/avatar';
import { SplitPipe } from '../pipe/split.pipe';


@NgModule({
  declarations: [
    AppBreadcrumbComponent,
    AppMenuProfileComponent,
    AppTopbarComponent,
    AppRightMenuComponent,
    AppMenuComponent,
    AppSidebarComponent,
    AppMenuitemComponent,
    AppFooterComponent,
    PrivilegeDirective,
    PrivilegeEvenementDirective,
    SplitPipe
  ],
  imports: [
    AvatarModule,
    CommonModule,
    BadgeModule,
    ButtonModule,
    FormsModule,
    InputSwitchModule,
    InputTextModule,
    MegaMenuModule,
    MenuModule,
    RadioButtonModule,
    RippleModule,
    RouterModule,
    SidebarModule,
    StyleClassModule,
    TooltipModule,
    HttpClientModule,
    DialogModule,
    NotificationModule,
    ToastModule
  ],
  exports : [AppBreadcrumbComponent,
    AppMenuProfileComponent,
    AppTopbarComponent,
    AppRightMenuComponent,
    AppMenuComponent,
    AppSidebarComponent,
    AppMenuitemComponent,
    AppFooterComponent,
    PrivilegeDirective,
    PrivilegeEvenementDirective,
    SplitPipe
    ]

})
export class LayoutModule { }
