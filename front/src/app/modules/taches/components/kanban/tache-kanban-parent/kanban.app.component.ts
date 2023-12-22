import { ApiResponse } from 'src/app/shared/models/shared';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Etat, TachesCard, TacheReponse } from '../../../model/tache.model';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TacheKanbanService } from '../../../services/tache-kanban.service';
import { TacheService } from '../../../services/tache.service';
import { ActivatedRoute } from '@angular/router';



@Component({
    templateUrl: './kanban.app.component.html',
    styleUrls: ['./kanban.app.component.scss']
})
export class TacheKanbanAppComponent implements OnInit, OnDestroy {

    sidebarVisible: boolean = false;

    eventEnCoursId !: number;

    lists: Etat[] = [];

    listIds: string[] = [];

    subscription = new Subscription();

    style!: HTMLStyleElement;

    isMobileDevice: boolean = false;

    constructor(private route: ActivatedRoute, private tacheKanbanService: TacheKanbanService, private tacheService: TacheService, private messageService : MessageService) {

        this.route.params.subscribe(params => {
            this.eventEnCoursId = params['id'];
        })
        this.tacheKanbanService.setEventEncours(this.eventEnCoursId);

        /*this.subscription = this.tacheKanbanService.lists$.subscribe(reponse => {
            this.lists = reponse;
            console.log(reponse);
            this.listIds = this.lists.map((l : any) => l.listId || '');

        });*/
    }

     ngOnInit() {
        this.removeLayoutResponsive();
        this.tacheKanbanService.getEtatsTachesEvenement();
        this.getEtatsTachesEvenement();
        this.isMobileDevice = this.tacheKanbanService.isMobileDevice();
      }

    getEtatsTachesEvenement(){
      this.subscription = this.tacheKanbanService.getLists().subscribe({
          next : (reponse : Etat[]) => {
            this.lists=reponse;
          },
          error : (err : ApiResponse) => {
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
          }
      })
    }

    toggleSidebar() {
        this.sidebarVisible = true;
    }

    /*addList() {
        this.tacheKanbanService.addList();
    }

    dropList(event: CdkDragDrop<Etat[]>) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }*/

    removeLayoutResponsive() {
        this.style = document.createElement('style');
        this.style.innerHTML = `
                .layout-content {
                    width: 100%;
                }

                .layout-topbar {
                    width: 100%;
                }
            `;
        document.head.appendChild(this.style);
    }

    onChildRefresh(event: any) {
      this.tacheKanbanService.setEventEncours(this.eventEnCoursId);
      this.tacheKanbanService.getEtatsTachesEvenement();
      this.getEtatsTachesEvenement() ;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        document.head.removeChild(this.style)
    }
}
