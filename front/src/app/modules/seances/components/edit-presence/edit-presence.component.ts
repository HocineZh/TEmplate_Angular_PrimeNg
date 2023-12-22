import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SeanceService } from '../../services/seance.service';
import { MenuItem, MessageService } from 'primeng/api';
import { Evenement } from 'src/app/modules/evenements/models/evenement';
import { Table } from 'primeng/table';
import { JetonPresence, ListPresent } from '../../model/jeton-presence';
import { ApiResponse } from 'src/app/shared/models/shared';
import { Seance } from '../../model/seance';
import * as FileSaver from 'file-saver';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-edit-presence',
  templateUrl: './edit-presence.component.html',
  styleUrls: ['./edit-presence.component.scss'],
  providers: [MessageService]
})
export class EditPresenceComponent {

  @Input() evenement!: any;

  @ViewChild('filter') filter!: ElementRef;

  visible: boolean = true;

  @Input() seance!: Seance;

  loading: boolean = true;

  validatePresenceDialog: boolean = false;
  editableColumnDisabled: boolean = false;
  validateQuorumeDialog: boolean = false;

  selectedPresence: ListPresent[] = [];

  listCheckPresence!: JetonPresence[];
  listEditPresence!: JetonPresence[];

  listPresent!: any[];

  cols: any[] = [
    { field: 'nom_prenom', header: 'Nom et prénom' },
    { field: 'emargement', header: 'Emargement' },
  ]
  exportColumnsPresence: any[] = [];
  extractedDataPresence: any[] = [];
  extractedDataJeton: any[] = [];
  extractedDataQurom: any[] = [];
  colsQurom: any[] = [];
  exportColumnsQurom: any[] = [];

  quorumAtteint: number = 0;
  setQuorumAtteint :boolean =false;
  dateSeance!: string;
  titreOrgane!: string;

  constructor(private seanceService: SeanceService, private messageService: MessageService) {

  }

  ngOnInit(): void {

    this.titreOrgane = this.evenement.organe.titre;

    setTimeout(() => {
      this.loading = false;
    }, 200)




  }


  ngOnChanges() {

    this.dateSeance = formatDate(this.seance.dateDebut, 'yyyy-MM-dd', 'en-us');

    this.getListPresent();

    this.visible = true;
  }

  getListPresent() {

    this.seanceService.getPresentWithRemplacent(this.seance.id!).subscribe({
      next: (listeMembres: any[]) => {
        this.seanceService.getAllPresent(this.seance.id!).subscribe(
          {
            next: (data: JetonPresence[]) => {
              console.log(this.evenement);
              this.listPresent = listeMembres.map((membre: any) => {
                return {
                  somme: (data.find(present => present.convocation === membre.convocationId)?.somme) ? (data.find(present => present.convocation === membre.convocationId)?.somme) : null,
                  convocationId: membre.convocationId,
                  membreFonction: membre.fonction,
                  membreNom: membre.nomMembre,
                  profilNom: membre.profil,
                  remplacantNom: membre.nomRemplacent,
                  present: data.some(present => present.convocation === membre.convocationId),
                  jetonRemis: data.some(present => (present.convocation === membre.convocationId) && (present.somme! > 0))
                };
              });

              this.selectedPresence = this.listPresent.filter(presence => presence.present === true);

              this.listEditPresence = this.selectedPresence.map((membre: any) => {
                return {
                  somme: (membre.somme == null) ? 0 : membre.somme,
                  convocation: membre.convocationId,
                };
              });

              this.setQuorumAtteint = this.seance.validateQuorum!;

              if(this.seance.validateQuorum && this.seance.quorumAtteint)
                this.quorumAtteint = 1;
              else if(this.seance.validateQuorum && !this.seance.quorumAtteint)
                this.quorumAtteint = 0;

              else if(!this.seance.validateQuorum )
                  if( this.evenement.organe.typeOrgane.quorum > 0)
                    if (this.selectedPresence.length >= this.evenement.organe.typeOrgane.quorum)
                        this.quorumAtteint = 1;
                    else this.quorumAtteint = 0;
                  else this.quorumAtteint = 2;

              //this.quorumAtteint = (this.evenement.organe.typeOrgane.quorum > 0) ? (this.selectedPresence.length >= this.evenement.organe.typeOrgane.quorum) ? 1 : 0 : 2;

            }
          }
        )
      }
    })


  }

  editSomme(e: any) {
    if (e.checked == true) {
      this.editableColumnDisabled = false;
    }
    else {
      this.editableColumnDisabled = true;
    }
  }

  openConfirmQuorum() {
    this.validateQuorumeDialog = true;
  }

