import { ApiResponse } from 'src/app/shared/models/shared';
import { Component, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TacheKanbanService } from '../../../services/tache-kanban.service';
import { Etat, SubMenu, TachesCard } from '../../../model/tache.model';
import { TacheService } from '../../../services/tache.service';

import { MessageService } from 'primeng/api';
import { EventBusService } from 'src/app/shared/services/event-bus.service';

@Component({
    selector: 'app-tache-card',
    templateUrl: './tache-card.component.html'
})
export class TacheCardComponent implements OnDestroy {

    @Input() card!: TachesCard;

    @Input() listId!: string;

    @Output() refreshParent: EventEmitter<void> = new EventEmitter<void>();

    menuItems: MenuItem[] = [];

    subscription!: Subscription;


    constructor(private tacheKanbanService: TacheKanbanService, private tacheService: TacheService, private messageService : MessageService, private eventBusService: EventBusService) {
        this.getAllEtat();
    }

    getAllEtat(){
        this.subscription =this.tacheKanbanService.lists$.subscribe({
         next : (reponse : Etat[]) => {

              let subMenu : SubMenu[] = reponse.filter((d: Etat) => d.listId !== '11').map((d: any) => ({ id: d.listId, label: d.titre, command: () => this.onMove(d.listId) }));

              this.generateMenu(subMenu);
         },
         error : (err : ApiResponse) => {
             this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
         }
    })
    }

    parseDate(dueDate: string) {
        return new Date(dueDate).toDateString().split(' ').slice(1, 3).join(' ');
    }

    onDelete(id : string) {

        this.tacheService.deleteTacheReelle(id).subscribe({
            next : (reponse : ApiResponse) => {
              this.messageService.add({ severity: 'success', summary: 'Confirmer', detail: reponse.message });
              this.tacheKanbanService.deleteCard(this.card.id, this.listId);
            },
            error : (err : ApiResponse) => {
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
            }
        })
    }

    updateEtat(idEtat : number){

        let currentDate = new Date(), taux= (idEtat===8) ? 0 : this.card.taux as number;

        if(this.listId.toString() === idEtat.toString()){
            this.messageService.add({ severity: 'success', summary: 'Confirmer', detail: "La tâche est déjà dans cet état" });
        }
        else {

            this.tacheService.addSuiviTache(currentDate.toISOString(), taux, idEtat, this.card.id).subscribe({
                next : (reponse : ApiResponse) => {
                    this.messageService.add({ severity: 'success', summary: 'Confirmer', detail: reponse.message });
                    this.triggerRefreshInParent();
                },
                error : (err : ApiResponse) => {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
                }
            });
}

    }
    /*
    onCopy() {
        this.tacheKanbanService.copyCard(this.card, this.listId);
    }*/

    onMove(listId: string) {
        console.log(listId);

        this.tacheKanbanService.moveCard(this.card, listId, this.listId);
    }

    generateMenu(subMenu: SubMenu[]) {
        this.menuItems = [
            //{ label: 'Copy card', command: () => this.onCopy() },

          { label: 'Déplacer la tâche vers', items: subMenu.filter((d: any) => d.id !== 11).map(item => { return { label: item.label, command: () => this.updateEtat(item.id) }; }) },

          { label: 'Supprimer la tâche', command: () => this.onDelete(this.card.id) }
        ];

        if (!this.eventBusService.hasPrivilges(['tache.delete'])){
            this.menuItems=this.menuItems.filter( item => item.label !=='Supprimer la tâche' )}

    }

    /*generateTaskInfo() {
        let total = this.card.taskList.tasks.length;
        let completed = this.card.taskList.tasks.filter(t => t.completed).length;
        return `${completed} / ${total}`;
    }*/

    triggerRefreshInParent() {

        this.refreshParent.emit();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
