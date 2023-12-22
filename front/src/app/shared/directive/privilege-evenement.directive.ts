import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { sharedEvenementDataService } from '../../modules/evenements/services/sharedEvenementData.service';
import { EventBusService } from 'src/app/shared/services/event-bus.service';

@Directive({
  selector: '[accessEvmControl]'
})
export class PrivilegeEvenementDirective  implements OnInit {

  //@Input("item") item !: any;
  @Input("elemPrivilege") elemPrivilege !: string[] ;
  @Input ("elemRolePrivilege") elemRolePrivilege !:string[];
  @Input("displayType") displayType !: string ;
  evenementUserPrivileges !: string[] ;
  subscription !: Subscription ;
  constructor(private el: ElementRef , private sharedDataEvService : sharedEvenementDataService, private eventBusService : EventBusService) { }

  ngOnInit(): void {

    this.el.nativeElement.style.display = "none";
    this.checkAccess();
  }




  checkAccess() {
    this.subscription = this.sharedDataEvService.privilegesEvenement.subscribe(
      {
        next : (data : string[])=> {
          this.evenementUserPrivileges = data ;
          //S'il s'agit des privilèges
        /*   if(this.item){
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
          else { */
            //Si le item contient des privileges
            if(this.elemPrivilege && this.elemRolePrivilege){
              if(this.evenementUserPrivileges.filter((element : string) => this.elemPrivilege.includes(element)).length>0){
                this.el.nativeElement.style.display = this.displayType ? this.displayType : "block";
              }

              if(this.eventBusService.hasPrivilges(this.elemRolePrivilege)){
                this.el.nativeElement.style.display = this.displayType ? this.displayType : "block";
              }

            }else if(this.elemPrivilege){
              if(this.evenementUserPrivileges.filter((element : string) => this.elemPrivilege.includes(element)).length>0){
                this.el.nativeElement.style.display = this.displayType ? this.displayType : "block";
              }

            }
            //Sinon si aucun privilège n'est applique sur le item
            else{
              this.el.nativeElement.style.display = this.displayType ? this.displayType : "block";
            }




         // }

        }
      }
    )


  }

}
