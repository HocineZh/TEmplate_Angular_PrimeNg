import { EventBusService } from './../../../../shared/services/event-bus.service';
import { DocumentService } from './../../../document/services/document.service';
import { FileService } from './../../../../shared/services/file.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConvocationService } from './../../services/convocation.service';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Evenement } from 'src/app/modules/evenements/models/evenement';
import { ApiResponse } from 'src/app/shared/models/shared';
import { MembreInfo } from 'src/app/modules/membres/model/membre';
import { CurrentReponse, MandatRemplacement } from '../../model/convocation.model';
import jsPDF from 'jspdf';
import { UserInfoResponse } from 'src/app/modules/authentication/model/login';



@Component({
  selector: 'app-convocation',
  templateUrl: './convocation.component.html',
  styleUrls: ['./convocation.component.scss']
})
export class ConvocationComponent {
  @Input() selectedEvenement : Evenement = {};
  @ViewChild('divToPrint') elementHTML !: ElementRef;
  reponseMembrePresence : string = '';
  diablebuttonEnreg : boolean = true ;
  membresRemplacent !: MembreInfo [] ;
  membreRemplacent !: number  ;
  infoRemplacantMembre : string = '';
  nameMandatFile : string = '' ;
  sizeFile !: number ;
  idFile !: number ;
  idSeanceConvocation ?: number ;
  fonctionRemplacantMembre : string = '';
  submitted : boolean = false ;
  uploadedFileMandat !: File;
  disableModif : boolean = false ;
  disableNavigation :  boolean = false ;
  reponsePresenceOptions :any = [
    { name: 'Présent', reponseMembrePresence: 'PRESENT' },
    { name: 'Absent', reponseMembrePresence: 'ABSENT' },
    { name: 'Remplaçant', reponseMembrePresence: 'DEMANDE_REMPLACEMENT' }
  ];
  isVisibleDownload : boolean = false ;
  showMandat : boolean = false ;
  mandatRemplacent : MandatRemplacement = {} ;


  constructor(private convocationService : ConvocationService , private messageService : MessageService , private confirmationService : ConfirmationService
    , public fileService : FileService , private documentService : DocumentService , private eventBusService : EventBusService) {

  }

  ngOnInit(): void {

    this.convocationService.getMembreInfo(this.selectedEvenement.organeId!).subscribe({
      next : (data : MembreInfo[]) => {
        this.membresRemplacent = data ;
        this.getInitDataReponse();
      },
      error : (err : ApiResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
      }
    })


  }

  getInitDataReponse() {

    this.convocationService.getCurrentConvocationEtat(this.selectedEvenement.id!).subscribe({
      next : (data : CurrentReponse) => {
        if(data.convocationInfo && data.remplacentMembreInfo){
          this.disableModif = true ;
          this.disableNavigation = (data.convocationInfo.reponse!) =="DEMANDE_REMPLACEMENT" || (data.convocationInfo.reponse!) =="MANDATE" ? true : false ;
          this.reponseMembrePresence = (data.convocationInfo.reponse!) =="DEMANDE_REMPLACEMENT" || (data.convocationInfo.reponse!) =="MANDATE" ? 'DEMANDE_REMPLACEMENT' : ""  ;
          this.infoRemplacantMembre = data.remplacentMembreInfo.nomComplet! ;
          this.fonctionRemplacantMembre = data.remplacentMembreInfo.fonctionMembre! ;
          this.membreRemplacent = data.remplacentMembreInfo.membre! ;
          this.uploadedFileMandat = this.fileService.generateFile(data.remplacentMembreInfo.file?.extension!,data.remplacentMembreInfo.file?.nom!) ;
          this.nameMandatFile = data.remplacentMembreInfo.file?.nom! ;
          this.idFile = data.remplacentMembreInfo.file?.idFile! ;
          this.sizeFile = data.remplacentMembreInfo.file?.size! ;
          this.idSeanceConvocation = data.convocationInfo.id ;
        }else if(!data.remplacentMembreInfo && data.convocationInfo){
          this.reponseMembrePresence = data.convocationInfo.reponse! ;

        }
      },
      error : (err : ApiResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
      }
    })
  }


  onUploadMandatSelected(event: any) {
    this.uploadedFileMandat = event.currentFiles[0];
  }

