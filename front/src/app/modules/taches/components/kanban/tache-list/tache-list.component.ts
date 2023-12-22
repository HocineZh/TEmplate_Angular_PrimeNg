import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit, Input, ElementRef, ViewChild, EventEmitter, Output, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Etat, TachesCard } from '../../../model/tache.model';
import { MenuItem, MessageService } from 'primeng/api';
import { TacheKanbanAppComponent } from '../tache-kanban-parent/kanban.app.component';
import { TacheKanbanService } from '../../../services/tache-kanban.service';
import { EventBusService } from 'src/app/shared/services/event-bus.service';
import { Card } from 'primeng/card';
import { TacheService } from '../../../services/tache.service';
import { ApiResponse } from 'src/app/shared/models/shared';


@Component({
    selector: 'app-tache-list',
    templateUrl: './tache-list.component.html',
    styleUrls: ['./tache-list.component.scss']
})
export class TacheListComponent implements OnInit {

    @Input() list!: Etat;

    @Input() listIds!: string[];

    @Output() refreshParent: EventEmitter<void> = new EventEmitter<void>();


    menuItems: MenuItem[] = [];

    title: string = '';

    timeout: any = null;

    isMobileDevice: boolean = false;

    @ViewChild('inputEl') inputEl!: ElementRef;

    @ViewChild('listEl') listEl!: ElementRef;

    constructor(public parent: TacheKanbanAppComponent, private kanbanService: TacheKanbanService, private eventBusService: EventBusService, private tacheService: TacheService, private messageService: MessageService) {

    }


    ngOnInit(): void {
        this.kanbanService.lists$.subscribe({
            next: (cardsResponse: Etat[]) => {
                this.list = cardsResponse.find((list) => { return list.listId === this.list.listId }) ?? this.list
            }
        })
        this.isMobileDevice = this.kanbanService.isMobileDevice();

        this.menuItems = [
            {
                label: 'List actions', items: [
                    /*{ separator: true },
                    { label: 'Copy list', command: () => this.onCopy(this.list) },
                    { label: 'Remove list', command: () =>  {
                        if (this.list.listId) {
                            this.onDelete(this.list.listId)
                        }
                    }},*/
                ]
            }
        ];
    }

    toggleSidebar() {
        this.parent.sidebarVisible = true;
    }

    /*onDelete(id: string) {
        this.kanbanService.deleteList(id);
    }

    onCopy(list: TacheList) {
        this.kanbanService.copyList(list);
    }*/

    onCardClick(event: Event, card: TachesCard) {


        if (this.eventBusService.hasPrivilges(['tache.update']) && this.list.listId != '11') {

            const eventTarget = event.target as HTMLElement;
            if (!(eventTarget.classList.contains('p-button-icon') || eventTarget.classList.contains('p-trigger'))) {
                if (this.list.listId) {
                    this.kanbanService.oncardseelect(card, this.list.listId);
                }
                this.parent.sidebarVisible = true;
            }
        }
    }

    insertCard(event: Event) {
        if (this.list.listId) {
            this.kanbanService.addCard(this.list.listId);
        }
        this.onCardClick(event, this.list.cardsResponse[this.list.cardsResponse.length-1]);
    }

    dropCard(event: CdkDragDrop<TachesCard[]>): void {

        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        }

    }

    onOrdreChange() {
        let ordre: number = 1;
        this.list.cardsResponse.forEach((card: TachesCard) => {
            card.ordre_execution = ordre;
            ordre++;
        });

        let c = this.list.cardsResponse
        this.tacheService.ordreChange(c).subscribe({
            next: (reponse: ApiResponse) => {
                this.messageService.add({ severity: 'success', summary: 'Confirmer', detail: reponse.message });
                this.triggerRefreshInParent();
            },
            error: (err: ApiResponse) => {
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
            }
        })
    }

    focus() {
        this.timeout = setTimeout(() => this.inputEl.nativeElement.focus(), 1);
    }

    insertHeight(event: any) {
        event.container.element.nativeElement.style.minHeight = '10rem';
    }

    removeHeight(event: any) {
        event.container.element.nativeElement.style.minHeight = '2rem';
    }

    triggerRefreshInParent() {

        this.refreshParent.emit();
    }

}
