import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TypeOrgane } from '../../models/evenement';
import { EvenementService } from '../../services/evenement.service';
import { ModelOrdreJourService } from 'src/app/modules/model-ordre-jour/services/model-ordre-jour.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-importer-model-odj',
  templateUrl: './importer-model-odj.component.html',
  styleUrls: ['./importer-model-odj.component.scss']
})
export class ImporterModelODJComponent implements OnInit {

  @Input() selectedEvenement : any;
  @Input() typeOrgane!: TypeOrgane;
  @Output() selectedModelEvent = new EventEmitter<any>();

  

  listModelsODJ : any[] = [];
  selectedMODJ :any = {};
  
  listTargetPointsMODJ : any = [];

  isListeModelVide : boolean = true;
  isListeModelArray : boolean = false;

  searchValue: string = '';
  

  constructor(private evenementService: EvenementService, private messageService: MessageService, private modelOJService : ModelOrdreJourService ){}

  ngOnInit(): void {
  
    // load liste des models ODJ de l'organe
    
    if(!this.typeOrgane || this.typeOrgane === null)
    {
      this.isListeModelVide = true;
      return;
    }
 
    this.evenementService.getModelsODJbyOrganeId(this.typeOrgane.id).subscribe(

    (data) => {
        
        if(data){ 
              
          if(Array.isArray(data)){
            this.listModelsODJ =[...data];
            this.isListeModelArray = true;
            this.changeView(this.listModelsODJ[0]);
            
          }else{
            this.selectedMODJ = data;
             this.isListeModelArray = false; 
             this.changeView(this.selectedMODJ);
          } 
              
          this.isListeModelVide = false;
           
       
        }
        else{
                    
           console.log( "Une erreur inattendue s'est produite!");
           this.isListeModelVide = true;
        }
    },
    (error) => {
  
        //Erreur lors du chargement de l'évènement 
        this.isListeModelVide = true;  
        console.log(error.message);
      }
    );
  
   
  }

  filter() {
    let filtered: any[] = [];
    for (let i = 0; i < this.listModelsODJ.length; i++) {
        let modelOdj = this.listModelsODJ[i];
        if (modelOdj.titre.toLowerCase().indexOf(this.searchValue.toLowerCase()) == 0 || modelOdj.description.toLowerCase().indexOf(this.searchValue.toLowerCase()) == 0) {
            filtered.push(modelOdj)
        }
    }

    //this.filteredUsers = [...filtered];
}

changeView(modelOdj: any) {

  //selectionner le model
  this.selectedMODJ = modelOdj; 
 
  //importer les points du modèle
  this.getListePointsModelODJ(modelOdj.id);


 
}

getListePointsModelODJ(idModelOdj:any){

  //exploiter le service
  
  this.modelOJService.getJoinedPointModelById(idModelOdj).subscribe(

    (data) => {        
        if(data){
           
            console.log("Points ordres model : ");
            console.log(data);
            if(Array.isArray(data)){
              this.selectedMODJ.listePointsMODJ = [...data].map(arrItem => {return {poId : arrItem[2], poTitre : arrItem[3], poDescription : arrItem[4] }});
              
            }else{
              this.selectedMODJ.listePointsMODJ = [data];
            }
            
           
       
        }
        else{
                    
           console.log( "Une erreur inattendue s'est produite!");
           this.selectedMODJ.listePointsMODJ = [];
        }
    },
    (error) => {
  
        //Erreur lors du chargement des points du model ODJ 
        this.selectedMODJ.listePointsMODJ = []; 
        console.log(error.message);
      }
    );
    
   

}

handleExitDialogModelOJ(){

  this.selectedModelEvent.emit(false);
}

handlImporterModelOJ(){

  if(!this.selectedMODJ){
    this.showErrorToast("Erreur ","Erreur lors de l'importation du modèle Ordre du jour !");
  }else if(this.listTargetPointsMODJ === null || this.listTargetPointsMODJ.length === 0){
    this.showErrorToast("Erreur ","La liste des points ordres à importer est vide  !");
  }else
  {
    //map la liste target
    let i=1;
    let mapedPoList:any[] = [];
     this.listTargetPointsMODJ.forEach((element:any) => {
         mapedPoList.push({idPo : element.poId, ordrePo : i});    
      i++;
     });
    //Service importation ou creation traitement points ordre du jour a partir d'un modèle 
    this.evenementService.createOrdreJourFromModel(this.selectedEvenement.id, mapedPoList).subscribe(
      (data) => {
              if(data){
                 console.log("imported Points ordre");
                  console.log(data);
                  this.showSuccessToast("Importation modèle","Le modèle des points a été importé avec success.");
                  //en cas ou il y'a des points, envoyer true
                  this.selectedModelEvent.emit(true);
              }
              else{
                  this.showErrorToast("Erreur!", "Une erreur inattendue s'est produite!");
                  this.selectedModelEvent.emit(false);
              }
      },
      (error) => {
          console.log(error);
          this.showErrorToast("Erreur modification", error.message);
          this.selectedModelEvent.emit(false);

      }

    );   
  }
  
  

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

}
