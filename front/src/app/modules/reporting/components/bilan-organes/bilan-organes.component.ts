import { DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild, Renderer2   } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EvenementService } from 'src/app/modules/evenements/services/evenement.service';
import { sharedEvenementDataService } from 'src/app/modules/evenements/services/sharedEvenementData.service';
import { HierarchyService } from 'src/app/modules/hierarchy/services/hierarchy.service';
import { EventBusService } from 'src/app/shared/services/event-bus.service';
import { Societe, Structure } from 'src/app/modules/hierarchy/model/hierarchy';
import { FormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';

import { OrientationService } from 'src/app/modules/orientation/services/orientation.service';
import { MembreService } from 'src/app/modules/membres/services/membre.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { typeAccessOrgane } from 'src/app/modules/evenements/models/evenement';







@Component({
  selector: 'app-bilan-organes',
  templateUrl: './bilan-organes.component.html',
  styleUrls: ['./bilan-organes.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class BilanOrganesComponent {


  selected_typeBilan: any = null;
  selected_year: Date = new Date();
  selected_semester: string = '';
  selected_trimester: string = '';
  selected_month: Date = new Date();

  // Evenement filterscls
  evenementFilters:any = {
    societeid:  0,
    type_organeid :0,
    organeid : 0,
    dateFrom : '',
    dateTo : '',
    type_evenementid : 0,
    etat_evenement : null,  // 'completer' => evenement terminier // null => all
    isPrevisionnel : 'false',
    isRemunerer : "",
    isPeriodique : "",
    keyword : '',
    typeAcces : ''

  }



  //Shared Data
  today: string = '';
  societes : any[] = [];
  structures: any[] = [];
  userSocieteId : number = 0;
  type_organes : any[] = [];
  type_evenements : any[] =[];

  //Selected Data by user
  selected_typeorgane : any = null;
  selected_organe : any;
  selected_societe: any = null;
  selected_typeEvenement : any;
  // selected_typeBilan :any;
  selectedDateFrom : any;
  selectedDateTo : any;


  //Résultat chargement évènement
  events : any[] = [];
  totalRecords: number = 0;
  resolution : any[] = [];
  membreNumber: number = 0;


  pdfGenerating = false;
  isExportContentVisible: boolean = false;


  sociteName: string = '';
  idStructure: number = 0;

  abreviation: string= '';
  abreviationInbilan: string= '';
  durantLe: string = '';

  fillerVar: boolean= false;


  fff: String = formatDate(this.selected_year, 'yyyy-MM-dd 00:00:00', 'en-us');
  // @ViewChild('exportContent', { static: false }) exportContent!: ElementRef;
  // @ViewChild('htmlData') htmlData!: ElementRef;


  // var in bilan
  entete: string= '';
  bilanTitre: string= '';


  cols!: any[];
  exportColumns!:  any[];

  cols2!: any[];
  exportColumns2!:  any[];

  cols3!: any[];
  exportColumns3!:  any[];



  extractedData: any[] = [];
  extractedData2: any[] = [];
  extractedData3: any[] = [];


   data = [
  {
    A: 'aaaa',
    B: 'bbbb',
    C: ['cccc1', 'cccc2', 'ccccc3'],
    D: ['ddddd1', 'dddddd2', 'ddddd3']
  },
    {
    A: 'aaaa444',
    B: 'bbbb',
    C: ['cccc1', 'cccc2', 'ccccc3'],
    D: ['ddddd1', 'dddddd2', 'ddddd3']
  }
]





  constructor( private evenementService: EvenementService, private sharedDataEvService : sharedEvenementDataService, private hierarchyService : HierarchyService,private eventBusService : EventBusService, private messageService: MessageService, private confirmationService : ConfirmationService,private router: Router,private location: Location,private orientationService: OrientationService, private membreService : MembreService , private renderer: Renderer2) {
  }


  ngOnInit(){

    if(this.eventBusService.hasPrivilges(['evenement.list']))
    {
      //Accés a tous les évènements (tous les sociétés ou seulement sa société)
      this.evenementFilters.typeAcces = 'all';

    }else if(this.eventBusService.hasPrivilges(['evenement.listOwn'])){
      //Accès à ses propres événements
      this.evenementFilters.typeAcces = 'own';

    }else{
        // pas d'accéss
        this.location.back();
   }

   let typeDataUser : typeAccessOrgane = this.evenementFilters.typeAcces ==='all' ? 'allSocietes' : 'membre';
   this.sharedDataEvService.loadSharedDataEvenement(typeDataUser);
   //Initiliser shared data type_organes et types_évènements
   this.hierarchyService.getAllSociete().subscribe((data:Societe[]) => { this.societes = data; });
   // this.hierarchyService.getAllStructure().subscribe((data:Structure[]) => { this.structures = data; })
   this.hierarchyService.getAllStructure().subscribe((data: Structure[]) => {
    // Add a new property 'customLabel' to each structure
    this.structures = data.map((structure) => ({
      ...structure,
      customLabel: `${structure.code}: ${structure.societe!.code}`,
    }));
  });
   this.sharedDataEvService.typesOrganes.subscribe(data => { this.type_organes = data;  });
   this.sharedDataEvService.typesEvenement.subscribe(data => {this.type_evenements= data;  });
   this.sharedDataEvService.today.subscribe(data => {this.today = data;     });








  }






  colsColumn () {
      this.cols = [
          { field: 'NumSession', header: 'N° de session du ' + ' ' + this.abreviationInbilan },
          { field: 'DateRenion', header: 'Date de la réunion du ' + ' ' + this.abreviationInbilan },
          { field: 'PointsOrderJ', header: 'Points à l’ordre du jour' },

        ];
      this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));

      this.cols2 = [
          { field: 'NumSession', header: 'N° de session du ' + '' + this.abreviationInbilan },
          { field: 'DateRenion', header: 'Date de la réunion du ' + ' ' + this.abreviationInbilan },
          { field: 'nbrRes', header: 'Nombre de résolutions émises' },
           { field: 'nbrMembre', header: 'Nombre de membre' }

      ];
     this.exportColumns2 = this.cols2.map((col) => ({ title: col.header, dataKey: col.field }));

     this.cols3 = [
          { field: 'NumSession', header: 'Session' },
          { field: 'DateRenion', header: 'Date' },
          { field: 'refRes', header: 'Réf. résolution' },
          { field: 'ObjRes', header: 'Objet des résolutions prises' },

      ];
    this.exportColumns3 = this.cols3.map((col) => ({ title: col.header, dataKey: col.field }));
  }


  durant(){
    if(this.selected_typeBilan === "Annuel"){
      this.durantLe =  formatDate(this.selected_year, 'yyyy', 'en-us');
    }
    else if(this.selected_typeBilan === "Mensuel"){
      this.durantLe =  formatDate(this.selected_month, 'MM/yyyy', 'en-us');
    }
    else if(this.selected_typeBilan === "Trimestriel"){
      this.durantLe =  this.selected_trimester + " " +  formatDate(this.selected_year, 'yyyy', 'en-us');
    }
    else if(this.selected_typeBilan === "Semestriel"){
      this.durantLe =  this.selected_semester + " " + formatDate(this.selected_year, 'yyyy', 'en-us');
    }
  }


  onFilter2(events: any[]){
       this.resolution = [];
      this.extractedData = [];
      this.extractedData2 = [];
      this.extractedData3 = [];


    events.map((item)=>{
       this.orientationService.findLastSuiviByEvent(item.id, this.idStructure).subscribe(
        (data: any) => {

          // this.resolution.push(...data.map((arrItem: any) => {
          //     return {
          //       id: arrItem[0], orientation_id: arrItem[1], intitule: arrItem[2],
          //       contenu: arrItem[3], type: arrItem[4], dateEcheance: arrItem[5], typeSuivi: arrItem[6], date: arrItem[7], etatsid: arrItem[8],
          //       delai: arrItem[9], taux: arrItem[10], motif: arrItem[11], structureid: arrItem[12], userid: arrItem[13], couleur: arrItem[14],
          //       pointordreid: arrItem[15], designation: arrItem[16], evenementid: arrItem[17], titre: arrItem[18]
          //     }
          // }));

          this.resolution.push(...data);




          this.extractedData.push({

                              NumSession: item.numero,
                              DateRenion: item.dateDebut ,
                              PointsOrderJ: item.listePointsOrdre ? item.listePointsOrdre.map((val: { designation: any; }) => `- ${val.designation}`).join('\n') : "",


                });

            this.membreService.getAllMembresByEvent(item.id).subscribe(
            data => {
                  this.extractedData2.push(
                      {
                                NumSession: item.numero,
                                DateRenion: item.dateDebut ,
                                nbrRes: this.countItemsByEventId(this.resolution, item.id),
                                nbrMembre: data.length
                            }
                  );
             },
            (error) => {
                this.showErrorToast("Erreur", error.message);
             }
             );


              const refResSplit = this.getDateRefById(this.resolution, item.id);
              const objResSplit = this.getResolutionById(this.resolution, item.id);
              this.extractedData3 = refResSplit.map((refRes: any, index: any) => ({
                    NumSession: item.numero,
                    DateRenion: item.dateDebut,
                    refRes,
                    ObjRes: objResSplit[index],
                }));




          // this.extractedData3 = this.events.flatMap((event) => {
          //         const refResSplit = this.getDateRefById(this.resolution, event.id);
          //         const objResSplit = this.getResolutionById(this.resolution, event.id);

          //       const rowData = [];

          //       // Create a row for 'Session' and 'Date'
          //       rowData.push({
          //         NumSession: event.numero,
          //         DateRenion: event.dateDebut,
          //         refRes: refResSplit[0], // Use the first value for 'Réf. résolution'
          //         ObjRes: objResSplit[0], // Use the first value for 'Objet des résolutions prises'
          //       });

          //       // Create three rows for 'Réf. résolution' and 'Objet des résolutions prises'
          //       for (let i = 1; i < refResSplit.length; i++) {
          //         rowData.push({
          //           NumSession: '', // Empty for 'Session'
          //           DateRenion: '', // Empty for 'Date'
          //           refRes: refResSplit[i], // Use the remaining values for 'Réf. résolution'
          //           ObjRes: objResSplit[i], // Use the remaining values for 'Objet des résolutions prises'
          //         });
          //       }

          //       return rowData;
          // });



                          //   const refResSplit = this.getDateRefById(this.resolution, item.id);
                          //  const objResSplit = this.getResolutionById(this.resolution, item.id);
                          //     console.log('rrrrrrr', item);
                          //   const maxArrayLength = Math.max(refResSplit.length, objResSplit.length);
                          //  console.log('macccc', maxArrayLength);
                          //   // Create rows dynamically based on the maximum array length
                          //   for (let i = 0; i < maxArrayLength; i++) {
                          //     if (i === 0) {
                          //       // For the first row, include A and B with rowSpan
                          //       this.extractedData3.push([
                          //         { content: item.numero, rowSpan: maxArrayLength, styles: { halign: 'center', valign: 'middle'} },
                          //         { content: item.dateDebut, rowSpan: maxArrayLength, styles: { halign: 'center', valign: 'middle' } },
                          //         refResSplit[i],
                          //         objResSplit[i],
                          //       ]);
                          //     } else {
                          //       // For subsequent rows, only include C and D
                          //       this.extractedData3.push([objResSplit[i], objResSplit[i]]);
                          //     }
                          //   }



        },
        (error) => {
          this.showErrorToast("Erreur", error.message);
        }

        )
    });


     let exportContentElement: HTMLElement | null = document.getElementById('exportContent');
            // Make the element visible by setting display to "block"
            if (exportContentElement) {
                exportContentElement.style.display = 'block';
                this.entete = this.sociteName;
                this.bilanTitre = this.selected_typeBilan;
                this.isExportContentVisible = true;
                this.abreviationInbilan = this.abreviation;
                this.colsColumn();

            }


  this.fillerVar = false;




  }

  onFilter (){

      this.fillerVar = true;
      this.events = [];
      this.resolution = [];
      this.extractedData = [];
      this.extractedData2 = [];
      this.extractedData3 = [];


      this.evenementService.getEvenements(this.evenementFilters, []).subscribe(
      (data) => {
          if(data){
            this.events = data.list;
            this.totalRecords = data.total;


                this.durant();
                this.onFilter2(this.events);

          }
          else{
            this.showErrorToast("Erreur", "Une erreur inattendue s'est produite!");

          }
      },
      (error) => {

          //Erreur lors du chargement des évènements
          this.events= [];
          this.totalRecords = 0;
          console.log(error);
          this.showErrorToast("Erreur", error.message);
        }
      );






  }





  // Traitement des services messages

showErrorToast(summary:string, detail:string){

  this.showMessageToast('error', summary, detail);

}
showSuccessToast(summary:string, detail:string){

  this.showMessageToast('success', summary, detail);

}
showMessageToast(severity:string, summary:string, detail:string ){

  this.messageService.add({ key: 'tst', severity: severity , summary: summary , detail: detail });

}

onSelectedTypeBilanChange(bilan: string){

  if(bilan === 'Annuel'){
      this.evenementFilters.dateFrom = formatDate(new Date(), 'yyyy-01-01 00:00:00', 'en-us');
      this.evenementFilters.dateTo = formatDate(new Date(), 'yyyy-12-31 00:00:00', 'en-us');
  }
  else if(bilan === 'Semestriel'){
      this.evenementFilters.dateFrom = formatDate(new Date(), 'yyyy-01-01 00:00:00', 'en-us');
      this.evenementFilters.dateTo = formatDate(new Date(), 'yyyy-06-31 00:00:00', 'en-us');
  }
  else if(bilan === 'Trimestriel'){
      this.evenementFilters.dateFrom = formatDate(new Date(), 'yyyy-01-01 00:00:00', 'en-us');
      this.evenementFilters.dateTo = formatDate(new Date(), 'yyyy-04-30 00:00:00', 'en-us');
  }
  else if(bilan === 'Mensuel'){
     const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
     const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

     this.evenementFilters.dateFrom =  formatDate(startOfMonth, 'yyyy-MM-dd 00:00:00', 'en-us');
     this.evenementFilters.dateTo =   formatDate(endOfMonth, 'yyyy-MM-dd 00:00:00', 'en-us');
  }

}

onSelectedYearChange(newYear: Date) {
  // console.log('eeesss', newYear);
  this.evenementFilters.dateFrom = formatDate(newYear, 'yyyy-MM-dd 00:00:00', 'en-us');
  this.evenementFilters.dateTo = formatDate(newYear, 'yyyy-12-31 00:00:00', 'en-us');
}

 formatDate(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day} 00:00:00`;
}

onSelectMonthChange(newMonth: any){
  const startOfMonth = new Date(newMonth.getFullYear(), newMonth.getMonth(), 1);
  const endOfMonth = new Date(newMonth.getFullYear(), newMonth.getMonth() + 1, 0);

   this.evenementFilters.dateFrom =  formatDate(startOfMonth, 'yyyy-MM-dd 00:00:00', 'en-us');
  this.evenementFilters.dateTo =   formatDate(endOfMonth, 'yyyy-MM-dd 00:00:00', 'en-us');

   // console.log("eeee", this.formatDate(startOfMonth));
}

onSelectedYearSemestreChange(newYear: Date){
   if(this.selected_semester === '1st Trimester'){
        this.evenementFilters.dateFrom =  formatDate(newYear, 'yyyy-01-01 00:00:00', 'en-us');
        this.evenementFilters.dateTo =   formatDate(newYear, 'yyyy-06-30 00:00:00', 'en-us');
   } else if(this.selected_semester === '2nd Trimester'){
        this.evenementFilters.dateFrom =  formatDate(newYear, 'yyyy-07-01 00:00:00', 'en-us');
        this.evenementFilters.dateTo =   formatDate(newYear, 'yyyy-12-31 00:00:00', 'en-us');
   }
}

onSelectedNumSemestre(numSem: any){
  // console.log('eeeeee', numSem);

  if(numSem === '1st Semester'){
        this.evenementFilters.dateFrom =  formatDate(this.selected_year, 'yyyy-01-01 00:00:00', 'en-us');
        this.evenementFilters.dateTo =   formatDate(this.selected_year, 'yyyy-06-30 00:00:00', 'en-us');
  }else if(numSem === '2nd Semester'){
        this.evenementFilters.dateFrom =  formatDate(this.selected_year, 'yyyy-07-01 00:00:00', 'en-us');
        this.evenementFilters.dateTo =   formatDate(this.selected_year, 'yyyy-12-31 00:00:00', 'en-us');
  }
}

onSelectedNumTrimester(numtri: any){
  // console.log('vvv', numtri);
   if(numtri === '1st Trimester'){
        this.evenementFilters.dateFrom =  formatDate(this.selected_year, 'yyyy-01-01 00:00:00', 'en-us');
        this.evenementFilters.dateTo =   formatDate(this.selected_year, 'yyyy-04-30 00:00:00', 'en-us');
  }else if(numtri === '2nd Trimester'){
        this.evenementFilters.dateFrom =  formatDate(this.selected_year, 'yyyy-05-01 00:00:00', 'en-us');
        this.evenementFilters.dateTo =   formatDate(this.selected_year, 'yyyy-08-31 00:00:00', 'en-us');
  } else if(numtri === '3rd Trimester'){
        this.evenementFilters.dateFrom =  formatDate(this.selected_year, 'yyyy-09-01 00:00:00', 'en-us');
        this.evenementFilters.dateTo =   formatDate(this.selected_year, 'yyyy-12-30 00:00:00', 'en-us');
  }
}


onSelectedYearTrimesterChange(newYear: Date){
    if(this.selected_trimester === '1st Trimester'){
        this.evenementFilters.dateFrom =  formatDate(this.selected_year, 'yyyy-01-01 00:00:00', 'en-us');
        this.evenementFilters.dateTo =   formatDate(this.selected_year, 'yyyy-04-30 00:00:00', 'en-us');
    }else if(this.selected_trimester === '2nd Trimester'){
        this.evenementFilters.dateFrom =  formatDate(this.selected_year, 'yyyy-05-01 00:00:00', 'en-us');
        this.evenementFilters.dateTo =   formatDate(this.selected_year, 'yyyy-08-31 00:00:00', 'en-us');
    } else if(this.selected_trimester === '3rd Trimester'){
        this.evenementFilters.dateFrom =  formatDate(this.selected_year, 'yyyy-09-01 00:00:00', 'en-us');
        this.evenementFilters.dateTo =   formatDate(this.selected_year, 'yyyy-12-30 00:00:00', 'en-us');
    }
}

onSocieteChange(event: any) {
  // this.exportPdf2();
  // console.log('socccc', this.selected_societe);
   if(event == null){
    this.evenementFilters.societeid = 0;
    this.sociteName = '';
  }
  else{
     this.evenementFilters.societeid = event.societe.id;
     this.sociteName = event.societe.raisonSocial;
     this.idStructure = event.id;
  }



}

onTypeOrganeChange(event: any){

  // console.log('typppp', event);
  if(event == null){
    this.evenementFilters.type_organeid = 0 ;
    this.abreviation = ''
  }
  else{
     this.evenementFilters.type_organeid = event.id;
     this.abreviation= event.abreviation;
  }

}

onOrganeDeGestionChange(event: any){
  // console.log('gesssss', event);
  if(event == null){
    this.evenementFilters.organeid = 0;
  }
  else{
     this.evenementFilters.organeid = event.id;
  }
}



countItemsByEventId(allResolutions: any[], id: any): number {
   const filteredResolutions = allResolutions.filter((resolution) => resolution[17] === id);
  return filteredResolutions.length;
}




itemsByEventId(allResolutions: any[], id: number) {
  return allResolutions.find(item => item[17] === id);
}

getResolutionById(allResolutions: any[], id: number): string[] {
    // Filter the list to find items where the ID matches
    const matchingItems = allResolutions.filter(item => item[17] === id);
    // Extract values at index 2 for the matching items
    return matchingItems.map(item => item[2]);
  }

  getDateRefById(allResolutions: any[], id: number): string[] {
    // Filter the list to find items where the ID matches
    const matchingItems = allResolutions.filter(item => item[17] === id);
    // Extract values at index 2 for the matching items
    return matchingItems.map(item => formatDate(item[7], 'yyyy-MM-dd HH:mm:ss', 'en-us'));
  }


exportPdf() {
  import('jspdf').then((jsPDF) => {
    import('jspdf-autotable').then(( { default: autoTable }) => {
      const doc = new jsPDF.default('p', 'px', 'a4');

       // Function to add company header on each page
      const addCompanyHeader = () => {
        doc.setTextColor(0, 0, 255); // Red color
        const companyHeaderFontSize = 16;
        doc.setFontSize(companyHeaderFontSize);
        doc.setFont('helvetica', 'bold');

        const companyHeaderText = this.entete;
        const companyHeaderTextWidth = doc.getStringUnitWidth(companyHeaderText) * companyHeaderFontSize / doc.internal.scaleFactor;
        const companyHeaderTextX = (doc.internal.pageSize.width - companyHeaderTextWidth) / 2;
        doc.text(companyHeaderText, companyHeaderTextX, 20);

      };

      addCompanyHeader();


      // Reset font color and style
      doc.setTextColor(0, 0, 255); // Blue color for the monthly/quarterly/semi-annual report header
      doc.setFontSize(14);
      doc.setFont('helvetica', 'italic');
      // Add monthly/quarterly/semi-annual report header
      const reportHeaderText = 'Bilan ' + '' + this.bilanTitre + ' des organes de gestion de la Société';
      const reportHeaderTextWidth = doc.getStringUnitWidth(reportHeaderText) * 14 / doc.internal.scaleFactor;
      const reportHeaderTextX = (doc.internal.pageSize.width - reportHeaderTextWidth) / 2;
      doc.text(reportHeaderText, reportHeaderTextX, 60);

      // Reset font color and style
      doc.setTextColor(0, 0, 0); // Reset to black
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      // 1. BILAN DU CONSEIL D’ADMINISTRATION OU CONSEIL DE GESTION
      const boardMeetingText = '1. Bilan de ' + ' ' + this.abreviationInbilan;
      doc.text(boardMeetingText, 20, 80);

      const durant = 'Durant le ' + ' ' + this.durantLe + ' , le ' + ' ' + this.abreviationInbilan + ' de ' + this.entete + ' a tenu ' + this.totalRecords + ' réunion(s).'
      doc.text(durant, 20, 100);

      // 1.1. THEMES EXAMINES PAR REUNION DU CONSEIL D’ADMINISTRAT
      const themesText = '1.1. THEMES EXAMINES PAR REUNION DU ' + ' ' + this.abreviationInbilan;
      doc.setTextColor(0, 0, 255); // Blue color
      doc.text(themesText, 40, 140);

      // Create table for primeNg
      // const recapTableData = [this.exportColumns, extractedData];


      autoTable(doc, { columns: this.exportColumns, body: this.extractedData, ...{
        startY: 150,
        didDrawCell: (data: any) => {
          // Add grid lines
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
        },
      } } );


      const resolutionsText = '1.1.1. ETAT RECAPITULATIF';
      doc.text(resolutionsText, 40, (doc as any).autoTable.previous.finalY + 20);

      // Create table for primeNg
      // const resolutionsTableData = [['Resolution ID', 'Description'], [1, 'Resolution 1'], [2, 'Resolution 2']];
       autoTable(doc, { columns: this.exportColumns2, body: this.extractedData2 , ...{
         startY: (doc as any).autoTable.previous.finalY + 30,
        didDrawCell: (data: any) => {
          // Add grid lines
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
        },
      } } );

      // 2. YOUR_NEXT_TABLE_NAME
      const table2Text = '1.2. ETAT DETAILLE DES RESOLUTIONS ';
      doc.text(table2Text, 40, (doc as any).autoTable.previous.finalY + 20);

      // Create table for primeNg (example data)
      // const table2Data = [['N° de session du CA / CG', 'Date de la réunion du CA / CG', 'Nombre de résolutions émises'], [1, '', '$200.00'], [2, 'Item Y', '$250.00']];
      // const columns = ['A', 'B', 'C', 'D'];
      autoTable(doc, { columns: this.exportColumns3, body: this.extractedData3 , ...{
        startY: (doc as any).autoTable.previous.finalY + 30,
        didDrawCell: (data: any) => {
          // Add grid lines
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
        },
      } } );




      addCompanyHeader();
      // Save the document
      doc.save('Bilan of organe.pdf');
    });
  });
}










  // exportPdf2() {
  //       import('jspdf').then((jsPDF) => {
  //           import('jspdf-autotable').then((x) => {
  //               const doc = new jsPDF.default('p', 'px', 'a4');
  //                    const columns = ['A', 'B', 'C', 'D'];
  //                     const rows: any = [];

  //                     this.data.forEach((item) => {
  //                           // Calculate the maximum length among arrays C and D for determining rowSpan
  //                           const maxArrayLength = Math.max(item.C.length, item.D.length);

  //                           // Create rows dynamically based on the maximum array length
  //                           for (let i = 0; i < maxArrayLength; i++) {
  //                             if (i === 0) {
  //                               // For the first row, include A and B with rowSpan
  //                               rows.push([
  //                                 { content: item.A, rowSpan: maxArrayLength, styles: { halign: 'center', valign: 'middle', cellWidth: 'wrap' } },
  //                                 { content: item.B, rowSpan: maxArrayLength, styles: { halign: 'center', valign: 'middle', cellWidth: 'wrap' } },
  //                                 item.C[i],
  //                                 item.D[i],
  //                               ]);
  //                             } else {
  //                               // For subsequent rows, only include C and D
  //                               rows.push([item.C[i], item.D[i]]);
  //                             }
  //                           }
  //                         });


  //               (doc as any).autoTable(columns, rows, {
  //                 didDrawCell: (data: any) => {
  //                     // Add grid lines
  //                     doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
  //                   },
  //               });
  //               doc.save('products.pdf');
  //           });
  //       });
  //   }














}

