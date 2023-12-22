import { AfterContentChecked, AfterContentInit, AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { EvenementService } from '../../services/evenement.service';
import { sharedEvenementDataService } from '../../services/sharedEvenementData.service';
import { EventBusService } from 'src/app/shared/services/event-bus.service';
import { formatDate } from '@angular/common';
import jsPDF from 'jspdf';
import { DetailsMembres,  } from 'src/app/modules/membres/model/membre';
import { ConvocationService } from 'src/app/modules/convocation/services/convocation.service';
import { ApiResponse } from 'src/app/shared/models/shared';
import { DocumentService } from 'src/app/modules/document/services/document.service';


@Component({
  selector: 'app-edit-membres',
  templateUrl: './edit-membres.component.html',
  styleUrls: ['./edit-membres.component.scss', '../../shared/sharedEvenements_style.scss']
})
export class EditMembresComponent implements OnInit  {

  @Input() selectedEvenement : any;

  loading: boolean = true;
  @ViewChild('filter') filter!: ElementRef;
  previewConvocation : boolean = false ;

  constructor( public sharedDataEvService : sharedEvenementDataService, private evenementService : EvenementService, private convocationServie : ConvocationService,
    private eventBusService: EventBusService, private messageService: MessageService, private confirmationService : ConfirmationService , private documentService : DocumentService){

    }

  ngOnInit() {

    setTimeout(()=>{
     this.loading = false;
    }, 200)
  }

  public loadListeMembres(){

    this.evenementService.getListeMembresEvenement(this.selectedEvenement.id, this.selectedEvenement.currentSeance.id).subscribe(
    (data) => {
        if(data){

          this.selectedEvenement.listeMembres = data;
           //ajouter les initiales des membres
          if(this.selectedEvenement.listeMembres !==null && this.selectedEvenement.listeMembres!.length>0){
          this.selectedEvenement.listeMembres!.forEach((membre:any) => {
            membre.initiales = this.sharedDataEvService.getAvatarMembreLabel(membre.membre_nom, membre.membre_prenom );
           });
       }

        }
        else{
            console.log( "Une erreur inattendue s'est produite!");
        }
    },
    (error) => {
        //Erreur lors du chargement des membres
        console.log(error);
      }
    );
  }
 /*  getAvatarMembreLabel(nom:any, prenom:any){

    let label = "";
    if(nom && nom.length>0)
    {
      label = label + nom[0].toUpperCase();
    }
    if(prenom && prenom.length > 0){
      label = label + prenom[0].toUpperCase() ;
    }

    return label;

  } */

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
}

clear(table: Table) {
  table.clear();
  this.filter.nativeElement.value = '';
}

//********************************************************************************************************** */
//**********validation date ************************************************************************
//********************************************************************************************************** */

confirmationValiderDate(event: Event){

  //Confirmer le retirement du point ordre
  this.confirmationService.confirm({
      key: 'confirmDlg',
      header: 'Confirmation de validation!',
      target: event.target as EventTarget,
      message: "êtes-vous sûr de vouloir valider la date de l'évènement !",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          //Actual logic to perform a confirmation
          this.validerDateEv();
      },
      reject: () => {
          return false;
      }

  });
}


validerDateEv(){
  this.evenementService.validerDateEvenement(this.selectedEvenement.id).subscribe(
    (data) => {

            if(data){
                console.log(data);

                //this.selectedEvenement.listePointsOrdre = data;
                this.selectedEvenement.dateevValide = true;
                this.showSuccessToast("Success!", "La date de l'évènement a été validée avec success.");


            }
            else{
                console.log(data);
                this.showErrorToast("Erreur!", "Une erreur inattendue s'est produite!");
            }
    },
    (error) => {
        this.showErrorToast("Erreur", error.message);
    }
    )
}

showColumnVlDate(){
  return (this.eventBusService.hasPrivilges(['evenement.details'])
  || this.sharedDataEvService.hasEvenementPrivilges(['evenement.validation_date']))
  && (!this.selectedEvenement.previsionnel) && (this.selectedEvenement.dateevPublier);
}

showColumnVlPresence(){

  return (this.eventBusService.hasPrivilges(['evenement.details'])
  || this.sharedDataEvService.hasEvenementPrivilges(['evenement.validation_presence']))
  && (!this.selectedEvenement.previsionnel) && (this.selectedEvenement.dateevPublier);
}




showColumnVlOdj(){
  return (this.eventBusService.hasPrivilges(['evenement.details'])
  || this.sharedDataEvService.hasEvenementPrivilges(['evenement.odj.valider']))
  && (!this.selectedEvenement.previsionnel) && (this.selectedEvenement.odjPublier);
}

