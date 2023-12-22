import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { OrientationService } from '../../services/orientation.service';
import { Orientation } from '../../models/orientation';
import { Table } from 'primeng/table';
import { OrientationStructureSuivi, SuiviOrientationDetail } from '../../models/orientation-structure-suivi';
import { UserService } from 'src/app/modules/users/services/user.service';
import { UpdateOrientationComponent } from '../update-orientation/update-orientation.component';
import { Evenement } from 'src/app/modules/evenements/models/evenement';
import { Organe } from 'src/app/modules/organes/model/organe';
import { OrganeService } from 'src/app/modules/organes/services/organe.service';
import { formatDate } from '@angular/common';
import { EvenementService } from 'src/app/modules/evenements/services/evenement.service';
import { Legend } from '../generic-legend/generic-legend.component';

@Component({
  selector: 'app-list-orientation',
  templateUrl: './list-orientation.component.html',
  providers: [MessageService, ConfirmationService],
  styles: [],
  //Directives: [UpdateOrientationComponent]
})
export class ListOrientationComponent {
  deleteOrientationDialog: boolean = false;

  deleteOrientationsDialog: boolean = false;

  orientationStructure: OrientationStructureSuivi = {};

  selectedOrientations: OrientationStructureSuivi[] = [];

  orientationsStructures: OrientationStructureSuivi[] = [];

  suiviOrientationDetail: SuiviOrientationDetail[] = [];

  suiviOrientationDet: SuiviOrientationDetail = {};

  submitted: boolean = false;

  cols: any[] = [];

  display: boolean = false;

  rowsPerPageOptions = [5, 10, 20];
  @ViewChild('filter') filter!: ElementRef;

  oss: number = 0;
  Suivre: boolean = false;

  evenements: Evenement[] = [];
  evenement: Evenement = {};
  organes: Organe[] = [];
  organe: Organe = {};
  dateFrom !: string;
  minDate !: Date;
  items!: MenuItem[];

  title = 'Legend des états de lorienation';
  legends: Legend[] = [
    { name: 'Affectée', color: '#FFFFFF'},
    { name: 'En cours', color: '#fcf1c2' },
    { name: 'Réalisée', color: '#e0f7d7' },
    { name: 'Non réalisée', color: '#ffd6d6' },
    { name: 'Annulée', color: '#f2f2f2' }
  ];

  constructor(private orientationService: OrientationService, private messageService: MessageService, userService: UserService,
    private organeService: OrganeService, private router: Router, private evenementService: EvenementService) { }

  ngOnInit(): void {

    this.items = [
      {
        label: "Non Affectées", icon: 'pi pi-refresh', command: () => {
          this.selected("Crée");
        }
      },
      {
        label: 'En cours', icon: 'pi pi-cog', command: () => {
          this.selected("En cours");
        }
      },
      {
        label: 'Réalisées', icon: 'pi pi-info', style: 'color: green',command: () => {
          this.selected("Réalisée");
        }
      },
      {
        label: 'Non Réalisées', icon: 'pi pi-times', command: () => {
          this.selected('Non réalisée');
        }
      },
      {
        label: 'Annulées', icon: 'pi pi-times', command: () => {
          this.selected('Annulée');
        }
      }
    ];

    this.minDate = new Date(new Date().setDate(new Date().getDate()));
    this.organeService.getAllOrgane().subscribe((res: any) => {
      this.organes = res;
    });

this.getAllSuivi();
  }

