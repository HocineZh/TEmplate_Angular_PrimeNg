import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PointOrdreService } from '../../services/pointOrdre.service';
import { EditOdjComponent } from '../edit-odj/edit-odj.component';

@Component({
  selector: 'app-commentaires-po',
  templateUrl: './commentaires-po.component.html',
  styleUrls: ['./commentaires-po.component.scss']
})
export class CommentairesPoComponent {

  @Input() selectedPo : any;
  @Input() selectedEvenement : any;
  @Input() listAll : boolean = false;
  @Output() closeDialogEvent = new EventEmitter<any>();
  @Output() validatedPPOEvent = new EventEmitter<any>();

  commentaire : string = '';


  constructor(public parent : EditOdjComponent, private poService : PointOrdreService){

    //console.log("comments");
    //console.log(this.selectedPo.Commentaires);
  }

  addCommentairePointOrdre(){

    this.poService.addCommentaireToPointOrdre(this.selectedEvenement.id, this.selectedPo.id, this.commentaire).subscribe(
      (data) => {
         this.selectedPo.commentaires.push(data);

      },
      (error) => {
          console.log(error);


      });

  }

  getMembreComment(comment:any){
   /*  console.log("comment-membres-convocated");
    console.log(comment);
    console.log(this.selectedEvenement.listeMembres); */
    let membreConvocated = this.selectedEvenement.listeMembres.filter((el:any) => el.convocation_id === comment.convocation.id);
    //console.log(membreConvocated);
    if(membreConvocated.length>0)
    return membreConvocated[0].membre_nom + ' ' + membreConvocated[0].membre_prenom;
    else return '';

  }

  getAvatarMembreLabel(comment:any){
    let membreConvocated = this.selectedEvenement.listeMembres.filter((el:any) => el.convocation_id === comment.convocation.id);
    let nom = '';
    let prenom = '';
    if(membreConvocated.length>0){
    nom = membreConvocated[0].membre_nom;
    prenom = membreConvocated[0].membre_prenom;
    }

    let label = "";
    if(nom && nom.length>0)
    {
      label = label + nom[0];
    }
    if(prenom && prenom.length > 0){
      label = label + prenom[0].toLowerCase() ;
    }

    return label;
  }

  clearText() {
    this.commentaire = '';
    }
}