  confirmQuorum() {

    this.setQuorumAtteint = (this.quorumAtteint == 1) ? true : false;

    this.seanceService.setQuorum(this.seance.id!, this.setQuorumAtteint).subscribe(
      {
        next: (data: ApiResponse) => {
          this.visible = false;
          this.validateQuorumeDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: data.message });
        },
        error: (err: ApiResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
        }
      }
    )
  }

  onChangePresent(e: any) {
    e.data.present = (e.data.present == true) ? false : true;
    this.quorumAtteint = (!this.seance.validateQuorum)?(this.selectedPresence.length >= this.evenement.organe.typeOrgane.quorum) ? 1 : 0 : (this.seance.quorumAtteint) ?1:0;
  }

  setDialog() {
    this.visible = true;
  }

  hideDialog() {

    this.visible = false;

  }

  openConfirmPresence() {
    this.validatePresenceDialog = true;
  }


  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }


  validatePresence() {

    this.listCheckPresence = this.selectedPresence.map((membre: any) => {
      return {
        somme: (membre.jetonRemis == true) ? membre.somme : 0,
        convocation: membre.convocationId,
      };
    });

    if (
      this.listEditPresence.length === this.listCheckPresence.length && this.listEditPresence.every((element_1) => this.listCheckPresence.some((element_2) =>
        element_1.somme === element_2.somme &&
        element_1.convocation === element_2.convocation
      )
      )
    ) {
      this.validatePresenceDialog = false;
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Aucun changement n'a été détécté" });
    }


    else if (this.selectedPresence.some(present => (present.jetonRemis === true) && (present.somme == null))) {

      this.validatePresenceDialog = false;
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Veuillez remplir la somme " });

    }

    else {

      this.seanceService.AddPresence(this.listCheckPresence, this.seance.id!).subscribe(
        {
          next: (data: ApiResponse) => {
            this.visible = false;
            this.validatePresenceDialog = false;
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: data.message });
          },
          error: (err: ApiResponse) => {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message });
          }
        }
      )
    }

  }

  getAvatarMembreLabel(nom: any, prenom: any) {

    let label = "";
    if (nom && nom.length > 0) {
      label = label + nom[0];
    }
    if (prenom && prenom.length > 0) {
      label = label + prenom[0].toLowerCase();
    }
    return label;
  }

  exportPdfListMembres() {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then(() => {
        const doc = new jsPDF.default('p', 'px', 'a4');
        this.exportColumnsPresence = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
        this.extractedDataPresence = this.listPresent.map((membre: any) => {
          return {
            nom_prenom: membre.membreNom,
            emargement: "",
          };
        });

        // Function to add company header on each page
        const addCompanyHeader = () => {
          doc.setTextColor(0, 0, 255); // Red color
          const companyHeaderFontSize = 16;
          doc.setFontSize(companyHeaderFontSize);
          doc.setFont('helvetica', 'bold');

          //const companyHeaderText = this.entete;

          const companyHeaderText = "";
          const companyHeaderTextWidth = doc.getStringUnitWidth(companyHeaderText) * companyHeaderFontSize / doc.internal.scaleFactor;
          const companyHeaderTextX = (doc.internal.pageSize.width - companyHeaderTextWidth) / 2;

          doc.text(companyHeaderText, companyHeaderTextX, 20);
        };

        addCompanyHeader();

        // Reset font color and style
        doc.setTextColor(0, 0, 255); // Blue color for the monthly/quarterly/semi-annual report header
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        // Add monthly/quarterly/semi-annual report header
        const reportHeaderText = "Etat de suivi du quorum";
        const reportHeaderTextWidth = doc.getStringUnitWidth(reportHeaderText) * 14 / doc.internal.scaleFactor;
        const reportHeaderTextX = (doc.internal.pageSize.width - reportHeaderTextWidth) / 2;
        doc.text(reportHeaderText, reportHeaderTextX, 60);

        // Reset font color and style
        doc.setTextColor(0, 0, 0); // Reset to black
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');


        const organe = this.evenement.organe.typeOrgane.designation;
        doc.text(organe, reportHeaderTextX - 10, 100);

        const session = "Session du " + this.dateSeance;
        doc.text(session, reportHeaderTextX + 20, 120);

        // Create table for primeNg
        // const recapTableData = [this.exportColumns, extractedData];
        (doc as any).autoTable(this.exportColumnsPresence, this.extractedDataPresence, {
          startY: 150,
          didDrawCell: (data: any) => {

            // Add grid lines
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
          },
        });

        addCompanyHeader();

        // Save the document
        doc.save('feuille de présence.pdf');
      });
    });
  }


  exportPdfListRemiseJetons() {

    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then(() => {

        const organe = this.evenement.organe.typeOrgane.designation;
        const session = "Session du " + this.dateSeance;
        this.exportColumnsPresence = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
        this.extractedDataJeton = this.selectedPresence.map((membre: ListPresent) => {
          return {
            nom_prenom: membre.membreNom,
            emargement: (membre.jetonRemis == true) ? "Je soussigné, avoir reçu la somme en espèce de " + membre.somme + " Dinars, pour ma présence à la réunion du " + organe + " du " + session + "\r\n\r\n" + "Reçu séance tenante" + "\r\n" :
              "Je soussigné, avoir reçu la somme en espèce de " + 0 + "Dinars, pour ma présence à la réunion du " + organe + " du " + session + "\r\n\r\n" + "Reçu séance tenante" + "\r\n",
          };
        });
        const doc = new jsPDF.default('p', 'px', 'a4');

        // Function to add company header on each page
        const addCompanyHeader = () => {
          doc.setTextColor(0, 0, 255); // Red color
          const companyHeaderFontSize = 16;
          doc.setFontSize(companyHeaderFontSize);
          doc.setFont('helvetica', 'bold');

          //const companyHeaderText = this.entete;

          const companyHeaderText = "";
          const companyHeaderTextWidth = doc.getStringUnitWidth(companyHeaderText) * companyHeaderFontSize / doc.internal.scaleFactor;
          const companyHeaderTextX = (doc.internal.pageSize.width - companyHeaderTextWidth) / 2;

          doc.text(companyHeaderText, companyHeaderTextX, 20);
        };

        addCompanyHeader();

        // Reset font color and style
        doc.setTextColor(0, 0, 255); // Blue color for the monthly/quarterly/semi-annual report header
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        // Add monthly/quarterly/semi-annual report header
        const reportHeaderText = "Feuille d’émargement Jetons de présence";
        const reportHeaderTextWidth = doc.getStringUnitWidth(reportHeaderText) * 14 / doc.internal.scaleFactor;
        const reportHeaderTextX = (doc.internal.pageSize.width - reportHeaderTextWidth) / 2;
        doc.text(reportHeaderText, reportHeaderTextX, 60);

        // Reset font color and style
        doc.setTextColor(0, 0, 0); // Reset to black
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');



        doc.text(organe, reportHeaderTextX - 10, 100);

        doc.text(session, reportHeaderTextX + 20, 120);

        // 1.1. THEMES EXAMINES PAR REUNION DU CONSEIL D’ADMINISTRAT
        const themesText = 'Les Membres du Conseil d’Administration :';
        doc.setTextColor(0, 0, 255); // Blue color
        doc.text(themesText, 40, 180);

        // Create table for primeNg
        // const recapTableData = [this.exportColumns, extractedData];
        (doc as any).autoTable(this.exportColumnsPresence, this.extractedDataJeton, {
          startY: 150,
          didDrawCell: (data: any) => {
            // Add grid lines
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
          },
        });

        addCompanyHeader();

        // Save the document
        doc.save('Jeton présence.pdf');
      });
    });

  }

  exportPdfListMembresPresent() {

    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then(() => {

        const organe = this.evenement.organe.titre;
        const session = "Session du " + this.dateSeance;


        this.cols = [
          { field: 'nom_prenom', header: 'Nom et prénom' },
          { field: 'presence', header: 'Présence' },
          { field: 'nomRemplacant', header: 'A remplacer' },
        ]

        this.exportColumnsQurom = this.cols.map(col => ({ title: col.header, dataKey: col.field }));

        this.extractedDataQurom = this.listPresent.map((membre: ListPresent) => {
          return {
            nom_prenom: membre.membreNom,
            presence:(membre.present=== true)? "Présent":"Absent" ,
            nomRemplacant:membre.remplacantNom,
          };
        });


        const doc = new jsPDF.default('p', 'px', 'a4');

        // Function to add company header on each page
        const addCompanyHeader = () => {
          doc.setTextColor(0, 0, 255); // Red color
          const companyHeaderFontSize = 16;
          doc.setFontSize(companyHeaderFontSize);
          doc.setFont('helvetica', 'bold');

          //const companyHeaderText = this.entete;

          const companyHeaderText = "";
          const companyHeaderTextWidth = doc.getStringUnitWidth(companyHeaderText) * companyHeaderFontSize / doc.internal.scaleFactor;
          const companyHeaderTextX = (doc.internal.pageSize.width - companyHeaderTextWidth) / 2;

          doc.text(companyHeaderText, companyHeaderTextX, 20);
        };

        addCompanyHeader();

        // Reset font color and style
        doc.setTextColor(0, 0, 255); // Blue color for the monthly/quarterly/semi-annual report header
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        // Add monthly/quarterly/semi-annual report header
        const reportHeaderText = "Etat de suivi du quorum";
        const reportHeaderTextWidth = doc.getStringUnitWidth(reportHeaderText) * 14 / doc.internal.scaleFactor;
        const reportHeaderTextX = (doc.internal.pageSize.width - reportHeaderTextWidth) / 2;
        doc.text(reportHeaderText, reportHeaderTextX, 60);

        // Reset font color and style
        doc.setTextColor(0, 0, 0); // Reset to black
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');

        doc.text(organe, reportHeaderTextX - 10, 100);
        doc.text(session, reportHeaderTextX + 10, 120);

        // Create table for primeNg
        // const recapTableData = [this.exportColumns, extractedData];
        (doc as any).autoTable(this.exportColumnsQurom, this.extractedDataQurom, {
          startY: 150,
          didDrawCell: (data: any) => {
            // Add grid lines
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
          },
        });

        addCompanyHeader();

        const nbrPresence = "Nombre de présence :"+this.selectedPresence.length;
        // Reset font color and style
        doc.setTextColor(0, 0, 0); // Reset to black
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');

        doc.text(nbrPresence,  40, (doc as any).autoTable.previous.finalY + 20);

        addCompanyHeader();

        // Save the document
        doc.save('Qurom présence.pdf');
      });
    });

  }





}
