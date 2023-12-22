import { Component, OnInit } from '@angular/core';
import {Notification} from 'src/app/modules/notification/model/notification.model';
import {NotificationService} from 'src/app/modules/notification/services/notification.service';
import {NotifMembre} from '../../model/notif-membre.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-important-notif-dialog',
  templateUrl: './important-notif-dialog.component.html',
  styleUrls: ['./important-notif-dialog.component.scss']
})
export class ImportantNotifDialogComponent implements OnInit{

  visible: boolean = false;
  notifications: NotifMembre[] = [];

  countUnreadedNotif: number = 0;

  constructor(private notificationService: NotificationService, private router: Router){}

  ngOnInit(): void {
    this.getImportantNotif();
  }

  hasSeenNotif(notification: NotifMembre){
    if(notification.dateLecture === null){
        notification.dateLecture = new Date();
        this.notificationService.hasreadNotification(notification.id).subscribe({
            next: (notification) => {
                this.countUnreadedNotif = this.notifications.filter((notif) => {return notif.dateLecture === null}).length
                console.log(notification);
            },
            error: (error) => {
                console.log(error);
            }
        });
    }
    this.router.navigate(['/evenements/edit/' + notification.alerteNotif.notifiable.id])
  }

  getImportantNotif(){
    this.notificationService.getImportantNotif().subscribe({
      next: (notifications) => {

        if(notifications && notifications.length > 0){
          this.notifications = notifications;
          this.visible = true;
        }
      },
      error: (err) => {

      }
    })
  }

}
