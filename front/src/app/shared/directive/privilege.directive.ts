import { Subscription } from 'rxjs';
import { EventBusService } from 'src/app/shared/services/event-bus.service';
import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { C } from '@fullcalendar/core/internal-common';

@Directive({
  selector: '[accessControl]'
})
export class PrivilegeDirective implements OnInit{
  @Input("item") item !: any;
  @Input("elemPrivilege") elemPrivilege !: string[] ;
  @Input("displayType") displayType !: string ;
  userprivileges !: string[] ;
  subscription !: Subscription ;
  constructor(private el: ElementRef , private eventBusService : EventBusService) { }

  ngOnInit(): void {

    this.el.nativeElement.style.display = "none";
    this.checkAccess();
  }




  checkAccess() {
    this.subscription = this.eventBusService.getPrivileges().subscribe(
      {
        next : (data : string[])=> {
          this.userprivileges = data ;
          //S'il s'agit des privilèges
          if(this.item){
            //Si le item contient des privileges
            if(this.item.privileges){
              if(this.userprivileges.filter((element : string) => this.item.privileges.includes(element)).length>0){
                this.el.nativeElement.style.display = "block";
              }

            }
            //Sinon si aucun privilège n'est applique sur le item
            else{
              this.el.nativeElement.style.display = "block";
            }
          }
          else {
            //Si le item contient des privileges
            if(this.elemPrivilege){
              if(this.userprivileges.filter((element : string) => this.elemPrivilege.includes(element)).length>0){
                this.el.nativeElement.style.display = this.displayType ? this.displayType : "block";
              }

            }
            //Sinon si aucun privilège n'est applique sur le item
            else{
              this.el.nativeElement.style.display = this.displayType ? this.displayType : "block";
            }
          }

        }
      }
    )


  }

  /*ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }*/


}
