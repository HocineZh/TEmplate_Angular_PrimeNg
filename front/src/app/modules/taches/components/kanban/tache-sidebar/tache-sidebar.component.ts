import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from 'src/app/shared/models/shared';
import { Component, OnDestroy, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';
//import { Comment, ListName, Task } from 'src/app/demo/api/kanban';
import { FormBuilder, Validators } from '@angular/forms';
//import { Member } from 'src/app/demo/api/member';
//import { MemberService } from 'src/app/demo/service/member.service';
import { MenuItem } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { Etat, TachesCard } from '../../../model/tache.model';
import { TacheKanbanAppComponent } from '../tache-kanban-parent/kanban.app.component';
import { TacheKanbanService } from '../../../services/tache-kanban.service';
import { TacheService } from '../../../services/tache.service';
import { MessageService } from 'primeng/api';
import { EventBusService } from 'src/app/shared/services/event-bus.service';



@Component({
    selector: 'app-tache-sidebar',
    templateUrl: './tache-sidebar.component.html',
    styleUrls: ['./tache-sidebar.component.scss']
})
export class TacheSidebarComponent implements OnDestroy {

    @Output() refreshParent: EventEmitter<void> = new EventEmitter<void>();

    card: TachesCard = { id: '', nom: '', titre: '', echeance: '', ordre_execution: 0 };

    minDate: Date = new Date();

    formValue!: TachesCard;

    formSuivi = this.formBuilder.group({
        date: ['', Validators.required],
        taux: [0, Validators.required],
        etatsByEtatsid: [0, Validators.required]
    });

    listId: string = '';

    @Input() eventEnCoursId !: number;

    listEtats !: { id: number, label: string }[];

    saveSubmitted !: boolean;
    suiviSubmitted !: boolean;

    //filteredAssignees: Member[] = [];

    //assignees: Member[] = [];

    //newComment: Comment = { id: '123', name: 'Jane Cooper', text: '' };

    newTask /*Task*/ = { text: '', completed: false };

    //comment: string = '';

    taskContent: string = '';

    timeout: any = null;

    showTaskContainer: boolean = false;

    //menuItems: MenuItem[] = [];

    listNames: any[] = [];

    cardSubscription: Subscription;

    listSubscription: Subscription;

    listNameSubscription: Subscription;

    @ViewChild('inputTitle') inputTitle!: ElementRef;

    @ViewChild('inputTaskListTitle') inputTaskListTitle!: ElementRef;

    constructor(private route: ActivatedRoute, public parent: TacheKanbanAppComponent, /*private memberService: MemberService,*/ private tacheKanbanService: TacheKanbanService, private tacheService: TacheService, private messageService: MessageService, private formBuilder: FormBuilder, private eventBusService: EventBusService) {
        //this.memberService.getMembers().then(members => this.assignees = members);

        this.cardSubscription = this.tacheKanbanService.selectedCard$.subscribe((data: any) => {
            this.card = data;
            this.formValue = { ...data };
        });
        this.listSubscription = this.tacheKanbanService.selectedListId$.subscribe((data: any) => { this.listId = data; });
        this.listNameSubscription = this.tacheKanbanService.listNames$.subscribe((data: any) => { this.listNames = data; });
        this.getEtats();

    }

    ngOnInit(): void {
    }

    ngOnDestroy() {
        this.cardSubscription.unsubscribe();
        this.listSubscription.unsubscribe();
        this.listNameSubscription.unsubscribe();
        clearTimeout(this.timeout);
    }

    close() {
        this.parent.sidebarVisible = false;
        this.resetForm();
        this.saveSubmitted= false;
        this.suiviSubmitted= false;
        this.triggerRefreshInParent();
    }

    getEtats() {
        this.tacheService.geAllEtatsTaches().subscribe({
            next: (reponse: any) => {
                this.listEtats = reponse.filter((d: any) => d.id !== 11).map((d: any) => ({ id: d.id, label: d.etat }));

            },
            error: (err: ApiResponse) => {
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
            }
        })
    }
    /*filterAssignees(event: any) {
        let filtered: Member[] = [];
        let query = event.query;

        for (let i = 0; i < this.assignees.length; i++) {
            let assignee = this.assignees[i];
            if (assignee.name && assignee.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(assignee);
            }
        }

        this.filteredAssignees = filtered;
    }

    onComment(event: Event) {
        event.preventDefault();
        if (this.comment.trim().length > 0) {
            this.newComment = { ...this.newComment, text: this.comment }
            this.formValue?.comments?.unshift(this.newComment);
            this.comment = '';
        }
    }*/

    onSave(event: any) {
        this.saveSubmitted = true;

        if (this.formValue.titre === "Nouvelle tâche") {

            if (this.formValue.nom && this.formValue.echeance) {

                event.preventDefault();
                this.tacheService.createTacheReel(this.formValue.nom, this.formValue.echeance, this.eventEnCoursId, this.formValue.ordre_execution).subscribe({
                    next: (reponse: ApiResponse) => {
                        this.messageService.add({ severity: 'success', summary: 'Confirmer', detail: reponse.message });
                        this.close();
                        this.triggerRefreshInParent();
                        this.saveSubmitted = false
                    },
                    error: (err: ApiResponse) => {
                        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
                        this.saveSubmitted = false
                    }
                })
            }
            this.formSuivi = this.formBuilder.group({
                date: ['', Validators.required],
                taux: [0, Validators.required],
                etatsByEtatsid: [0, Validators.required]
            });
        }
        else {
            if (this.formValue.nom && this.formValue.echeance) {
                if(this.formValue.nom === this.card.nom && this.formValue.echeance === this.card.echeance){
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Aucune modification n'a été effectuée." });
                }
                else{
                this.tacheService.updateTacheReelle(this.formValue.id, this.formValue.nom, this.formValue.echeance).subscribe({
                    next: (reponse: ApiResponse) => {
                        this.messageService.add({ severity: 'success', summary: 'Confirmer', detail: reponse.message });
                        this.close();
                        this.triggerRefreshInParent();
                        this.resetForm();
                        this.saveSubmitted = false
                    },
                    error: (err: ApiResponse) => {
                        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
                        this.saveSubmitted = false
                    }
                })}
            }
        }

    }

    saveSuivi() {
        this.suiviSubmitted = true;
        if (this.formSuivi.get('date')?.value && this.formSuivi.get('etatsByEtatsid')?.value) {
            this.tacheService.addSuiviTache(this.formSuivi.get('date')?.value as string, this.formSuivi.get('taux')?.value as number, this.formSuivi.get('etatsByEtatsid')?.value as number, this.formValue.id).subscribe({
                next: (reponse: ApiResponse) => {
                    this.messageService.add({ severity: 'success', summary: 'Confirmer', detail: reponse.message });
                    this.formSuivi = this.formBuilder.group({
                        date: ['', Validators.required],
                        taux: [0, Validators.required],
                        etatsByEtatsid: [0, Validators.required]
                    });
                    this.close();
                    this.triggerRefreshInParent();
                    this.suiviSubmitted = false;
                },
                error: (err: ApiResponse) => {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
                    this.suiviSubmitted = false;
                }
            });
        }

    }

    onMove(listId: string) {
        this.tacheKanbanService.moveCard(this.formValue, listId, this.listId);
    }

    onDelete() {
        this.tacheKanbanService.deleteCard(this.formValue?.id || '', this.listId);
        this.parent.sidebarVisible = false;
        this.resetForm();
    }

    resetForm() {
        this.formValue = { id: '', nom: '', titre: '', echeance: '', ordre_execution: 0 };
    }

    /*addTaskList() {
        this.showTaskContainer = !this.showTaskContainer;

        if (!this.showTaskContainer) {
            return;
        }
        else if (!this.formValue.taskList) {
            let id = this.tacheKanbanService.generateId();
            this.formValue = { ...this.formValue, taskList: { id: id, title: 'Untitled Task List', tasks: []  } };
        }
    }*/

    addTask(event: Event) {
        event.preventDefault();
        if (this.taskContent.trim().length > 0) {
            this.newTask = { text: this.taskContent, completed: false };
            //this.formValue.listeTaches?.tasks.unshift(this.newTask);
            this.taskContent = '';
            //this.calculateProgress();
        }
    }

    focus(arg: number) {
        if (arg == 1) {
            this.timeout = setTimeout(() => this.inputTitle.nativeElement.focus(), 1);
        }
        if (arg == 2) {
            this.timeout = setTimeout(() => this.inputTaskListTitle.nativeElement.focus(), 1);
        }
    }

    /*calculateProgress() {
        if(this.formValue.listeTaches.tasks) {
            let completed = this.formValue.listeTaches.tasks.filter((t : any) => t.completed).length;
            this.formValue.progress = Math.round(100 * (completed / this.formValue.listeTaches.tasks.length));
        }
    }*/

    triggerRefreshInParent() {
        this.refreshParent.emit();
    }


}
