import { EventBusService } from 'src/app/shared/services/event-bus.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of, firstValueFrom } from 'rxjs';
import { PermissionService } from '../modules/permissions/service/permission.service';
import { UserInfoResponse } from '../modules/authentication/model/login';
import { UserService } from '../modules/users/services/user.service';
import { ApiResponse } from '../shared/models/shared';
import { EventData } from '../shared/models/event';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthCanGuard  {
  currentUser !: UserInfoResponse ;
  constructor (private router : Router, private permissionService : PermissionService , private eventBusService : EventBusService , private userService : UserService ) {

  }
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<Observable<boolean> | Promise<boolean> | boolean>  {

      let currentUser = await firstValueFrom(this.userService.getCurrentUser()).catch((error : HttpErrorResponse)=>{
        if(error.status ===401) {
          this.eventBusService.emit(new EventData('logout', null));
        }

      });

      if(currentUser && !route.data['permissions']) {
        return true ;
      }
      else if(currentUser?.email) {
        await this.eventBusService.getPrivileges().subscribe(
          {
            next : (data :string[])=> {
              if (route.data['permissions'] && route.data['permissions'].filter((element : string) => data.includes(element)).length>0) {
                       return true;
                     }

              return false ;
            },
            error : (err : ApiResponse) => {

              return false;
            }
          }
        )
        return true ;
      }else {
        this.router.navigate(['/login']);
        return false ;
      }
  }

}
