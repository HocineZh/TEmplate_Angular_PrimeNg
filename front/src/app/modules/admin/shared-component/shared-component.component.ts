import { UserService } from './../../users/services/user.service';
import { UserInfoResponse } from './../../authentication/model/login';
import { PermissionService } from './../../permissions/service/permission.service';
import { ChangeDetectorRef, Component, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { Subscription, filter, first, firstValueFrom } from 'rxjs';
import { EventBusService } from 'src/app/shared/services/event-bus.service';

import { sharedEvenementDataService } from '../../evenements/services/sharedEvenementData.service';


import { AppSidebarComponent } from 'src/app/shared/template/components/app.sidebar.component';
import { AppTopbarComponent } from 'src/app/shared/template/components/app.topbar.component';
import { LayoutService } from 'src/app/shared/template/service/app.layout.service';
import { MenuService } from 'src/app/shared/template/service/app.menu.service';
import { LoginService } from '../../authentication/services/login.service';
import { formatDate } from '@angular/common';
import { ParametreService } from 'src/app/shared/services/parametre.service';
import { OrganeService } from '../../organes/services/organe.service';
import { Organe } from '../../organes/model/organe';
import { TypeOrganeService } from '../../type-organe/service/type-organe.service';
import { TypeOrgane } from '../../type-organe/model/type-organe';
import { MessageService } from 'primeng/api';



@Component({
  selector: 'app-shared-component',
  templateUrl: './shared-component.component.html',
  styleUrls: ['./shared-component.component.scss']
})
export class SharedComponentComponent {

  loadedsharedData : boolean = false;

  overlayMenuOpenSubscription: Subscription;

  topbarMenuOpenSubscription: Subscription;

  menuProfileOpenSubscription: Subscription;

  menuOutsideClickListener: any;

  menuScrollListener: any;

  topbarMenuOutsideClickListener: any;

  menuProfileOutsideClickListener: any;

  @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;

  @ViewChild(AppTopbarComponent) appTopbar!: AppTopbarComponent;

  /**************************Authentication variables ******************************************* */

  eventBusSub?: Subscription;
  currentUser !: UserInfoResponse ;
  /*************************************************************************************** */


  constructor(private menuService: MenuService, public layoutService: LayoutService, public renderer: Renderer2, public router: Router, private cd: ChangeDetectorRef,

    private userService: UserService, private authService: LoginService, private eventBusService: EventBusService , private permissionService : PermissionService,
    private typeOrganeService:TypeOrganeService, private organeService : OrganeService,
    private parametreService : ParametreService,private sharedDataEvService : sharedEvenementDataService , private messageService : MessageService) {



      console.log("shared");
      this.hideMenuProfile();

      this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
          this.hideTopbarMenu();

          if (!this.menuOutsideClickListener) {
              this.menuOutsideClickListener = this.renderer.listen('document', 'click', event => {
                  const isOutsideClicked = !(this.appSidebar.el.nativeElement.isSameNode(event.target) || this.appSidebar.el.nativeElement.contains(event.target)
                      || this.appTopbar.menuButton.nativeElement.isSameNode(event.target) || this.appTopbar.menuButton.nativeElement.contains(event.target));
                  if (isOutsideClicked) {
                      this.hideMenu();
                  }
              });
          }

          if ((this.layoutService.isHorizontal() || this.layoutService.isSlim()|| this.layoutService.isSlimPlus()) && !this.menuScrollListener) {
              this.menuScrollListener = this.renderer.listen(this.appSidebar.menuContainer.nativeElement, 'scroll', event => {
                  if (this.layoutService.isDesktop()) {
                      this.hideMenu();
                  }
              });
          }

          if (this.layoutService.state.staticMenuMobileActive) {
              this.blockBodyScroll();
          }
      });

      this.topbarMenuOpenSubscription = this.layoutService.topbarMenuOpen$.subscribe(() => {
          if (!this.topbarMenuOutsideClickListener) {
              this.topbarMenuOutsideClickListener = this.renderer.listen('document', 'click', event => {
                  const isOutsideClicked = !(this.appTopbar.el.nativeElement.isSameNode(event.target) || this.appTopbar.el.nativeElement.contains(event.target)
                      || this.appTopbar.mobileMenuButton.nativeElement.isSameNode(event.target) || this.appTopbar.mobileMenuButton.nativeElement.contains(event.target));
                  if (isOutsideClicked) {
                      this.hideTopbarMenu();
                  }
              });
          }

          if (this.layoutService.state.staticMenuMobileActive) {
              this.blockBodyScroll();
          }
      });

      this.menuProfileOpenSubscription = this.layoutService.menuProfileOpen$.subscribe(() => {
          this.hideMenu();

          if (!this.menuProfileOutsideClickListener) {
              this.menuProfileOutsideClickListener = this.renderer.listen('document', 'click', event => {
                  const isOutsideClicked = !(this.appSidebar.menuProfile.el.nativeElement.isSameNode(event.target) || this.appSidebar.menuProfile.el.nativeElement.contains(event.target));
                  if (isOutsideClicked) {
                      this.hideMenuProfile();
                  }
              });
          }
      });

      this.router.events.pipe(filter(event => event instanceof NavigationEnd))
          .subscribe(() => {
              this.hideMenu();
              this.hideTopbarMenu();
              this.hideMenuProfile();
          });
  }

  blockBodyScroll(): void {
      if (document.body.classList) {
          document.body.classList.add('blocked-scroll');
      }
      else {
          document.body.className += ' blocked-scroll';
      }
  }

  unblockBodyScroll(): void {
      if (document.body.classList) {
          document.body.classList.remove('blocked-scroll');
      }
      else {
          document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
              'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
      }
  }

  hideMenu() {
      this.layoutService.state.overlayMenuActive = false;
      this.layoutService.state.staticMenuMobileActive = false;
      this.layoutService.state.menuHoverActive = false;
      this.menuService.reset();

      if (this.menuOutsideClickListener) {
          this.menuOutsideClickListener();
          this.menuOutsideClickListener = null;
      }

      if (this.menuScrollListener) {
          this.menuScrollListener();
          this.menuScrollListener = null;
      }
      this.unblockBodyScroll();
  }

  hideTopbarMenu() {
      this.layoutService.state.topbarMenuActive = false;

      if (this.topbarMenuOutsideClickListener) {
          this.topbarMenuOutsideClickListener();
          this.topbarMenuOutsideClickListener = null;
      }
  }

  hideMenuProfile() {
      this.layoutService.state.menuProfileActive = false;

      if (this.menuProfileOutsideClickListener) {
          this.menuProfileOutsideClickListener();
          this.menuProfileOutsideClickListener = null;
      }
  }

  get containerClass() {
      let styleClass: {[key: string]: any} = {
          'layout-overlay': this.layoutService.config.menuMode === 'overlay',
          'layout-static': this.layoutService.config.menuMode === 'static',
          'layout-slim': this.layoutService.config.menuMode === 'slim',
          'layout-slim-plus': this.layoutService.config.menuMode === 'slim-plus',
          'layout-horizontal': this.layoutService.config.menuMode === 'horizontal',
          'layout-reveal': this.layoutService.config.menuMode === 'reveal',
          'layout-drawer': this.layoutService.config.menuMode === 'drawer',
          'p-input-filled': this.layoutService.config.inputStyle === 'filled',
          'p-ripple-disabled': !this.layoutService.config.ripple,
          'layout-static-inactive': this.layoutService.state.staticMenuDesktopInactive && this.layoutService.config.menuMode === 'static',
          'layout-overlay-active': this.layoutService.state.overlayMenuActive,
          'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
          'layout-topbar-menu-active': this.layoutService.state.topbarMenuActive,
          'layout-menu-profile-active': this.layoutService.state.menuProfileActive,
          'layout-sidebar-active': this.layoutService.state.sidebarActive,
          'layout-sidebar-anchored': this.layoutService.state.anchored
      };

      styleClass['layout-topbar-' + this.layoutService.config.topbarTheme] = true;
      styleClass['layout-menu-' + this.layoutService.config.menuTheme] = true;
      styleClass['layout-menu-profile-' + this.layoutService.config.menuProfilePosition] = true;
      return styleClass;
  }


  async ngOnInit(): Promise<void> {

    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
      this.eventBusService.setCurrentUser({});
    });

     //initialiser la date d'aujourd'hui --  to get from server
         //let today = formatDate(new Date(), 'yyyy-MM-dd', 'fr-FR');
         let today : any;
         //initialiser la date d'aujourd'hui --  to get from server
         this.parametreService.getToday().subscribe(
            {
                next : (data : any)=> {
                    today = formatDate(new Date(data), 'yyyy-MM-dd','fr-FR');
                    this.sharedDataEvService.loadTodayDate(today);
                },
                error : (err : any) =>{
                    ;
                    today = formatDate(new Date(), 'yyyy-MM-dd', 'fr-FR');
                    this.sharedDataEvService.loadTodayDate(today);
                    if(err.message){
                      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
                    }else{
                      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Un problème est servenu. Veuillez contacter l'administrateur" }) ;
                    }
                }
            }
         );

   this.userService.getCurrentUser().subscribe(
      {
        next : (data : UserInfoResponse) => {
          this.currentUser = data ;
          this.eventBusService.setCurrentUser(data);

          this.permissionService.getAllPermissionByLogin(this.currentUser.username!).subscribe(
            {
              next : (data : string[])=> {
               this.eventBusService.setPrirvileges(data) ;
               this.loadedsharedData = true;
              } ,error : (err : any) =>{
                if(err.message){
                  this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
                }else{
                  this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Un problème est servenu. Veuillez contacter l'administrateur" }) ;
                }
              }
            }
          )
        },
        error : (err)=> {
          this.currentUser = {};
          this.loadedsharedData = true;
          if(err.message){
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
          }else{
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Un problème est servenu. Veuillez contacter l'administrateur" }) ;
          }
        }
      }
    )
  }

  ngOnDestroy() {
      if (this.overlayMenuOpenSubscription) {
          this.overlayMenuOpenSubscription.unsubscribe();
      }

      if (this.menuOutsideClickListener) {
          this.menuOutsideClickListener();
      }
  }



  logout(): void {
    this.authService.logout(this.currentUser.id!).subscribe({
      next: res => {
        this.eventBusService.setCurrentUser({});
        this.router.navigate(['/login']);
      },
      error: err => {
        if(err.message){
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
        }else{
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Un problème est servenu. Veuillez contacter l'administrateur" }) ;
        }
      }
    });
  }



}
