import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Evenement, TypeOrgane, evenementValidation } from '../../models/evenement';

import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';

import { PointOrdreService } from '../../services/pointOrdre.service';
import { pointOrdre } from '../../models/pointOrdre';
import { PropositionsMembresService } from '../../services/propositions_membres.service';
import { ListEvenementsComponent } from '../list-evenements/list-evenements.component';
import { sharedEvenementDataService } from '../../services/sharedEvenementData.service';
import { EvenementService } from '../../services/evenement.service';
import { DocumentService } from 'src/app/modules/document/services/document.service';



interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-edit-odj',
  templateUrl: './edit-odj.component.html',
  styleUrls: ['./edit-odj.component.scss']
})
export class EditOdjComponent implements OnInit, OnDestroy{

  @ViewChild('fileUpload', {static: false}) fileUpload: any;
  @ViewChild('autocIntervenants', {static: false}) autocIntervenants: any;


  @Input() selectedEvenement : any;
  evenementvValidation :any = {...evenementValidation};

  //Dialog importation modèles Ordre du jour
  showDialogModelOJ : boolean = false;
  outputImportDialog : any;

  //Dialog propositions membres
  showDialogPropMembres : boolean = false;
  listAllPropositionsMembre : boolean = false;
  labelButtonPropositions : string = 'Mes propositions';
  IconButtonProposition : string = 'pi pi-align-left';
  nbrPropositionsMembre : string = '0';

  //Dialog Points ordres ajournés
  showDialogPointsAjournes : boolean = false;
  nbrPointsAjournes : string = '0';

  //Etat création Ordre du jour a partir du zéro
  createOJFromZero : boolean = false;


  //Menu actions sur ODJ
  itemsActionsOdj: MenuItem[] =[

      {
          label: 'Paramétres',
          icon: 'pi pi-cog',
          command: () => {
              this.parametreODJDialog();
          }
      },
      { separator: true },
      {
          label: 'Vider la liste',
          icon: 'pi pi-trash',
          disabled : false,
          command: () => {
              this.confirmationViderListeOdj();
          }
      }
  ];


  //Traitement seletions points ordres et changement etat modification
  originalSelectedPo : any = [];
  selectedPointOrdre : any = [];
  uploadedFilesPo: any[] = [];
  saveButtonClicked : boolean = false;






  constructor(
    private pointOdreService : PointOrdreService,
    private evenementService : EvenementService,
    private propositionsMembresService : PropositionsMembresService,
    public sharedDataEvService : sharedEvenementDataService,
    private documentService : DocumentService,
    private messageService: MessageService, private confirmationService : ConfirmationService) {


    }

    ngOnDestroy(): void {
    }


    ngOnInit(): void {

      this.createOJFromZero = false;

      //initialiser view si l'ordre du jour est valide
      this.initIfOdjValide();

      //Initialiser suivant l'etat évènement
      this.initIfEtatEvenement();

      //get permission if user can list all propositions membres
      if(this.sharedDataEvService.hasEvenementPrivilges(['evenement.odj.gerer_propositions_po'])){
        this.listAllPropositionsMembre =  true;
        this.labelButtonPropositions =  'Propositions membres';
        this.IconButtonProposition  = 'pi pi-users';
      }

      //init nombre propositions points ordres membres
      this.LoadNbrPropositionsOJEvenement();
      this.LoadNbrPointsAjournesEvenement();

      //Init parametres odj (delais et acces depot documents)
      this.itemsActionsOdj[0].disabled = !this.sharedDataEvService.hasEvenementPrivilges(['evenement.odj.modifier_parametres']);
      this.delaisValidationDD = this.selectedEvenement.delaisEvenement?.deposDocumentsPoints;
      this.access_depot_documents = this.selectedEvenement.access_depot_documents;

      //get today date
      this.sharedDataEvService.today.subscribe(data => this.today= data );

      //init etat validation membre odj
      this.validationOdjMembre = this.selectedEvenement.membreConvocation?.etat_validation_odj ==="valider";




    }

    //Traitement des bouttons est affichage si l'ordre du jour est valide
    initIfOdjValide(){

      /* console.log(this.itemsActionsOdj);
      console.log(this.selectedEvenement);
      console.log(this.selectedEvenement.odjValide); */
      //Disable vider liste ordre du jour si valide

      this.itemsActionsOdj[2].disabled = this.selectedEvenement.odjValide || !this.sharedDataEvService.hasEvenementPrivilges(['evenement.odj.vider_liste_po']);
     /*  console.log(this.itemsActionsOdj);  */

    }

