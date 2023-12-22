import { Directive, HostListener } from '@angular/core';
import {SharedServiceService} from '../../../services/shared-service.service';

@Directive({
  selector: '[appKeyBoardShortKey]'
})
export class KeyBoardShortKeyDirective {

  constructor(private keyboardListner: SharedServiceService) { }

  newFolderModelOpened: boolean = false;

  @HostListener('window:keyup.shift.n', ['$event'])
  newFolderEventHabler($event: any){
    this.keyboardListner.keyboardEventListner$.next("new-folder")
  }

  @HostListener('window:keyup.shift.d', ['$event'])
  deleteEventHabler($event: any){
    this.keyboardListner.keyboardEventListner$.next("delete")
  }

  @HostListener('window:keyup.shift.g', ['$event'])
  grantPermissionEventHabler($event: any){
    this.keyboardListner.keyboardEventListner$.next("grant-permission")
  }

  @HostListener('window:keyup.shift.u', ['$event'])
  uploadEventHabler($event: any){
    this.keyboardListner.keyboardEventListner$.next("upload")
  }

  @HostListener('window:keyup.shift.r', ['$event'])
  renameEventHabler($event: any){
    this.keyboardListner.keyboardEventListner$.next("rename")
  }

  @HostListener('window:keyup.shift.f', ['$event'])
  searchEventHabler($event: any){
    this.keyboardListner.keyboardEventListner$.next("search")
  }

  @HostListener('window:keyup.shift.l', ['$event'])
  refreshEventHabler($event: any){
    this.keyboardListner.keyboardEventListner$.next("refresh")
  }


}
