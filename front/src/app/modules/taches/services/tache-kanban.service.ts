import { ApiResponse } from 'src/app/shared/models/shared';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Etat, TachesCard } from '../model/tache.model';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TacheService } from './tache.service';



@Injectable()
export class TacheKanbanService {

    private _lists: Etat[] = [];

    private selectedCard = new Subject<TachesCard>();

    private selectedListId = new Subject<string>();

    private lists = new BehaviorSubject<Etat[]>(this._lists);

    private listNames = new Subject<any[]>();

    lists$ = this.lists.asObservable();

    selectedCard$ = this.selectedCard.asObservable();

    selectedListId$ = this.selectedListId.asObservable();

    listNames$ = this.listNames.asObservable();

    idEventEnCours !: number;

    private selectedidEvent = new Subject<number>();
    selectedidEvent$ = this.selectedidEvent.asObservable() ;

    constructor(private tacheService: TacheService, private messageService : MessageService) {
        this.getEtatsTachesEvenement();
    }

    ngOnInit(){}

    public updateLists(data: any[]) {

        this._lists = data;

        let small = data.map(l => ({listId: l.listId, title: l.title}));

        this.listNames.next(small)
        this.lists.next(data);
    }


    getEtatsTachesEvenement(){
      console.log("test")
        this.selectedidEvent$.subscribe(
            {
                next : (data : number) => {
                    this.tacheService.getEtatsTachesEvenement(data).subscribe({
                        next : (reponse : any) => {

                            let liste: Etat[] = reponse.map((l: any, index: number) => ({
                                listId: l.listId,
                                titre: l.titre,
                                couleur: l.couleur,
                                first: index === 0,
                                cardsResponse: l.cardsResponse
                            }));


                              let sortedcardsResponse : TachesCard[]=liste[0].cardsResponse.sort((card1, card2) => {
                                if (card1.ordre_execution > card2.ordre_execution){ return 1}
                                if (card1.ordre_execution < card2.ordre_execution){ return -1}
                                return 0;
                              });
                              liste[0].cardsResponse=sortedcardsResponse;





                            this._lists= liste;
                            this.updateLists(liste);

                        },
                        error : (err : ApiResponse) => {
                            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
                        }
                    })
                }
            }
      )

    }

    setEventEncours(idEventEnCours : number){
        this.selectedidEvent.next(idEventEnCours);
    }
    /*addList() {
        const listId = this.generateId();
        const title = "Untitled List";
        const newList = {
            listId: listId,
            title: title,
            cardsResponse:[]
        };

        this._lists.push(newList);
        this.lists.next(this._lists);
    }*/

    addCard(listId: string) {
        const cardId = this.generateId();
        const titre = "Nouvelle tâche";

        const newCard = {id: cardId, titre: titre, nom: '', echeance: '', ordreExecution: this._lists[0].cardsResponse.length+1};
        let lists = [];


        lists = this._lists.map((l : any) => l.listId === listId ? ({...l, cardsResponse: [...l.cardsResponse || [], newCard]}) : l);
        //console.log(listId);

        this.updateLists(lists);
    }

    updateCard(card: TachesCard, listId: string) {
        let lists = this._lists.map(l => l.listId === listId ? ({...l, cardsResponse: l.cardsResponse.map(c => c.id === card.id ? {...card} : c)}) : l);
        this.updateLists(lists);
    }

    /*deleteList(id: string) {
        this._lists = this._lists.filter(l => l.listId !== id);
        this.lists.next(this._lists);
    }

    copyList(list: TacheList) {
        let newId = this.generateId();
        let newList = {...list, listId: newId};

        this._lists.push(newList);
        this.lists.next(this._lists);
    }*/

    deleteCard(cardId: string, listId: string) {
        let lists = [];
        //console.log(cardId + " "+listId);

        for (let i = 0; i < this._lists.length; i++) {
            let list = this._lists[i];

            if (list.listId === listId && list.cardsResponse) {
                list.cardsResponse = list.cardsResponse.filter((c : any) => c.id !== cardId);
            }

            lists.push(list);
        }

        this.updateLists(lists);
    }

    /*copyCard(card: TachesCard, listId: string) {
        let lists = [];

        for (let i = 0; i < this._lists.length; i++) {
            let list = this._lists[i];

            if (list.listId === listId && list.cardsResponse) {
                let cardIndex = list.cardsResponse.indexOf(card);
                let newId = this.generateId();
                let newCard = {...card, id: newId};
                list.cardsResponse.splice(cardIndex, 0, newCard);
            }

            lists.push(list);
        }

        this.updateLists(lists);
    }*/

    moveCard(card: TachesCard, targetListId: string, sourceListId: string) {
        console.log(card.id);

        if (card.id) {
            this.deleteCard(card.id, sourceListId);
            let lists = this._lists.map(l => l.listId === targetListId ? ({...l, cardsResponse: [...l.cardsResponse || [], card]}) : l);
            this.updateLists(lists);
        }
    }

    oncardseelect(card: TachesCard, listId: string) {
        this.selectedCard.next(card);
        this.selectedListId.next(listId);
    }

    generateId() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    isMobileDevice() {
        return (/iPad|iPhone|iPod/.test(navigator.userAgent)) || (/(android)/i.test(navigator.userAgent));
    }


    getLists () : Observable<Etat[]> {
      return this.lists$ ;
    }
}