    //Traitement des bouttons est affichage selon l'état évènement
    initIfEtatEvenement(){
      if(this.selectedEvenement.etat === 'CLOTURER')
      this.itemsActionsOdj[2].disabled = true;

    }



  // Traitement ordre du jour de l'évènement



  hasAccesCreateODJ(){

    return this.sharedDataEvService.hasEvenementPrivilges(['evenement.odj.creer_from_model']) || this.sharedDataEvService.hasEvenementPrivilges(['evenement.odj.creer_a_zero']) ;

  }

  OnCreateOJFromZero(){

  this.createOJFromZero = true;
  }

  loadlistePointsOJEvenement(){

  this.pointOdreService.getListPointsOrdreEvenement(this.selectedEvenement.id).subscribe(
    (data) => {

            if(data){
                console.log(data);
                this.selectedEvenement.listePointsOrdre = data;
                this.selectedPointOrdre = [];
            }
            else{
                console.log(data);

            }
    },
    (error) => {
        console.log(error);

    }
    )


  }

//********************************************************************************************************** */
//**********validation ordre du jour ************************************************************************
//********************************************************************************************************** */

confirmationValiderODJ(event: Event){

  if(this.selectedEvenement.listePointsOrdre === null || this.selectedEvenement.listePointsOrdre.length ===0 ){
     this.showErrorToast("Erreur", "La liste des points ordres est vide !")
  }else
  {
  //Confirmer le retirement du point ordre
  this.confirmationService.confirm({
      key: 'confirmRetirer',
      header: 'Confirmation de validation!',
      target: event.target as EventTarget,
      message: "Êtes-vous sûr de vouloir valider l'ordre du jour et empécher toutes autres changements ou ajouts ?",

      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          //Actual logic to perform a confirmation
          this.validerOdj();
      },
      reject: () => {
          return false;
      }

  });
 }
}

validerOdj(){

  this.pointOdreService.validerOrdreJourEvenement(this.selectedEvenement.id).subscribe(
    (data) => {

            if(data){
                console.log(data);
                this.selectedEvenement.listePointsOrdre = data;
                this.selectedEvenement.odjValide = true;
                this.selectedPointOrdre = [];
                this.initIfOdjValide();
            }
            else{
                console.log(data);
                this.showErrorToast("Erreur!", "Une erreur inattendue s'est produite!");
            }
    },
    (error) => {
        console.log(error);
        this.showErrorToast("Erreur", error.message);
    }
    )
}

//********************************************************************************************************** */
//*************Vider la lise des points ordre du jour ******************************************************/
//********************************************************************************************************** */

confirmationViderListeOdj(){

  if(this.selectedEvenement.listePointsOrdre === null || this.selectedEvenement.listePointsOrdre.length ===0 ){

    this.showErrorToast("Erreur", "La liste des points ordres est vide !")
  }
  else
  {
    let listPo:number[] = [];

    this.selectedEvenement.listePointsOrdre.forEach((element:any) => {
          if(element.isvalid === false)
             listPo.push(element.id);
    });

    if(listPo.length === 0)
    {
      this.showMessageToast("warn","Message", "Aucun point ordre ne peut étre retiré de la liste !");

    }else
    {
    //Confirmer le retirement du point ordre
    this.confirmationService.confirm({
        key: 'confirmRetirer',
        header: 'Confirmation de suppression!',
        message: "Êtes-vous sûr de vouloir vider la liste des points ordre du jour ?",
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            //Actual logic to perform a confirmation
            this.viderListeOdj(listPo);
        },
        reject: () => {
            return false;
        }

    });
    }
  }
}

viderListeOdj(listPo:number[]){

  this.pointOdreService.retirerPointOrdreFromEvenement(this.selectedEvenement.id, listPo).subscribe(
    (data) => {

            if(data){

                this.showSuccessToast("Suppression réussie", "la liste des Points ordres non valider ont été retirés avec success.");
                this.selectedEvenement.listePointsOrdre = data;
                this.selectedPointOrdre = [];

            }
            else{
                console.log(data);
                this.showErrorToast("Erreur!", "Une erreur inattendue s'est produite!");
            }
    },
    (error) => {
        console.log(error);
        this.showErrorToast("Erreur", error.message);

    }

);

}
//********************************Validation ODJ Membre ************************** */

