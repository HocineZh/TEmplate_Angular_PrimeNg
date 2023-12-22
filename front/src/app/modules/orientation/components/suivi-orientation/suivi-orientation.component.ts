import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DocumentService } from 'src/app/modules/document/services/document.service';
import { OrientationService } from '../../services/orientation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Orientation } from '../../models/orientation';
import { ParametreService } from 'src/app/shared/services/parametre.service';
import { Etats } from 'src/app/shared/models/etats';
import { EvenementService } from 'src/app/modules/evenements/services/evenement.service';
import { OrientationStructureSuivi, SuiviOrientation } from '../../models/orientation-structure-suivi';
import { formatDate } from '@angular/common';
import { ApiResponse } from 'src/app/shared/models/shared';
import { Document } from 'src/app/modules/document/models/document';

@Component({
  selector: 'app-suivi-orientation',
  templateUrl: './suivi-orientation.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./suivi-orientation.component.scss']

})
export class SuiviOrientationComponent implements OnInit {

  oss_id !: number;
  oss: OrientationStructureSuivi = {};
  orientation?: Orientation = {};
  suiviOrientation: SuiviOrientation = {};
  etats: Etats[] = [];
  etat: Etats = {};
  //point: string = "";


  minDate !: Date;
  delai: Date = new Date();
  delai_p?: any;
  today = new Date();
  id_so!: number;
  taux_min: number = 0;

  uploadedFiles: any[] = [];

  documentsOrientation: Document[] = [];

  constructor(private orientationService: OrientationService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private evenementService: EvenementService, private documentService: DocumentService, private parametreService: ParametreService, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.oss_id = Number(params.get('id'));
      console.log("oss_id " + this.oss_id);
    });

    this.parametreService.getEtatsByType("orientation").subscribe((data: any) => {

      this.etats = data;
      this.etats = this.etats.filter(item => item.etat !== 'Crée');
      console.log("length " + this.etats.length);
    })

    this.orientationService.findLastSuivi(this.oss_id).subscribe((data: any) => {
      console.log(" data test");
      console.log(data);
      this.id_so = data[0][1];
      /*this.id_so = data.map((arrItem: any) => {
        return {
          id: arrItem[1]
        }
      });*/
      console.log("id_so " + this.id_so);
      this.orientationService.findSuiviOrientationById(this.id_so).subscribe((data: SuiviOrientation) => {
        this.suiviOrientation = data;
        this.oss = this.suiviOrientation.orientationStructureSuivi!;
        this.orientation = this.suiviOrientation.orientationStructureSuivi?.orientationByOrientationid;
        this.getDocs();
      });
    });


    //this.etat == this.suiviOrientation.etatsByEtatsid;
    //console.log("orientationSuivi etat def " + this.etat.etat);
    this.taux_min = Number(this.suiviOrientation.taux);
    if (this.suiviOrientation.delai !== null) {
      this.delai_p = formatDate(this.suiviOrientation.delai!, 'yyyy-MM-dd', 'en-us');
    } else {
      this.delai_p = null;
    }


    this.minDate = new Date(new Date().setDate(new Date().getDate()));


  }

  compareDates() {
    return this.orientation?.dateEcheance < this.today.setHours(0, 0, 0, 0);
  }

  checkSuiviOrientation() {
    this.suiviOrientation!.delai = formatDate(this.delai, 'yyyy-MM-dd', 'en-us');

    this.suiviOrientation.orientationStructureSuivi = this.oss;
    //this.suiviOrientation.etatsByEtatsid = this.etat;

    this.orientationService.saveSuiviOrientation(this.suiviOrientation, this.uploadedFiles).subscribe(
      {
        next: (data: ApiResponse) => {
          this.messageService.add({ severity: 'success', summary: 'Succés', detail: data.message });
        },
        error: (err: ApiResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
        }
      }
    );
  }

  onBack(): void {
    this.router.navigateByUrl('suiviOrientation/list');
  }
  setTaux() {
    this.suiviOrientation?.taux == 100;
  }


  onUploadFile(event: any) {
    for (const file of event.files) {
        this.uploadedFiles.push(file);
        console.log("uploadedFiles "+this.uploadedFiles.length);
    }

    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
  }

  onRemovedFile(event : any ) {
    //this.uploadedFilesMandat.push(file);
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

  getDocs() {
  this.orientationService.getDocumentsOrientation(this.orientation?.id!).subscribe((res: any) => {
    console.log("result doc ");
    console.log(res)
    this.documentsOrientation = res;
  });
}

}
