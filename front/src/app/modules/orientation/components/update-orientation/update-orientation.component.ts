import { Component, Input, OnInit } from '@angular/core';
import { Orientation } from '../../models/orientation';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OrientationService } from '../../services/orientation.service';
import { Famille } from '../../models/famille';
import { Document } from '../../../document/models/document';
import { DocumentService } from 'src/app/modules/document/services/document.service';
import { OrientationStructureSuivi, OrientationStructureSuiviU, SuiviOrientation } from '../../models/orientation-structure-suivi';
import { ApiResponse } from 'src/app/shared/models/shared';
import { Societe, Structure } from 'src/app/modules/hierarchy/model/hierarchy';
import { HierarchyService } from 'src/app/modules/hierarchy/services/hierarchy.service';
import { Evenement } from 'src/app/modules/evenements/models/evenement';
import { pointOrdre } from 'src/app/modules/evenements/models/pointOrdre';
import { PointOrdreService } from 'src/app/modules/evenements/services/pointOrdre.service';
import { User } from 'src/app/modules/users/model/user';
import { UserService } from 'src/app/modules/users/services/user.service';

@Component({
  selector: 'app-update-orientation',
  templateUrl: './update-orientation.component.html',
  providers: [MessageService, ConfirmationService],

})
export class UpdateOrientationComponent implements OnInit {
  orientation_id !: number;
  orientation: Orientation = {};
  famille: Famille = {};
  document: Document = {};
  familles: Famille[] = [];
  documents: Document[] = [];
  familleId: number = 0;
  docId: number = 0;
  oss_id !: number;
  oss: OrientationStructureSuiviU = {};
  structures !: Structure[];
  societes !: Societe[];
  suiviOrientation: SuiviOrientation = {};
  evenement: Evenement = {};
  evenements: Evenement[] = [];
  selectedPointOrdre!: pointOrdre;
  users: User[] = [];
  documentsOrientation: Document[] = [];
  @Input() ossId !: number;

  constructor(private orientationService: OrientationService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private router: Router, private hierarchyService: HierarchyService,
    private pointOdreService: PointOrdreService, private route: ActivatedRoute, private documentService: DocumentService, private userService: UserService) { }

  ngOnInit(): void {
    this.getAllStructure();
    this.getAllUser();
    console.log("this.orientation " + this.ossId)
   /* this.orientationService.getOrientationSSById(this.ossId).subscribe((data: any) => {
      this.oss = data;
      this.orientation = this.oss.orientationByOrientationid!;

    });*/
    this.orientationService.findLastSuivi(this.ossId).subscribe((data: any) => {
      console.log(" data test");
      console.log(data);
      //this.id_so = data[0][1];
      /*this.id_so = data.map((arrItem: any) => {
        return {
          id: arrItem[1]
        }
      });*/
      //console.log("id_so " + this.id_so);
      this.orientationService.findSuiviOrientationById(data[0][1]).subscribe((data: SuiviOrientation) => {
        this.suiviOrientation = data;
        this.oss = this.suiviOrientation.orientationStructureSuivi!;
        this.orientation = this.suiviOrientation.orientationStructureSuivi?.orientationByOrientationid!;
        this.getDocs();
      });
    });
    this.orientationService.findAllFamille("famille").subscribe((res: any) => {
      this.familles = res;

    });
    /*this.documentService.getFilesSortie("PV").subscribe((res1: any) => {
      this.documents = res1;
    });*/
  }

  updateorientation(): void {
    this.oss.orientationByOrientationid = this.orientation;
    this.orientationService.updateOrientation(this.oss)
      .subscribe({
        next: (data: ApiResponse) => {
          this.messageService.add({ severity: 'success', summary: 'Orientation modifiée avec succés', detail: data.message });
        },
        error: (err: ApiResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
        }
      }
      );
    //this.onBack();
  }

  onBack(): void {
    this.router.navigateByUrl('suiviOrientation/list');
  }



  getAllStructureBySociete(code: string) {
    this.hierarchyService.getAllStructureBySociete(code).subscribe(
      {
        next: (data: Structure[]) => {
          this.structures = data;
        },
        error: (err: ApiResponse) => {

        }
      }
    )
  }

  getAllSociete() {
    this.hierarchyService.getAllSociete().subscribe({
      next: (data: Societe[]) => {
        this.societes = data;
      },
      error: (data: ApiResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: data.message })
      }
    })
  }

  getAllStructure(){
    this.hierarchyService.getAllStructure().subscribe(
      {
        next: (data: Structure[]) => {
          this.structures = data;
        },
        error: (err: ApiResponse) => {

        }
      }
    )
  }

  loadlistePointsOJEvenement() {

    this.pointOdreService.getListPointsOrdreEvenement(this.evenement.id).subscribe(
      (data) => {
        if (data) {
          this.evenement.listePointsOrdre = data;
          console.log(data);
          console.log("this.evenement.listePointsOrdre " + this.evenement.listePointsOrdre);
        }
        else {
          ;
        }
      },
      (error) => {
        console.log(error);
      }
    )
  }

  getAllUser() {
    this.userService.getAlluser().subscribe(
      {
        next: (data: User[]) => {
          this.users = data;
        },
        error: (err: ApiResponse) => {
        }
      }
    )
  }

  getExtDoc(nomDoc: any) {
    var fileExt = nomDoc.split('.').pop();

    if (!fileExt || fileExt === '') {
      return 'default';
    } else {
      return fileExt.toLowerCase();
    }

  }

  downloadFile(doc: any) {
    this.documentService.downloadFile(doc.id!).subscribe(
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

  deleteFile(document: any, event: any) {
    console.log("deleteFile");
    this.confirmationService.confirm({
      message: "Etes vous sure de vouloire supprimer l'extrait du PV / Résolution ?",
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

  getDocs() {
  this.orientationService.getDocumentsOrientation(this.orientation?.id!).subscribe((res: any) => {
    console.log("result doc ");
    console.log(res)
    this.documentsOrientation = res;
  });
}

}