validationOdjMembre : boolean = false

confirmationValidationOdjMembre(event:any){
//Confirmer le retirement du point ordre
this.confirmationService.confirm({
  key: 'confirmRetirer',
  header: 'Confirmation de validation!',
  target: event.target as EventTarget,
  message: "Êtes-vous sûr de vouloir confirmer votre validation de l'ordre du jour ?",

  icon: 'pi pi-exclamation-triangle',
  accept: () => {
      //Actual logic to perform a confirmation
      this.onChangeValidationODJMembre();
  },
  reject: () => {
    this.validationOdjMembre = false;
      return;
  }

});
}

onChangeValidationODJMembre(){

  //Traitement du validation du point ordre
  this.evenementService.enregistrerReponseValidationOdjMembre(this.selectedEvenement.id).subscribe(
    (data) => {

            if(data){

                this.showSuccessToast("Confirmation réussie", "Votre confirmation de validation a été enregistrée avec success.");
                this.validationOdjMembre = true;
                this.selectedEvenement.membreConvocation.etat_validation_odj ="valider";

            }
            else{
                console.log(data);
                this.validationOdjMembre = false;
                this.showErrorToast("Erreur!", "Une erreur inattendue s'est produite!");
            }
    },
    (error) => {
        console.log(error);
        this.validationOdjMembre = false;
        this.showErrorToast("Erreur", error.message);

    });

}

hasValidationOdjMembre(){

  return !this.selectedEvenement.previsionnel && this.selectedEvenement.odjPublier &&

    this.sharedDataEvService.hasEvenementPrivilges(['evenement.odj.validation_membre']);


}

//********************************************************************************************************** */
//Traitement du changement de la selection des points ordre
//********************************************************************************************************** */

onSelectionPoChange(event:any){

  if(this.originalSelectedPo.length === 0){
    this.originalSelectedPo[0] = {...event.value[0]};
  }
  else if(event.value[0].id !==  this.originalSelectedPo[0].id ){


      if(this.saveButtonClicked === false)
          this.restoreChangesPoToOriginal();
      else
          this.saveButtonClicked = false;


      this.originalSelectedPo[0] = {...event.value[0]};

   }

   //get list documents valide point ordre

   this.pointOdreService.getDocumentsValidePoEvenement(this.selectedPointOrdre[0].id).subscribe(
    (data : any) => {

      this.documentsPoValides = data;

    },
    (error:any) => {
        console.log(error);
        this.showErrorToast("Erreur", error.message);
        this.documentsPoValides =[];

    });

    //get Intervenant point ordre + documents déposés
    this.pointOdreService.getIntervenantAndDocsPoEvenement(this.selectedEvenement.id,this.selectedPointOrdre[0].id).subscribe(
      (data : any) => {
        //get selected intervenant
        this.selectedPointOrdre[0].selectedIntervenantPo = data.intervenant;
        this.selectedIntervenantPo = data.intervenant;
        this.originalSelectedIntervenant = data.intervenant;

        //get Documents intervenants
        this.documentsIntervenantsPo = data.documentsIntervenants;

      },
      (error:any) => {
          console.log(error);
          //set selected intervenant
          this.selectedPointOrdre[0].selectedIntervenantPo = null;
          this.selectedIntervenantPo = null;
          this.originalSelectedIntervenant = null;

          //set documents intervenants
          this.documentsIntervenantsPo = null;
          this.showErrorToast("Erreur", error.message);

      });



}

getExtDoc(nomDoc : any){

  var listeImageIcons = ['bmp','doc','docx','jpeg','jpg','pdf','png','ppt','pptx','rar','xls','xlsx'];
  var fileExt = nomDoc.split('.').pop();

  if(!fileExt || fileExt === '' || !listeImageIcons.find((ext) => ext === fileExt.toLowerCase())){
    return 'default';
  }else{
    return fileExt.toLowerCase();
  }

}

