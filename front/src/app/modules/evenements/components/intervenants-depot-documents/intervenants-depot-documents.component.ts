import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DocumentService } from 'src/app/modules/document/services/document.service';
import { sharedEvenementDataService } from '../../services/sharedEvenementData.service';
import { PointOrdreService } from '../../services/pointOrdre.service';

@Component({
  selector: 'app-intervenants-depot-documents',
  templateUrl: './intervenants-depot-documents.component.html',
  styleUrls: ['./intervenants-depot-documents.component.scss']
})
export class IntervenantsDepotDocumentsComponent implements OnInit, OnDestroy {

  @ViewChild('fileUpload', {static: false}) fileUpload: any;
  @Input() selectedEvenement : any;

  uploadedFilesPo: any[] = [];
  listPoIntervenant : any[] = [];


  constructor(
    private pointOdreService : PointOrdreService,
    public sharedDataEvService : sharedEvenementDataService,
    private documentService : DocumentService,
    private messageService: MessageService, private confirmationService : ConfirmationService) {

    }

   


    ngOnInit(): void {

      this.loadPointsOrdresDocsIntervenant();

    }

    ngOnDestroy(): void {
      

    }

    loadPointsOrdresDocsIntervenant(){

          //get Intervenant point ordre + documents déposés
    this.pointOdreService.getPointsOrdresDocsOfIntervenantEvenement(this.selectedEvenement.id).subscribe(
      (data : any) => {       
        this.listPoIntervenant = data;
      },
      (error:any) => {
          console.log(error);        
          this.showErrorToast("Erreur", error.message);

      });
    }

    onUploadPoSelected(event:any, po:any){

      for (const file of event.files) {
        this.uploadedFilesPo.push(file);
  
    }
  
    //Confirmer le retirement du point ordre
    this.confirmationService.confirm({
      key: 'confirmPoIntrv',
      header: 'Confirmation du chargement!',
      target: event.target as EventTarget,
      message: "Êtes-vous sûr de vouloir charger ces documents ?",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          //Actual logic to perform a confirmation
  
           //Traitement du validation du point ordre
    this.pointOdreService.chargerDocumentsIntervenantPOEvenement(this.selectedEvenement.id, po.poId, this.uploadedFilesPo).subscribe(
      (data : any) => {
  
              if(data){
  
                  this.showSuccessToast("Chargement réussie", "Les documents on été chargés avec success.");
                  //Vider le composant p-upload avec ses files
                  this.fileUpload.clear();
                  this.uploadedFilesPo = [];
                  //charger la liste des documents valide
                  po.poDocuments = data;
              }
              else{
                  console.log(data);
                  this.showErrorToast("Erreur!", "Une erreur inattendue s'est produite!");
              }
      },
      (error:any) => {
          console.log(error);
          this.showErrorToast("Erreur", error.message);
  
      });
  
  
  
      },
      reject: () => {
          return;
      }
  
  });
  
    //this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });

  }


  downloadSelectedDoc(doc :any, event:any){   
   
       this.documentService.downloadFile(doc.id).subscribe(
         {
           next : (data : Blob) =>{
             let url = window.URL.createObjectURL(data);
              let a = document.createElement('a');
             a.download = doc.nom ;
             document.body.appendChild(a);
             a.href = url;
             a.click();
             window.URL.revokeObjectURL(url);
             a.remove();   
            
           }
         }
         );
   }
   
   supprimerSelectedDoc(po:any, document:any, event:any){
   
     //Confirmer le retirement du point ordre
     this.confirmationService.confirm({
       key: 'confirmPoIntrv',
       header: 'Confirmation du suppression!',
       target: event.target as EventTarget,
       message: "Êtes-vous sûr de vouloir supprimer ce document ?",
       icon: 'pi pi-exclamation-triangle',
       accept: () => {
             this.pointOdreService.supprimerSelectedDocPoEvenement(po.poId, document.id).subscribe(
             (data : any) => {
   
              let newList =  po.poDocuments.filter((doc:any) => doc.id !== document.id);
              po.poDocuments = newList;
              
               this.showSuccessToast("Suppression réussie", "Document supprimé avec success.");
   
             },
             (error:any) => {
                 console.log(error);
                 this.showErrorToast("Erreur", error.message);
   
             });
   
     },
     reject: () => {
         return;
     }
   
   });
   
   }
   
    
  // *********************************  Traitement des services messages  ********************************************

showErrorToast(summary:string, detail:string){

  this.showMessageToast('error', summary, detail);

}
showSuccessToast(summary:string, detail:string){

  this.showMessageToast('success', summary, detail);

}
showMessageToast(severity:string, summary:string, detail:string ){

  this.messageService.add({ key: 'tstIntrv', severity: severity , summary: summary , detail: detail });

}  

}
