import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PointOrdreService } from '../../services/pointOrdre.service';

@Component({
  selector: 'app-add-point-oj',
  templateUrl: './add-point-oj.component.html',
  styleUrls: ['./add-point-oj.component.scss']
})
export class AddPointOJComponent implements OnInit  {

  
  newPointOrdre = { id :0, titre  : "", description : "" , isPropose : false, idPointModel : 0 };

  
  @Input() idEvenement? : number | null;
  @Output() isPointOrdreSavedEvent = new EventEmitter<any>();


  constructor(private poService : PointOrdreService){ }
 
  ngOnInit(): void {
       
  }
  
  addPointOJToEvenement(){
    
    if (!this.validatePo()) {

      //Traitement de la validation du titre

      return;
    }
    
    this.poService.addPointOrdreToEvenement(this.idEvenement, this.newPointOrdre).subscribe(
      (data) => {
                
               if(data){
              
                this.isPointOrdreSavedEvent.emit({success : true, data : data});
                this.newPointOrdre = { id :0, titre  : "", description : "" , isPropose : false, idPointModel : 0 };

              }
              else{
              
                  this.isPointOrdreSavedEvent.emit({success : false, message : "Une erreur inattendue s'est produite!"});
                  
              }
      },
      (error) => {
          console.log(error);   
          this.isPointOrdreSavedEvent.emit({success : false, message : error.message});    

      }

  );

     
  

  }


  //validation des données
  validatePo(){
    
    return true;
  }

  clearText() {
    this.newPointOrdre.titre = '';
    }
    

}