downloadSelectedDoc(doc :any, event:any){
 /*  this.pointOdreService.downloadSelectedDocPoEvenement(this.selectedPointOrdre[0].id, document.id ).subscribe(
    (data : any) => {

      let url = window.URL.createObjectURL(data.file);
      let a = document.createElement('a');
      a.download = name ;
      document.body.appendChild(a);
      a.href = url;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

    },
    (error:any) => {
        console.log(error);
        this.showErrorToast("Erreur", error.message);

    }); */


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

         /*  const file = new window.Blob([data], { type: 'contentType' });
          const downloadAncher = document.createElement("a");
          downloadAncher.style.display = "none";
          const fileURL = URL.createObjectURL(file);
          downloadAncher.href = fileURL;
          downloadAncher.download = doc.nom;
          downloadAncher.click(); */
        }
      }
      );
}

supprimerSelectedDoc(document:any, event:any){

  //Confirmer le retirement du point ordre
  this.confirmationService.confirm({
    key: 'confirmRetirer',
    header: 'Confirmation du suppression!',
    target: event.target as EventTarget,
    message: "Êtes-vous sûr de vouloir supprimer ce document ?",

    icon: 'pi pi-exclamation-triangle',
    accept: () => {
          this.pointOdreService.supprimerSelectedDocPoEvenement(this.selectedPointOrdre[0].id, document.id).subscribe(
          (data : any) => {

            this.documentsPoValides = data;
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

//********************************************************************************************************** */
// Traitement du chargement des documents point ordres valides ******************************
//********************************************************************************************************** */

documentsPoValides : any[] = [];

onUploadPoSelected(event: any) {

  for (const file of event.files) {
      this.uploadedFilesPo.push(file);

  }

  //Confirmer le retirement du point ordre
  this.confirmationService.confirm({
    key: 'confirmRetirer',
    header: 'Confirmation du chargement!',
    target: event.target as EventTarget,

    message: "Êtes-vous sûr de vouloir charger ces documents et notifier les membres de leurs disponibilités ?",
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
        //Actual logic to perform a confirmation

         //Traitement du validation du point ordre
  this.pointOdreService.chargerDocumentsValidePOEvenement(this.selectedEvenement.id, this.selectedPointOrdre[0].id, this.uploadedFilesPo).subscribe(
    (data : any) => {

            if(data){

                this.showSuccessToast("Chargement réussie", "Les documents on été chargés avec success.");
                //Vider le composant p-upload avec ses files
                this.fileUpload.clear();
                this.uploadedFilesPo = [];
                //charger la liste des documents valide
                this.documentsPoValides = data;
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



  this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });

}

AnnulerPoChangement(){

  console.log(this.selectedPointOrdre);
  if(!this.saveButtonClicked){
   this.restoreChangesPoToOriginal();
   this.selectedPointOrdre[0] = this.selectedEvenement.listePointsOrdre?.find((te:any) => {return te.id ===  this.selectedPointOrdre[0].id});
  }

}

restoreChangesPoToOriginal(){

  console.log(this.fileUpload);

  console.log("length original po :" + this.originalSelectedPo.length);
  if(this.originalSelectedPo.length > 0 ){
    let indexToUpdate = this.selectedEvenement.listePointsOrdre?.findIndex((item:any) => item.id === this.originalSelectedPo[0].id);



    if(this.selectedEvenement.listePointsOrdre &&  indexToUpdate !== undefined && indexToUpdate > -1 ){
      console.log("index inside if " + indexToUpdate);
      this.selectedEvenement.listePointsOrdre[indexToUpdate] = {...this.originalSelectedPo[0]};
      this.selectedEvenement.listePointsOrdre = Object.assign([],  this.selectedEvenement.listePointsOrdre);
    }

    this.uploadedFilesPo = [];
    this.uploadedFilesPo.length =0;
    if(this.fileUpload){
    console.log(this.fileUpload);
    this.fileUpload.clear();
    }
 }
}

//********************************************************************************************************** */
//Traitement du validation point ordre
//********************************************************************************************************** */

confirmationValidationPo(event: Event){

  //Confirmer le retirement du point ordre
  this.confirmationService.confirm({
      key: 'confirmRetirer',
      header: 'Confirmation de validation!',
      target: event.target as EventTarget,
      message: "Êtes-vous sûr de vouloir valider le point ordre N° "+ this.selectedPointOrdre[0].ordre +" ?",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          //Actual logic to perform a confirmation
          this.onChangeValidation();
      },
      reject: () => {
        this.selectedPointOrdre[0].isvalid = false;
          return false;
      }

  });

}

onChangeValidation(){

  //Traitement du validation du point ordre
  this.pointOdreService.validerPointOrdreEvenement(this.selectedEvenement.id, this.selectedPointOrdre[0].id).subscribe(
    (data) => {

            if(data){

                this.showSuccessToast("Modification réussie", "Point ordre valider avec success.");
                this.saveButtonClicked = true;

            }
            else{
                console.log(data);
                this.showErrorToast("Erreur!", "Une erreur inattendue s'est produite!");
            }
    },
    (error) => {
        console.log(error);
        this.showErrorToast("Erreur", error.message);

    });

}


//********************************************************************************************************** */
//*************Enregistrement changement Point ordre *********************************************************/
//********************************************************************************************************** */

EnregistrerPoChangement(){

  // get selected point ordre changes
  let po : any = {
    id :this.selectedPointOrdre[0].id,
    titre : this.selectedPointOrdre[0].designation,
    description : this.selectedPointOrdre[0].description ,
    isvalid : this.selectedPointOrdre[0].isvalid
   };
   //this.selectedEvenement.id
  this.pointOdreService.updatePoEvenement(this.selectedEvenement.id, po).subscribe(
    (data) => {
            if(data){

              this.showSuccessToast("Modification réussie", "Point ordre modifié avec success.");
              this.saveButtonClicked = true;
            }
            else{
                console.log(data);
                this.showErrorToast("Erreur!", "Une erreur inattendue s'est produite!");
            }
    },
    (error) => {
        console.log(error);
        this.showErrorToast("Erreur", error.message);

    }

  );





}

//********************************************************************************************************** */
//************** Traitement du re-ordrer des points ordre ***************************************************/
//********************************************************************************************************** */

onReorderListPo(event:any){

  //Récupérer la liste du nouveau ordre des points
  let i=1;
  let newOrdreList:any[] = [];
  this.selectedEvenement.listePointsOrdre?.forEach((element:any) => {
    newOrdreList.push({idPo : element.id, newOrdre : i});
    i++;
  });

  //push du nouveau ordre vers le back
  this.pointOdreService.reorderListPoEvenement(this.selectedEvenement.id, newOrdreList).subscribe(
    (data) => {
            if(data){

              //appliquer le nouveau ordre au front
                i=1;
                this.selectedEvenement.listePointsOrdre?.forEach((element:any) => {
                  element.ordre = i;
                  i++;
                });
            }
            else{
                console.log(data);
                this.showErrorToast("Erreur!", "Une erreur inattendue s'est produite!");
            }
    },
    (error) => {
        console.log(error);
        this.showErrorToast("Erreur", error.message);

    }

  );



}


//********************************************************************************************************** */
//Traitement Ajout et retirer des points ordre
//********************************************************************************************************** */

isNewPoSaved($event:any){


  if($event.success === true){
    //this.selectedEvenement.listePointsOrdre = $event.data;
    this.showSuccessToast("Success","Point ordre ajouté avec success.");
    this.loadlistePointsOJEvenement();
  }
  else
   this.showErrorToast("Erreur", $event.message);

}
//Traitement du retirer point ordre

confirmationRetirerPo(event: Event, po:any){

  //Confirmer le retirement du point ordre
  this.confirmationService.confirm({
      key: 'confirmRetirer',
      header: 'Confirmation de suppression!',
      target: event.target as EventTarget,
      message: "Êtes-vous sûr de vouloir retirer le point ordre N° "+ po.ordre +" ?",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          //Actual logic to perform a confirmation
          this.OnRetirerPoFromOJ(po);
      },
      reject: () => {
          return false;
      }

  });

}

OnRetirerPoFromOJ(po:any){

  //Traitement du retirement du point ordre
  let poArr :number[] =[po.id];
  this.pointOdreService.retirerPointOrdreFromEvenement(this.selectedEvenement.id, poArr).subscribe(
    (data) => {

            if(data){

                this.showSuccessToast("Modification réussie", "Point ordre retirer avec success.");
                this.selectedEvenement.listePointsOrdre = data;
                this.selectedPointOrdre = [];

            }
            else{
                console.log(data);
                this.showErrorToast("Erreur!", "Une erreur inattendue s'est produite!");
            }
    },
    (error) => {
        console.log(error);
        this.showErrorToast("Erreur", error.message);

    }

);

}


/**************************************************************************************************** */
/*************** Traitement des intervenants ********************************************************/
/**************************************************************************************************** */

today :any;

//Traitement des intervenents
filtredIntervenentsPo: any[] = [];
selectedIntervenantPo : any;
originalSelectedIntervenant :any;
documentsIntervenantsPo :any;

//Traitement Choix autocomplete intervenets
filterIntervenets(event: AutoCompleteCompleteEvent) {


    if( event.query && event.query.trim().length>2){
      console.log(event.query);
      //initialiser la liste  des utilisateurs intervenants
       this.pointOdreService.getListUsersIntervenants(event.query).subscribe((users) =>{
        this.filtredIntervenentsPo = users;
    });
   }

}

getFormattedUser(user : any){


  if(user)
     return user.nom + ' ' +  user.prenom + '  -- ' + user.fonction + ' -- ' + user.societe_code ;
  else
     return '';
}

getNombreJoursRestants(){

  try{

    let dateToday = new Date(this.today);
    let dateDelais = new Date(this.getCalculatedDateDelaisDD()!);

    //let Difference_In_Time = dateDelais.getTime() - dateToday.getTime();
    //let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    //return parseInt(Difference_In_Days.toString()) - 1;

    let nbrJoursRestants = Math.floor(( Date.UTC(dateDelais.getFullYear(), dateDelais.getMonth(), dateDelais.getDate()) -Date.UTC(dateToday.getFullYear(), dateToday.getMonth(), dateToday.getDate()) ) /(1000 * 60 * 60 * 24));
    if(nbrJoursRestants>=0)
     return '<span>(<span class="text-red-400">' + nbrJoursRestants +" jours</span> restants)</span>";
     else
     return '<span>(<span class="text-red-400">Délais dépassé.</span>)</span>';

  }catch(ex){
    return '';
  }

}

enregistrerAffectPoIntervenant(event: Event){

   //Confirmer le retirement du point ordre
   this.confirmationService.confirm({
    key: 'confirmRetirer',
    header: "Confirmation de l'affectation!",
    target: event.target as EventTarget,
    message: "Êtes-vous sûr de vouloir enregistrer le changement de l'affectation du point ordre ?",
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
        //Actual logic to perform a confirmation
        this.enregistrerPoIntervenant();
    },
    reject: () => {
        return false;
    }

});

}

enregistrerPoIntervenant(){

  /* console.log("original selected");
  console.log(this.originalSelectedIntervenant);
  console.log(this.selectedIntervenantPo);
  console.log(this.autocIntervenants.inputValue); */


 let idIntervenant;
  if(this.autocIntervenants.inputValue === null){
    this.selectedIntervenantPo = null;
    idIntervenant = 0;
  }else{
    idIntervenant = this.selectedIntervenantPo.id;
  }

   if((this.selectedIntervenantPo && this.originalSelectedIntervenant && (this.selectedIntervenantPo.id === this.originalSelectedIntervenant.id) ) ||
          (!this.selectedIntervenantPo && !this.originalSelectedIntervenant ))
     {
      this.showMessageToast("warn","Modification", "Aucune modification ne sera apportée sur l'affectation du  point ordre !");
      return;
     }
   //Traitement du validation du point ordre
   this.pointOdreService.affecterIntervenantToPointOrdre(this.selectedEvenement.id, this.selectedPointOrdre[0].id, idIntervenant).subscribe(
    (data) => {

            if(data){
                this.originalSelectedIntervenant =  this.selectedIntervenantPo;
                this.showSuccessToast("Modification réussie", "La modification de l'affectation du point ordre a été enregistrée avec success.");


            }
            else{
                console.log(data);
                this.showErrorToast("Erreur!", "Une erreur inattendue s'est produite!");
            }
    },
    (error) => {
        console.log(error);
        this.showErrorToast("Erreur", error.message);

    });

}

AnnulerAffectPoIntervenant(event: Event){

  //console.log(this.originalSelectedIntervenant);
 this.selectedIntervenantPo = this.originalSelectedIntervenant;

}



/**************************************************************************************************** */
/*************** Traitement des Dialog parametres ordre du jour ********************************************************/
/**************************************************************************************************** */
showParametresODJDialog : boolean = false;
access_depot_documents : any;
delaisValidationDD : any;
//today : any;


parametreODJDialog(){

  this.showParametresODJDialog = true;

}

enregistrerParametresODJ(){

  try{

      this.evenementService.updateParametresODJ(this.selectedEvenement.id,this.access_depot_documents, this.delaisValidationDD).subscribe(
        (data) => {

            this.showSuccessToast("Modification", "Les paramètres de l'ordre du jour ont été modifiés avec succes.");
            this.showParametresODJDialog = false;
            this.selectedEvenement.delaisEvenement.deposDocumentsPoints = this.delaisValidationDD;
            this.selectedEvenement.access_depot_documents = this.access_depot_documents ;


        },
        (error) => {

            console.log(error);
            this.showErrorToast("Erreur", error.message);
        }

      );


    }catch(ex){
    console.log(ex);
    this.showErrorToast("Erreur !", "Une erreur est survenu lors du changement d'état de l'évènement, réessayer a nouveau ou contacter l'administrateur.");

    }

}

getCalculatedDateDelaisDD(){
   return this.sharedDataEvService.getCalculatedDateDelais(this.selectedEvenement.dateDebut, this.delaisValidationDD, false);
}

onCloseParamsDialog(){

  this.delaisValidationDD = this.selectedEvenement.delaisEvenement.deposDocumentsPoints;
  this.access_depot_documents = this.selectedEvenement.access_depot_documents ;

}


//********************************************************************************************************** */
// *********************  Traitement dialog Importation ordre du jour from modèle
//********************************************************************************************************** */

OnShowModelOjDialog(){

  this.showDialogModelOJ = true;
}

getSelectedModelOdj($event:any){

  if($event === true)
      this.loadlistePointsOJEvenement();

  this.showDialogModelOJ = false;

}

//********************************************************************************************************** */
// ********************* Traitement dialog Propositions membres ****************************************
//********************************************************************************************************** */

OnShowPropositionsMembresDialog(){

  this.showDialogPropMembres = true;

}

getValidatedPPOMembres($event:any){

  this.loadlistePointsOJEvenement();
}

closeDialogPPOMembres($event:any){

  this.showDialogPropMembres = false;
  this.nbrPropositionsMembre = $event > 0 ? $event : "0" ;

}

LoadNbrPropositionsOJEvenement(){

  this.propositionsMembresService.getListPropositionsPoEvenement(this.selectedEvenement.id).subscribe(
    (data) => {

            if(data){

              this.nbrPropositionsMembre = data.length>0 ?  data.length : "0";
            }
            else{
              this.nbrPropositionsMembre = "0";
            }
    },
    (error) => {
        console.log(error);
        this.nbrPropositionsMembre = "0";
    }
    )
}

//********************************************************************************************************** */
// ********************* Traitement dialog Points ajournés  *****************************************
//********************************************************************************************************** */

OnShowPoAjournesDialog(){
  this.showDialogPointsAjournes = true;

}

getImporterPoAjourner($event:any){

  this.loadlistePointsOJEvenement();

}

closeDialogPoAjournes($event:any){

  this.showDialogPointsAjournes = false;
  this.nbrPointsAjournes =  $event > 0 ? $event : "0";
}

LoadNbrPointsAjournesEvenement(){
  console.log('service before :' + this.selectedEvenement.id);
 this.pointOdreService.getListPoAjournesPreviousEvenements(this.selectedEvenement.id).subscribe(
    (data) => {

            if(data){

              this.nbrPointsAjournes = data.length>0 ?  data.length : "0";
              console.log('service after :' + this.nbrPointsAjournes);
            }
            else{
              this.nbrPointsAjournes = "0";
            }
    },
    (error) => {
        console.log(error);
        this.nbrPointsAjournes = "0";
    }
  );

}

//********************************************************************************************************** */
// ********************* Traitement dialog commentaires point ordre ****************************************
//********************************************************************************************************** */
sidebarCommentsVisible : boolean = false;
selectedPoCommentaires : any;

closeDialogPoCommentaires(event:any){

}

showCommentairesPoDialog(event :any, po:any){

  //Traitement du retirement du point ordre
  this.selectedPoCommentaires = po;
  this.sidebarCommentsVisible = true;

};


getDelaisValidationODJ(){
  try
  {
   return this.selectedEvenement.delaisEvenement?.reponseValidationPoints;

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

  this.messageService.add({ key: 'tstODJ', severity: severity , summary: summary , detail: detail });

}

}
