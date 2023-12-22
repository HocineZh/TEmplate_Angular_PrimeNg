import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MegaMenuItem, MessageService } from 'primeng/api';
import { LayoutService } from '../service/app.layout.service';
import { LoginService } from 'src/app/modules/authentication/services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventBusService } from '../../services/event-bus.service';
import {Notification} from 'src/app/modules/notification/model/notification.model';
import {NotificationService} from 'src/app/modules/notification/services/notification.service';
import {NotifMembre} from 'src/app/modules/notification/model/notif-membre.model';
import {WebSocketService} from 'src/app/modules/notification/services/web-socket.service';
import {DesktopNotificationService} from 'src/app/modules/notification/services/desktop-notification.service';
import { UserInfoResponse } from 'src/app/modules/authentication/model/login';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrls: ['./app.topbar.component.scss'],
    providers: [MessageService, DesktopNotificationService]

})
export class AppTopbarComponent implements OnInit {

    @ViewChild('menuButton') menuButton!: ElementRef;

    @ViewChild('mobileMenuButton') mobileMenuButton!: ElementRef;

    @ViewChild('searchInput') searchInput!: ElementRef;

    userName !: string ;
    idUser !: number ;
    constructor(public layoutService: LayoutService,
                public el: ElementRef ,
                private authService : LoginService ,
                private router : Router ,
                private eventBusService : EventBusService,
                private notificationService: NotificationService,
                private webSocket: WebSocketService,
                private messageService: MessageService,
                private desktopNotifService: DesktopNotificationService,
                private route: ActivatedRoute

                 ) {}
    ngOnInit(): void {
        this.getNotifications();
        this.eventBusService.getCurrentUser().subscribe(
          {
            next : (data : UserInfoResponse)=> {
              this.userName = data.username! ;
              this.idUser = data.id! ;
            },
            error: (error) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Server error' });            }
            }
        )
        this.webSocket.activate();

        if( this.desktopNotifService.permission !== "granted"){
            this.desktopNotifService.requestPermission();
        }
        this.webSocket.subscripte("/user/queue/notif", (message) => {
           let messageBody = JSON.parse(message.body);

           let newNotif: NotifMembre = {
            id: messageBody.id,
            etat: messageBody.etat,
            dateLecture: messageBody.dateLecture,
            idmail: messageBody.idmail,
            isrecu: messageBody.isrecu,
            alerteNotif: messageBody.alerteNotif,
           };

           this.notifications.unshift(newNotif)

           this.desktopNotifService.create(newNotif.alerteNotif.action.titre, {
            data: newNotif.alerteNotif.action.contenuMessage,
            icon: "https://avatars1.githubusercontent.com/u/28635252?s=400&v=4",
        })

           this.countUnreadedNotif = this.notifications.filter((notif) => {return notif.dateLecture === null}).length

           this.messageService.add({ severity: 'info', summary: 'Info', life:5000, detail: newNotif.alerteNotif.action.contenuMessage , icon: "pi-bell" });
        });
    }

    /***************** NOTIFICATION Module ******************** */
    activeItem!: number;
    notifications: NotifMembre[] = [];
    notificationCurrentPage: number = 0;
    notificationLoading: boolean = false;
    countUnreadedNotif: number = 0;
    isLastNotifPage: boolean = false;
    hasMoreThenOnePage: boolean = false;

    /***************** END NOTIFICATION Module ******************** */

    get mobileTopbarActive(): boolean {
        return this.layoutService.state.topbarMenuActive;
    }

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    onRightMenuButtonClick() {
        this.layoutService.openRightSidebar();
    }

    onMobileTopbarMenuButtonClick() {
        this.layoutService.onTopbarMenuToggle();
    }

    focusSearchInput(){
       setTimeout(() => {
         this.searchInput.nativeElement.focus()
       }, 0);
    }

    getNotifications(){
        this.notificationLoading = true;
        this.notificationService.getUserNotificaions(this.notificationCurrentPage).subscribe({
            next: (notificationsPage) => {
                this.notificationLoading = false;
                this.isLastNotifPage = notificationsPage.last;
                this.hasMoreThenOnePage = notificationsPage.totalPages > 1;
                this.notifications = this.notifications.concat(notificationsPage.content);
                this.countUnreadedNotif = this.notifications.filter((notif) => {return notif.dateLecture === null}).length
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Server error' });            }
        })
    }

    onNotificationScroll($event: any){
        if(!this.notificationLoading && !this.isLastNotifPage){
            if ($event.target.offsetHeight + $event.target.scrollTop >= $event.target.scrollHeight) {
                this.notificationCurrentPage++;
                this.getNotifications();
              }
        }
    }

    countUnreadedNotifAsString(){
        return this.countUnreadedNotif.toString();
    }

    hasSeenNotif(notification: NotifMembre){
        if(notification.dateLecture === null){
            notification.dateLecture = new Date();
            this.notificationService.hasreadNotification(notification.id).subscribe({
                next: (notification) => {
                    this.countUnreadedNotif = this.notifications.filter((notif) => {return notif.dateLecture === null}).length
                },
                error: (error) => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Server error' });            }
            });
        }

        this.router.navigateByUrl(notification.alerteNotif.action.link);
    }

    logout() {
      this.authService.logout(this.idUser).subscribe(
        {
          next : (data : any) => {
            this.eventBusService.setCurrentUser({});
            this.router.navigate(['/login']);
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Server error' });            }
        }
      )
    }
    renitPassword() {
      this.router.navigate(['/users/renitPassword']);
    }

    getAvatarMembreLabel(userName : string){

      let label = "";
      if(userName) {
        let nom = userName.split('.')[0] ;
        let prenom = userName.split('.')[1];
        if(nom && nom.length>0)
        {
          label = label + nom[0].toUpperCase();
        }
        if(prenom && prenom.length > 0){
          label = label + prenom[0].toUpperCase() ;
        }
      }


      return label;

    }
}