showColumnDownloadConvocation(){
  return (this.eventBusService.hasPrivilges(['evenement.details'])
  || this.sharedDataEvService.hasEvenementPrivilges(['evenement.convocation.download']))
  && (!this.selectedEvenement.previsionnel) ;
}


showColumnVlUploadConv(){
  return (this.eventBusService.hasPrivilges(['evenement.details'])
  || this.sharedDataEvService.hasEvenementPrivilges(['evenement.convocation.upload']))

  && (!this.selectedEvenement.previsionnel);
}

getClassMandatExpire(mandat_dateFin:string){
  try{
    let dateMandat = formatDate(mandat_dateFin,'yyyy-MM-dd','en_US');
    let dateDebut = formatDate(this.selectedEvenement.dateDebut,'yyyy-MM-dd','en_US');

  if(dateDebut>dateMandat)
     //return "background-color : red; color : white;";
     return "blink";

  }catch(ex){
    return '';
  }
  return '';

}

getDelaisValidationDate(){
  try
  {
   return this.selectedEvenement.delaisEvenement?.reponseValidationDate;

  }
  catch(ex){
    return null;
  }
}
// *********************************  Traitement des services messages  ********************************************

showErrorToast(summary:string, detail:string){

  this.showMessageToast('error', summary, detail);

}
showSuccessToast(summary:string, detail:string){

  this.showMessageToast('success', summary, detail);

}
showMessageToast(severity:string, summary:string, detail:string ){

  this.messageService.add({ key: 'tstMbr', severity: severity , summary: summary , detail: detail });

}

/******************* Exporter les convocations *************************/
elementHTML !: ElementRef;
selectedMembre !: DetailsMembres ;
uploadeFile !: File ;
//Afficher la convocation
showConvocation(membre : DetailsMembres){
  this.previewConvocation = true ;
  this.selectedMembre = membre ;
}

//Générer la convocation
setElement(element : ElementRef){
  this.elementHTML = element ;
}
exportPdf() {
  var doc = new jsPDF();
  let nomDocument = "convocation-" + this.selectedMembre.membre_nom +"-"+ this.selectedMembre.membre_prenom ;
  doc.html(this.elementHTML.nativeElement, {
    callback:  function(doc) {
        // Save the PDF
        doc.save(nomDocument);
    },
    margin: [10, 10, 10, 10],
    autoPaging: 'text',
    x: 0,
    y: 0,
    width: 190, //target width in the PDF document
    windowWidth: 675 //window width in CSS pixels
  });
}

/************ Importer la convocation signée  */
importConvoctionPreview : boolean = false ;
selecteduploadedMembre !: DetailsMembres ;
uploadConvocationSigne(membre : DetailsMembres) {
  this.selecteduploadedMembre = membre ;
  this.importConvoctionPreview = true ;
}

importer() {
  this.convocationServie.uploadConvSigne(this.selectedEvenement.id!,this.selecteduploadedMembre.membre_id!,this.uploadeFile).subscribe(
    {
      next : (data : ApiResponse) => {
        this.messageService.add({ severity: 'success', summary: 'Message', detail: data.message , key : 'tstMbr' }) ;
        this.importConvoctionPreview = false ;
      },
      error : (err : ApiResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message , key : 'tstMbr' }) ;
      }
    }
  )
}

onUpload(event : any) {
  this.uploadeFile = event.currentFiles[0] ;
}

deleteFile(idFile : number) {
  this.confirmationService.confirm({
    message: "Etes vous sure de vouloire supprimer la convocation signée ?",
    header: 'Confirmation de suppression',
    icon: 'pi pi-exclamation-triangle',
    key : "confirmDlg",
    accept: () => {
      this.convocationServie.deleteConvSigne(idFile).subscribe(
        {
          next : (data : ApiResponse) => {
            this.messageService.add({ severity: 'success', summary: 'Message', detail: data.message , key : "tstMbr"}) ;
          },
          error : (err : ApiResponse) => {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message  , key : "tstMbr"}) ;
          }
        }
      )
    },
    reject : () =>{
    }
  })
}

download(idFile : number , name: string) {
  this.documentService.downloadFile(idFile).subscribe(
    {
      next : (data : Blob) =>{
        let url = window.URL.createObjectURL(data);
        let a = document.createElement('a');
        a.download = name ;
        document.body.appendChild(a);
        a.href = url;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    }
  )
}

}