  deleteOrientation(suiviOrientationDet: SuiviOrientationDetail) {
    if (suiviOrientationDet.etatsid == 'En cours' || suiviOrientationDet.etatsid == 'Réalisée') { this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de supprimer lorientation', life: 3000 }); }
    else {
      this.suiviOrientationDet = suiviOrientationDet;
      this.deleteOrientationDialog = true;
    }
  }

  toSuivi(suiviOrientationDet: SuiviOrientationDetail) {
    if (suiviOrientationDet.etatsid == 'Annulée' || suiviOrientationDet.etatsid == 'Réalisée') {
      this.messageService.add({
        severity: 'warn', summary: 'Alerte',
        detail: 'Lorientation ' + suiviOrientationDet.intitule + ' est déjà ' + suiviOrientationDet.etatsid, life: 3000
      });

    }
    else {
      this.router.navigate(['/suiviOrientation/suiviOrientation/' + suiviOrientationDet.id]);
    }
  }

  confirmDelete() {
    this.orientationService.deleteOrientation(this.suiviOrientationDet.id!).subscribe(res => {
      this.suiviOrientationDetail = this.suiviOrientationDetail.filter(item => item.id !== this.suiviOrientationDet.id);
      console.log('orientation deleted successfully!');
    })
    this.deleteOrientationDialog = false;
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'orientation supprimée', life: 3000 });

  }

  hideDialog() {
    this.submitted = false;
  }


  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  displayer(ossId: number) {
    this.display = true;
    this.oss = ossId;
    console.log("oss " + this.oss);
  }

  getEventByOrgane() {
    console.log("societe code " + this.organe.societe!.code);
    console.log("type organe" + this.organe.typeOrgane!.id);
    this.dateFrom = formatDate(this.dateFrom, 'yyyy-MM-dd HH:mm:ss', 'en-us');
    this.evenementService.getAllByOrganeAndSociete(Number(this.organe.id), Number(this.organe.societe!.id), this.dateFrom).subscribe(data => {
      this.evenements = data;
      console.log("evenement " + this.evenements.length);
    });
  }
  getSuiviByEvenement(evenementId: number) {
    this.orientationService.findLastSuiviByEvent(evenementId, 0).subscribe((res: any) => {
      console.log(res);
      this.suiviOrientationDetail = res.map((arrItem: any) => {
        return {
          id: arrItem[0], orientation_id: arrItem[1], intitule: arrItem[2],
          contenu: arrItem[3], type: arrItem[4], dateEcheance: arrItem[5], typeSuivi: arrItem[6], date: arrItem[7], etatsid: arrItem[8],
          delai: arrItem[9], taux: arrItem[10], motif: arrItem[11], structureid: arrItem[12], userid: arrItem[13], couleur: arrItem[14],
          pointordreid: arrItem[15], designation: arrItem[16], evenementid: arrItem[17], titre: arrItem[18]
        }
      });
      console.log("datadfgfgfg " + this.suiviOrientationDetail);
    });
  }

  save(severity: string) {
    this.getAllSuivi();
    this.messageService.add({ severity: severity, summary: 'Success', detail: 'Liste initialisée' });
  }

  selected(etat: string) {
    this.suiviOrientationDetail = this.suiviOrientationDetail.filter(item => item.etatsid == etat);
    console.log("this.suiviOrientationDetail.length " + this.suiviOrientationDetail.length);
    this.messageService.add({ severity: 'success', summary: 'Succés', detail: 'Liste affichée' });
  }

  getAllSuivi() {
    this.orientationService.findLastSuiviAll().subscribe((res: any) => {
      console.log(res);
      this.suiviOrientationDetail = res.map((arrItem: any) => {
        return {
          id: arrItem[0], orientation_id: arrItem[1], intitule: arrItem[2],
          contenu: arrItem[3], type: arrItem[4], dateEcheance: arrItem[5], typeSuivi: arrItem[6], date: arrItem[7], etatsid: arrItem[8],
          delai: arrItem[9], taux: arrItem[10], motif: arrItem[11], structureid: arrItem[12], userid: arrItem[13], couleur: arrItem[14],
          pointordreid: arrItem[15], designation: arrItem[16], evenementid: arrItem[17], titre: arrItem[18]
        }
      });
      console.log("datadfgfgfg " + this.suiviOrientationDetail);
    });
  }

}
