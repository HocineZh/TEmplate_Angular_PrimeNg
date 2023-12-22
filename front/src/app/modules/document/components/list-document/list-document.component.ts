import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';

import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DocumentService } from '../../services/document.service';
import { Document, UtilisationUlt, UtilisationUltRequest } from '../../models/document';
import { Observable } from 'rxjs';
import { Famille } from 'src/app/modules/orientation/models/famille';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Version } from '../../models/version';
import { ApiResponse } from 'src/app/shared/models/shared';
import { Evenement } from 'src/app/modules/evenements/models/evenement';
import { Organe } from 'src/app/modules/organes/model/organe';
import { formatDate } from '@angular/common';
import { EvenementService } from 'src/app/modules/evenements/services/evenement.service';
import { OrganeService } from 'src/app/modules/organes/services/organe.service';
import { FileService } from 'src/app/shared/services/file.service';
import { Note } from '../../models/note';
import { UserInfoResponse } from 'src/app/modules/authentication/model/login';
import { UserService } from 'src/app/modules/users/services/user.service';
import { NoteService } from '../../services/note.service';
import { sharedEvenementDataService } from 'src/app/modules/evenements/services/sharedEvenementData.service';
import { MailContent } from '../../models/mail';
import { Router } from '@angular/router';
import { MembreService } from 'src/app/modules/membres/services/membre.service';
import { MembrePresent } from 'src/app/modules/membres/model/membre';