  saveValidationMembrePresence(){
    this.confirmationService.confirm({
      key: 'confirmation',
      message: "Etes-vous sûr de vouloir enregistrer votre réponse  ?",
      accept: () => {
        this.submitted = true ;
        if(this.reponseMembrePresence =="PRESENT" || this.reponseMembrePresence =="ABSENT"){
          this.convocationService.editResponseConvocation(this.selectedEvenement.id!,this.reponseMembrePresence).subscribe(
            {
              next : (data : ApiResponse)=> {
                this.messageService.add({ severity: 'success', summary: 'Succés', detail: data.message }) ;
                this.submitted =  false ;
                this.ngOnInit();
              },
              error : (err : ApiResponse) => {
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
              }
            }
          )
        }else {
          if(this.membreRemplacent && this.uploadedFileMandat){
            this.convocationService.editResponseConvocationRemplacent(this.selectedEvenement.id!,this.membreRemplacent!,this.uploadedFileMandat)
            .subscribe(
              {
                next : (data : ApiResponse)=> {
                  this.messageService.add({ severity: 'success', summary: 'Succés', detail: data.message }) ;
                  this.ngOnInit();
                  this.submitted =  false ;
                },
                error : (err : ApiResponse) => {
                  this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
                  this.ngOnInit();
                }
              }
            )
          }else if(this.infoRemplacantMembre && this.fonctionRemplacantMembre && this.uploadedFileMandat) {
            this.convocationService.editResponseConvocationRemplacentWithotumAndat(this.selectedEvenement.id!,0,this.uploadedFileMandat,this.fonctionRemplacantMembre,this.infoRemplacantMembre)
            .subscribe(
              {
                next : (data : ApiResponse)=> {
                  this.messageService.add({ severity: 'success', summary: 'Succés', detail: data.message }) ;
                  this.ngOnInit();
                  this.submitted =  false ;
                },
                error : (err : ApiResponse) => {
                  this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
                  this.ngOnInit();
                }
              }
            )
          }

        }

      }
    })

  }

  //Télécharger un fichier existant
  downloadFile (idDocument : number ,name: string ) {
    this.documentService.downloadFile(idDocument).subscribe(
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

  //Désactiver la modification de la réponse
  startModif() {
    this.disableModif = false ;
  }

  //Supprimer la demande de remplacement
  supprimerRemplacement() {

    this.confirmationService.confirm({
      key: 'confirmation',
      message: "Etes-vous sûr de vouloir supprimer la demande de remplacement ?",
      accept: () => {
       this.submitted = false ;
       this.convocationService.deleteRemplacement(this.idSeanceConvocation!,this.idFile).subscribe(
        {
          next : (data : ApiResponse)=> {
            this.messageService.add({ severity: 'success', summary: 'Succés', detail: data.message }) ;
            this.disableNavigation = false ;
            this.ngOnInit();
          },
          error : (err : ApiResponse) => {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message }) ;
            this.ngOnInit();
          }
        }
       )
      }
    })
  }


  //Onchange du dropdown membre
  changeMembre(event : any) {
    if(event.value) {
      this.isVisibleDownload = true ;
      this.remplirMandat(event.value) ;
    }else {
    this.isVisibleDownload = false ;
    }
  }

  //Remplir le mandat automatiquement
  remplirMandat(value : number) {
    this.eventBusService.getCurrentUser().subscribe(
      {
        next : (data : UserInfoResponse) => {

          this.mandatRemplacent = {
            societe : this.selectedEvenement.societeCode,
            siege : this.selectedEvenement.societeCode ,
            nomCompletMembre  : data.nomComplet,
            nomCompletRemplacant : this.membresRemplacent.find(membre => membre.idMembre == value)?.nomComplet?.toUpperCase() ,
            dateSeance : this.selectedEvenement.currentSeance.dateDebut,
            ordreDuJour : this.selectedEvenement.listePointsOrdre?.map((point : any) => {return  point.designation})
          }
        }
      }
    )
  }


  //Aficher le dialog du mandat
  downloadMandat() {
    var doc = new jsPDF();
    this.eventBusService.getCurrentUser().subscribe(
      {
        next : (data : UserInfoResponse) => {

          let nomDocument = "mandat_" + data.nomComplet ;
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
      }
    )

  }
}
