import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';

import { EventData } from '../shared/models/event';
import { EventBusService } from '../shared/services/event-bus.service';
import { Router } from '@angular/router';
import { LoginService } from '../modules/authentication/services/login.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor( private eventBusService: EventBusService , private router : Router , private authService : LoginService) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      withCredentials: true,
    });

    return next.handle(req).pipe(
      catchError((error) => {
        if (
          (error instanceof HttpErrorResponse &&
          !req.url.includes('auth/signin') &&
          error.status === 401)
        ) {
          this.eventBusService.emit(new EventData('logout', null));
        }
        else if(error instanceof HttpErrorResponse && error.status === 410) {
          this.router.navigate(["/dashboard/all"])
        }

        return throwError(() => error.error);
      })
    );
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
