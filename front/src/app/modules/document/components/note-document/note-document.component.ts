import { Component, Input, OnInit } from '@angular/core';
import { UserInfoResponse } from 'src/app/modules/authentication/model/login';
import { Note } from '../../models/note';
import { NoteService } from '../../services/note.service';
import { ApiResponse } from 'src/app/shared/models/shared';
import { UserService } from 'src/app/modules/users/services/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DocumentService } from '../../services/document.service';
import { EvenementService } from 'src/app/modules/evenements/services/evenement.service';
import { sharedEvenementDataService } from 'src/app/modules/evenements/services/sharedEvenementData.service';

@Component({
  selector: 'app-note-document',
  templateUrl: './note-document.component.html',
  styleUrls: ['./note-document.component.scss']
})
export class NoteDocumentComponent implements OnInit {
  //comments: Note[] = [];
  comment: Note = {};
  currentUser!: UserInfoResponse;

  //editMode: boolean = false;
  text: string = '';
  textContent: string = '';
  clickedIndex?: number;

  @Input() documentId!: number;
  @Input() evenementId!: number;
  @Input() comments!: Note[];
  @Input() publie!: boolean;
  @Input() valide!: boolean;
  @Input() datePublished!: string;
  @Input() dateValidate!: string;
  @Input() delai!: number;


  constructor(private documentService: DocumentService, private messageService: MessageService, private confirmationService: ConfirmationService,
    private evenementService: EvenementService, private userService: UserService, public sharedDataEvService: sharedEvenementDataService,
    private noteService: NoteService) {
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getCurrentUser();
    //this.getAllNoteDocByEvent(this.documentId);
    console.log("note component " + this.comments.length);
  }

  sendMessage() {
    if (this.textContent == '' || this.textContent === ' ') {
      console.log("vide " + this.textContent);
      return;
    }
    else {

      this.comment = {
        contenu: this.textContent,
        owner: this.currentUser.username,
        ownerId: this.currentUser.id,
        createdAt: new Date(),
        docId: this.documentId,
      }

      this.noteService.save(this.evenementId!, this.comment).subscribe(
        {
          next: (data: ApiResponse) => {
            this.comments.push(this.comment);
            this.messageService.add({ severity: 'success', summary: 'Succés', detail: "data.message" });
          },
          error: (err: ApiResponse) => {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
          }
        }
      );
      this.comment.contenu = '';
    }
  }

  getCurrentUser() {
    this.userService.getCurrentUser().subscribe((data: any) => {


      this.currentUser = data;
      console.log("login " + this.currentUser.username);
    });
  }



  onRowEditInit(contenu: string, index: number) {
    this.clickedIndex = index;
    // event.target?.dispatchEvent
    console.log("index " + index)
    this.text = contenu;
    console.log("text init " + this.text);
    // this.selectedStructures[product.id as string] = { ...product };
  }

  onRowEditSave(note: Note, index: number) {
    this.comment.id = note.id;
    this.comment.contenu = this.text;
    console.log("text save" + this.text);
    this.noteService.editNote(this.comment).subscribe({
      next: (data: ApiResponse) => {
        this.clickedIndex = -1;
        this.comments.push(this.comment);
        this.messageService.add({ severity: 'success', summary: 'Succés', detail: "data.message" });
      },
      error: (err: ApiResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
      }
    });
  }

  onRowEditCancel(note: Note, index: number) {
    //this.comment.contenu =note.contenu;
    this.clickedIndex = -1;
    this.messageService.add({ severity: 'info', summary: 'Information', detail: 'Modification annuler' });
  }

  deleteComment(note: Note, index: number) {
    this.noteService.deleteNote(note.id!).subscribe({
      next: (data: ApiResponse) => {
        this.comments.filter(m => m.id !== note.id);
        this.messageService.add({ severity: 'success', summary: 'Succés', detail: "data.message" });
      },
      error: (err: ApiResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
      }
    });
  }

}
