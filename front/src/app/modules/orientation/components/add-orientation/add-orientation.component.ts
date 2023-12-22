import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Orientation } from '../../models/orientation';
import { Router } from '@angular/router';
import { Famille } from '../../models/famille';
import { Document } from '../../../document/models/document';
import { OrientationService } from '../../services/orientation.service';
import { Folder } from 'src/app/modules/dossier/model/folder';
import { DocumentService } from 'src/app/modules/document/services/document.service';
import { DossierService } from 'src/app/modules/dossier/services/dossier.service';
import { EvenementService } from 'src/app/modules/evenements/services/evenement.service';
import { Evenement, evenementFilters } from 'src/app/modules/evenements/models/evenement';
import { Societe, Structure } from 'src/app/modules/hierarchy/model/hierarchy';
import { ApiResponse } from 'src/app/shared/models/shared';
import { HierarchyService } from 'src/app/modules/hierarchy/services/hierarchy.service';
import { User } from 'src/app/modules/users/model/user';
import { UserService } from 'src/app/modules/users/services/user.service';
import { formatDate } from '@angular/common';
import { TypeOrgane } from 'src/app/modules/type-organe/model/type-organe';
import { Organe } from 'src/app/modules/organes/model/organe';
import { TypeOrganeService } from 'src/app/modules/type-organe/service/type-organe.service';
import { OrientationStructureSuivi } from '../../models/orientation-structure-suivi';
import { PointOrdreService } from 'src/app/modules/evenements/services/pointOrdre.service';
import { OrganeService } from 'src/app/modules/organes/services/organe.service';
import { pointOrdre } from 'src/app/modules/evenements/models/pointOrdre';


@Component({
  selector: 'app-add-orientation',
  templateUrl: './add-orientation.component.html',
  styleUrls: ['./add-orientation.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class AddOrientationComponent implements OnInit {
  orientation: Orientation = {};
  orientations: Orientation[] = [];
  orientationStructureSuivi: OrientationStructureSuivi = {};
  //orientationStructureSuivi: OrientationStructureSuiviRequest = {};
  document: Document = {};
  familles: Famille[] = [];
  documents: Document[] = [];
  structures !: Structure[];
  structure !: Structure;
  submittedStructure: boolean = false;
  societes !: Societe[];
  societe !: Societe;
  users: User[] = [];
  user: User = {};
  submitted: boolean = false;
  point: Object[] = [];
  designation: string = "";
  titreEvent: string = "";
  minDate !: Date;
  dateEch !: Date;
  evenementDialog: boolean = false;
  evenement: Evenement = {};
  evenements: Evenement[] = [];
  selectedPointOrdre!: pointOrdre;
  event: any = {};
  typesOrgane: TypeOrgane[] = [];
  typeOrgane: TypeOrgane = {};
  dateFrom !: string;
  organes: Organe[] = [];
  organe: Organe = {};
  selectedStructures: Structure[] = [];
  detail: string = "";

  //@Input() eventI :Evenement = {};

  constructor(private orientationService: OrientationService, private pointOdreService: PointOrdreService,
    private dossierService: DossierService, private evenementService: EvenementService, private hierarchyService: HierarchyService,
    private userService: UserService, private typeOrganeService: TypeOrganeService, private organeService: OrganeService,
    private router: Router, private messageService: MessageService, private confirmationService: ConfirmationService) { }


  ngOnInit(): void {

    this.openNew();
    this.organeService.getAllOrgane().subscribe((res: any) => {
      this.organes = res;
    });
    this.getAllUser();

    this.orientationService.findAllFamille("famille").subscribe((res: any) => {
      this.familles = res;
      console.log(this.familles.length)
    });

    this.minDate = new Date(new Date().setDate(new Date().getDate()));
    this.getAllStructure();


  }
  saveOrientation() {

    this.orientation.pointOrdreId = this.selectedPointOrdre;
    this.orientation.dateEcheance = formatDate(this.dateEch, 'yyyy-MM-dd', 'en-us');
    this.orientationStructureSuivi.orientationByOrientationid = this.orientation;
    this.orientationService.saveOSS(this.orientationStructureSuivi, this.uploadedFiles, this.evenement.id!).subscribe(
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

  getPointByDoc() {
    this.designation = this.document.dossier?.designation!;
    this.evenementService.GetListPointTraiteByDossier(this.document.dossier?.id).subscribe(data => {
      this.point = data[0][1];
    });
  }

  getStructuresSociete() {
    this.getAllStructureBySociete(this.societe.code!);
  }

  /*getEventBySocieteAndType() {
    this.dateFrom = formatDate(this.dateFrom, 'yyyy-MM-dd HH:mm:ss', 'en-us');
    this.evenementService.getAllByOrganeAndSociete(Number(this.typeOrgane.id), Number(this.societe.id), this.dateFrom).subscribe(data => {
      this.evenements = data;
    });
  }*/

  onSubmit() {
    this.saveOrientation();
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

  getAllStructure() {
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

  openNew() {
    //this.version = {};
    this.submitted = false;
    this.getAllTypesOrgane();
    this.evenementDialog = true;
  }

  getAllTypesOrgane() {
    this.typeOrganeService.getAllOrgane().subscribe(
      {
        next: (data: Organe[]) => {
          this.typesOrgane = data;
        }
      }
    )
  }

  hideDialog() {
    this.evenementDialog = false;
    this.submitted = false;
    this.onBack();
  }

  confirmDialog() {
    this.evenementDialog = false;
    this.evenementService.getEvenementById(this.evenement.id).subscribe(data => {
      this.event = data;
    });
    this.loadlistePointsOJEvenement();

    this.submitted = true;
    this.societe = {};
  }

  loadlistePointsOJEvenement() {

    this.pointOdreService.getListPointsOrdreEvenement(this.evenement.id).subscribe(
      (data) => {
        if (data) {
          this.evenement.listePointsOrdre = data;
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

  getEventByOrgane() {
    this.dateFrom = formatDate(this.dateFrom, 'yyyy-MM-dd HH:mm:ss', 'en-us');
    this.evenementService.getAllByOrganeAndSociete(Number(this.organe.id), Number(this.organe.societe!.id), this.dateFrom).subscribe(data => {
      this.evenements = data;
    });
  }

  onRowEditInit(product: Structure) {
    // this.selectedStructures[product.id as string] = { ...product };
  }

  onRowEditSave(det: string) {
    this.orientationStructureSuivi.detailOrientation = det;
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
    //
  }

  onRowEditCancel(product: Structure, index: number) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
  }
  uploadedFiles: any[] = [];
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




}
