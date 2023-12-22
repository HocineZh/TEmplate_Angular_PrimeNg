import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DetailNote } from '../models/detailNote';
import { Note } from '../models/note';
import { ApiConstant } from 'src/app/shared/constant';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/modules/users/services/user.service';
import { User } from 'src/app/modules/users/model/user';
import { UserInfoResponse } from 'src/app/modules/authentication/model/login';
import { EventBusService } from 'src/app/shared/services/event-bus.service';
import { ApiResponse } from 'src/app/shared/models/shared';
//import { List } from 'pspdfkit';


@Injectable({
    providedIn: 'root'
})
export class NoteService {



    constructor(private http: HttpClient, private userService: UserService, private eventBusService:EventBusService) {





     }



    sendNote(idEvent:number,note: Note){
        //sauvegarder une note
        console.log("contenu "+note.contenu);
        console.log("awnerId "+note.owner);
        console.log("date "+note.createdAt);
        //note.docId == idDoc;
        this.save(idEvent,note).subscribe();
    }

    getAllMembersByEvent(idEvent: number, idDoc: number): Observable<any>{
        let httpparam = new HttpParams()
        .set("idEvent",idEvent)
        .set("idDoc",idDoc);
        return this.http.get<any>(environment.BASE_URL + ApiConstant.NOTE_PREFIX + 'getAllMembersByEvent',{params : httpparam})

      }

    public save( idEvent: number, note: Note): Observable<any> {
        console.log("contenu "+note.contenu);
        console.log("idEvent "+idEvent);

        console.log("createdAt "+note.createdAt);
        const formData: FormData = new FormData();
        formData.append('note', JSON.stringify(note));
        formData.append('idEvent', idEvent.toString());

        return this.http.post<Note>(environment.BASE_URL + ApiConstant.NOTE_PREFIX +"saveNote", formData);
      }

      getNoteMembreByDoc(idUser: number,idEvent: number, idDoc: number): Observable<Note[]>{
        let httpparam = new HttpParams()
        .set("idUser",idUser)
        .set("idEvent",idEvent)
        .set("idDoc",idDoc);
        //return this.http.get<Note[]>(`${environment.BASE_URL}${ApiConstant.NOTE_PREFIX}getNoteByMemberDoc/${idUser}/${idEvent}/${idDoc}`);
        return this.http.get<Note[]>(environment.BASE_URL + ApiConstant.NOTE_PREFIX + 'getNoteByMemberDoc',{params : httpparam})
      }

      getAllNoteByUserByEvent(idEvent: number, idDoc: number, idUser: number): Observable<any>{
        let httpparam = new HttpParams()
        .set("idEvent",idEvent)
        .set("idDoc",idDoc)
        .set("idUser",idUser);
        //return this.http.get<any>(`${environment.BASE_URL}${ApiConstant.NOTE_PREFIX}getAllMembersByEvent/${codeSo}/${codeSt}/${idEvent}/${idDoc}/${idUser}`);
        return this.http.get<Note>(environment.BASE_URL + ApiConstant.NOTE_PREFIX + 'getAllNoteByUserByEvent',{params : httpparam})
    }

    editNote (note:Note) : Observable<ApiResponse>{
        return this.http.put<ApiResponse>(environment.BASE_URL + ApiConstant.NOTE_PREFIX + "editNote",note);
      }

      deleteNote (idNote:number) : Observable<ApiResponse>{

        let params = new HttpParams().set("idNote",idNote);
        return this.http.delete<ApiResponse>(environment.BASE_URL + ApiConstant.NOTE_PREFIX + "deleteNote",{params : params});
      }
}