@Component({
  selector: 'app-list-document',
  templateUrl: './list-document.component.html',
  styleUrls: ['./list-document.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ListDocumentComponent implements OnInit {

  activeItem: MenuItem = {};

  items: MenuItem[];

  versions: Version[] = [];

  version!: Version;
  type: Famille = {};
  types: Famille[] = [];
  uploadedFiles: any[] = [];
  document: Document = {};
  selectedutil: UtilisationUlt[] = [];
  listUtilations: UtilisationUlt[] = [];

  evenements: Evenement[] = [];
  evenement: Evenement = {};
  organes: Organe[] = [];
  organe: Organe = {};
  minDate !: Date;
  values: any[] = [];

  documentsPVs: Document[] = [];
  comments: Note[] = [];
  membrePs: MembrePresent[] = [];
  mailDoc: MailContent = {};

  ecrasable: boolean = false;

  publie: boolean = false;
  valide: boolean = false;
  datePublished!: string;
  dateValidate!: string;
  delai?: number = 0;
  sendMail: boolean = false;
  @ViewChildren('buttonEl') buttonEl!: QueryList<ElementRef>;

  constructor(private documentService: DocumentService, private messageService: MessageService, private confirmationService: ConfirmationService,
    private evenementService: EvenementService, private organeService: OrganeService, public fileService: FileService, private userService: UserService,
    private noteService: NoteService, public sharedDataEvService: sharedEvenementDataService, public router: Router, private membreService: MembreService) {
    this.items = [
      {
        items: [

          {
            label: 'Voir les détails',
            icon: 'pi pi-fw pi-info-circle',
          },
          {
            label: 'Diffuser le document',
            icon: 'pi pi-fw pi-users', command: () => {
              this.diffuserDoc();
            }
          },

          {
            label: 'Gérer les autorisations',
            icon: 'pi pi-fw pi-users', command: () => {
              this.gererAutorisationDoc();
            }
          }
          /* {
               label: 'Gérer les autorisations',
               icon: 'pi pi-fw pi-external-link'
           }*/
        ]
      },
    ]



  }

  ngOnInit() {
    this.activeItem = this.items[0];
    this.organeService.getAllOrganesMembre('membre').subscribe((res: any) => {
      this.organes = res;
    });

    //this.getCurrentUser();


  }

  onActiveItemChange(event: MenuItem) {
    console.log(event);
    this.activeItem = event;
    if (this.activeItem) {
      //this.showCalendar = this.activeItem.label ==='Calendrier';
    }
  }


  onUploadFile(event: any) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
      console.log("uploadedFiles " + this.uploadedFiles.length);
    }

    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
  }

  onRemovedFile(event: any) {
    //this.uploadedFilesMandat.push(file);
  }



  onImageMouseOver(file: any) {
    this.buttonEl.toArray().forEach(el => {
      el.nativeElement.id === file.name ? el.nativeElement.style.display = 'flex' : null;
    })
  }

  onImageMouseLeave(file: any) {
    this.buttonEl.toArray().forEach(el => {
      el.nativeElement.id === file.name ? el.nativeElement.style.display = 'none' : null;
    })
  }

  removeImage(event: Event, file: any) {
    event.stopPropagation();
    this.uploadedFiles = this.uploadedFiles.filter(i => i !== file);
  }

  ChargerDoc() {
    this.documentService.upload(this.uploadedFiles, this.evenement.id!).subscribe(
      {
        next: (data: ApiResponse) => {
          //this.uploadedFiles = [];
          this.messageService.add({ severity: 'success', summary: 'Succés', detail: data.message });
        },
        error: (err: ApiResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
        }
      }
    );
  }


  ChargerVersion() {
    this.documentService.uploadNewVersion(this.uploadedFiles, this.evenement.id!, this.ecrasable).subscribe(
      {
        next: (data: ApiResponse) => {
          //this.uploadedFiles = [];
          this.messageService.add({ severity: 'success', summary: 'Succés', detail: data.message });
        },
        error: (err: ApiResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
        }
      }
    );
  }

  getEventByOrgane() {
    this.evenementService.findByOrganeAndPresence(Number(this.organe.id)).subscribe(data => {
      if (data !== null) {
        this.evenements = data;
        this.values = data;
        console.log("evenement " + this.evenements);
      } else {
        this.evenements = [];
        this.evenement = {};
        this.messageService.add({ severity: 'Info', summary: 'Information', detail: "Pas d'évenement en cette date" });
      }
    });

    this.documentService.listUtilisations(this.organe.typeOrgane?.id!, 8).subscribe((res: any) => {
      console.log("result utilisatin totoaaaaaaal ");
      console.log(res);
      this.listUtilations = res;
      this.selectedutil.forEach(u => {
        this.listUtilations == this.listUtilations.filter(utilisation => utilisation.titre !== u.titre)
        console.log(this.listUtilations);
      });
    });


  }

  deleteFile(document: any, event: any) {
    console.log("deleteFile");
    this.confirmationService.confirm({
      key: 'confirmRetirer',
      message: "Etes vous sure de vouloire supprimer le PV ?",
      header: 'Confirmation de suppression',
      target: event.target as EventTarget,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.documentService.deleteSelectedDoc(document.id).subscribe(
          {
            next: (data: ApiResponse) => {
              this.messageService.add({ severity: 'success', summary: 'Message', detail: data.message });
            },
            error: (err: ApiResponse) => {
              if (err.message) {
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
              } else {
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Un problème est servenu. Veuillez contacter l'administrateur" });
              }
            }
          }
        )

      },
      reject: () => {
      }
    })
  }

  supprimerSelectedDoc(document: any, event: any) {
    console.log("delete gere");
    //Confirmer le retirement du point ordre
    this.confirmationService.confirm({
      key: 'confirmRetirer',
      header: 'Confirmation du suppression!',
      target: event.target as EventTarget,
      message: "êtes-vous sûr de vouloir supprimer ce document?",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.documentService.deleteSelectedDoc(document.id).subscribe(
          (data: any) => {

            this.documentsPVs = data;
            this.messageService.add({ severity: 'success', summary: 'Message', detail: data.message });

          },
          (error: any) => {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Un problème est servenu. Veuillez contacter l'administrateur" });

          });

      },
      reject: () => {
        return;
      }

    });

  }

  //Télécharger un fichier existant
  downloadFile(doc: any) {
    this.documentService.downloadLastVersionFile(doc.id!).subscribe(
      {
        next: (data: Blob) => {
          let url = window.URL.createObjectURL(data);
          let a = document.createElement('a');
          a.download = doc.nom!;
          document.body.appendChild(a);
          a.href = url;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
        }
      }
    )
  }
  getPVs() {
    this.evenementService.getEvenementById(this.evenement.id).subscribe(
      (data) => {
        if (data) {
          this.evenement = data;
          //this.getDelaisValidationPV();
          this.delai === this.evenement.delaisEvenement.reponseValidationPV;
          console.log("this.evenement");
          console.log(this.evenement);
        }
        else {
          ;
        }
      },
      (error) => {
        console.log(error);
      }
    )
    this.documentService.getDocumentsPVsEvenement(this.evenement.id!).subscribe((res: any) => {

      this.documentsPVs = res;
      this.document = this.documentsPVs[res.length - 1];

      console.log("length " + this.document.version?.length);
      if (this.document.version && this.document.version?.length! > 0) {

        this.publie = this.document.version[this.document.version?.length - 1].ispublier!;
        this.valide = this.document.version[this.document.version?.length - 1].dateValidation !== null ? true : false;
        this.datePublished = formatDate(this.document.version[this.document.version?.length - 1].datePublication!, 'yyyy-MM-dd', 'en-us');
        this.dateValidate = formatDate(this.document.version[this.document.version?.length - 1].dateValidation!, 'yyyy-MM-dd', 'en-us');
        this.getAllNoteDocByEvent(this.document);
        this.getListSelectedUtil(this.document);
      }


    });


    this.loadlisteMembreEvenement();

    //this.getVersionsDoc();
  }

  getLastVersion() {
    this.documentService.getDocumentsPVsEvenement(this.evenement?.id!).subscribe((res: any) => {
    });
  }

  getListSelectedUtil(document: Document) {
    this.documentService.listSelectedUtilisations(document.id!).subscribe((res: any) => {
      console.log("docupent id "+document.id)
      console.log("result list utilisation ult");
      console.log(res);
      this.selectedutil = res;
    });
  }

  getExtDoc(nomDoc: any) {
    var fileExt = nomDoc.split('.').pop();

    if (!fileExt || fileExt === '') {
      return 'default';
    } else {
      return fileExt.toLowerCase();
    }

  }

  loadlisteMembreEvenement() {


    this.membreService.listMembrePresent(this.evenement.id!).subscribe({
      next: (data: any) => {
        console.log(" list membre present");
        console.log(data);
        this.membrePs = data.map((arrItem: any) => {
          return {

            userid: arrItem[0], profil_nom: arrItem[3],
            membre_id: arrItem[1], login:arrItem[2],
            date_reponse: arrItem[4], convocation_id: arrItem[5]
          }

        });
      }
    }
    );

  }


  getAllNoteDocByEvent(document: Document) {
    this.noteService.getAllMembersByEvent(this.evenement.id!, document.id!).subscribe((data: any) => {
      if (data !== null) {
        console.log("data note fdsfff ");
        console.log(data);
        //this.comments =  data;
        this.comments = data.map((arrItem: any) => {
          return {
            id: arrItem[0], contenu: arrItem[3],
            owner: arrItem[1],
            createdAt: arrItem[4], docId: arrItem[5]
          }

        });
      } else {
        this.comments = [];
        console.log("date vide");
      }
    });
  }
  /*
    editNote(note: Note) {
      this.editMode = true;
      this.comment.contenu = note.contenu;
    }

    onRowEditInit(contenu: string, index: number, event: Event) {
      event.target?.dispatchEvent
      console.log("index " + index)
      this.editMode = true;
      this.text = contenu;
      console.log("text init " + this.text);
      // this.selectedStructures[product.id as string] = { ...product };
    }

    onRowEditSave(note: Note, index: number) {
      this.editMode = false;
      this.comment.id = note.id;
      this.comment.contenu = this.text;
      console.log("text save" + this.text);
      this.noteService.editNote(this.comment).subscribe({
        next: (data: ApiResponse) => {
          this.comments.push(this.comment);
          this.messageService.add({ severity: 'success', summary: 'Succés', detail: "data.message" });
        },
        error: (err: ApiResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
        }
      });
    }

    onRowEditCancel(note: Note, index: number) {
      this.editMode = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
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
    }*/

  saveUtilisation() {
    let u: UtilisationUltRequest = {};
    u.idDoc = this.document.id;
    u.selectedutil = this.selectedutil;
    this.documentService.saveUtilisationUlt(u).subscribe({
      next: (data: ApiResponse) => {
        this.messageService.add({ severity: 'success', summary: 'Succés', detail: "data.message" });
      },
      error: (err: ApiResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
      }
    });
  }

  getVersionsDoc() {
    this.documentService.getListVersionDocByEvenement(this.evenement?.id!).subscribe((res: any) => {
      console.log("result version ");
      console.log(res)
      //this.documentsPVs = res;
      //this.document = this.documentsPVs[res.length-1];
      //this.getAllNoteDocByEvent(this.document);
      //this.getListSelectedUtil(this.document);

    });
    this.loadlisteMembreEvenement();

  }

  gererAutorisationDoc() {
    this.router.navigate(['/dossier)list/' + this.document.dossier!.id]);
  }

  diffuserDoc() {
    if (this.publie == false) {
      if (this.evenement.etat == 'TERMINER' || this.evenement.etat == 'CLOTURER') {
        this.documentService.publierDoc(this.document.id!).subscribe({
          next: (data: ApiResponse) => {
            this.messageService.add({ severity: 'success', summary: 'Succés', detail: data.message });
          },
          error: (err: ApiResponse) => {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
          }
        });
      } else {
        this.messageService.add({ severity: 'warning', summary: 'Info', detail: "L'évenement n'est pas encours terminer'" });
      }
    }
    else {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: "Le document est déjà diffuser aux membres" });
    }
  }

  validerDoc() {
    this.documentService.validerDoc(this.document.id!).subscribe({
      next: (data: ApiResponse) => {
        this.messageService.add({ severity: 'success', summary: 'Succés', detail: "data.message" });
      },
      error: (err: ApiResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
      }
    });
  }


  getDelaisValidationPV() {
    try {
      return this.delai = this.evenement.delaisEvenement.reponseValidationPV;

    }
    catch (ex) {
      return 0;
    }
  }

  sendMailPublicationDoc() {
    this.mailDoc.titre = "Disponibilite du document de la réunion";
    this.mailDoc.content = "Nous vous informons de la disponibilité du document du " + this.evenement.typeOrgane.titre +
      "tenu le : " + this.evenement.dateDebut + " à " + this.evenement.emplacement;
    this.mailDoc.selectedMembers = this.evenement.listeMembres;
    this.documentService.sendMail(this.mailDoc).subscribe({
      next: (data: ApiResponse) => {
        this.messageService.add({ severity: 'success', summary: 'Succés', detail: "data.message" });
      },
      error: (err: ApiResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
      }
    });
  }

  sendMailValidationDoc() {

  }

}
