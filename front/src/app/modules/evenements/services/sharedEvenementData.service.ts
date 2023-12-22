import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { OrganeService } from '../../organes/services/organe.service';
import { TypeOrganeService } from '../../type-organe/service/type-organe.service';
import { EventBusService } from 'src/app/shared/services/event-bus.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiConstant } from 'src/app/shared/constant';
import { environment } from 'src/environments/environment';
import { typeAccessOrgane } from '../models/evenement';
import { TypeEvenementService } from '../../type-evenement/services/type-evenement.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})

export class sharedEvenementDataService {

 private obsTypesOrganes = new BehaviorSubject<any[]>([]);
 private obsTypesEvenement = new BehaviorSubject<any[]>([]);
 private obsSocietes = new BehaviorSubject<any[]>([]);
 private obsToday = new BehaviorSubject<string>('');
 private obsPrivilegesEvenement = new BehaviorSubject<string[]>([]);
 private obsTestobser = new BehaviorSubject<number>(0);




 typesOrganes = this.obsTypesOrganes.asObservable();
 typesEvenement = this.obsTypesEvenement.asObservable();
 societes = this.obsSocietes.asObservable();
 today = this.obsToday.asObservable();
 privilegesEvenement = this.obsPrivilegesEvenement.asObservable();

 /* testobserver = this.obsTestobser.asObservable(); */

 constructor(private http: HttpClient, private organeService : OrganeService, private typeOrganeService: TypeOrganeService, private typeEvenementService :TypeEvenementService, private eventBus : EventBusService) {

}

/* loadObservableTest(){
    var i=1;
    timer(2000).subscribe(x => {
        this.obsTestobser.next(i);
        i++;
      }
    );


} */




 loadTypeOrganesUser(types_organes: any) {
 this.obsTypesOrganes.next(types_organes);
 }

 loadTypeEvenements(types_evenements: any) {
    this.obsTypesEvenement.next(types_evenements);
 }

 loadSocietes(societes: any) {
  this.obsSocietes.next(societes);
}

loadTodayDate(today: string) {
        this.obsToday.next(today);
}

loadEvenementPrirvileges(privileges: string[]) {
  this.obsPrivilegesEvenement.next(privileges);
}

hasEvenementPrivilges(hprivileges : string[]) : any{

  let privilegesEVUser : String[] = this.obsPrivilegesEvenement.getValue();


  if( hprivileges!== null){
        let existPrv = hprivileges.some(value => {
          return privilegesEVUser.includes(value);
        });


        return existPrv;

  }else{
          return false;
  }
}

hasPrivilegeCreateInOrgane() : Observable<any> {


  return this.http.get<any>(
   environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'hasPrivilegeCreateInOrgane',
   httpOptions
  );
}


getCalculatedDateDelais(date:string, delais:number, isPlus:boolean){

    try{

      if(!date || date === null || !delais)
       return '';

      let dateFrom:Date;
      let dateDelais : Date;

      //parse date from
      dateFrom = new Date(Date.parse(date));

      dateDelais =  (isPlus) ? new Date(dateFrom.setDate(dateFrom.getDate() + delais)) : new Date(dateFrom.setDate(dateFrom.getDate() - delais)) ;
      return dateDelais;


    }catch(ex){
      return '';
    }


  }

  public getClassEtatEvenement(etat :any){

    switch (etat){

      // pour les états évènement
      case 'CREATION' :
          return 'creation';

      case 'PLANIFIER' :
          return 'creation';

      case 'PUBLIER' :
          return 'publier';

      case 'EN COURS' :
            return 'encours';

      case 'EN SEANCE' :
            return 'encours';

      case 'TERMINER' :
        return 'terminer';

      case 'CLOTURER' :
        return 'cloturer';

      case 'TRANSFORMER' :
        return 'terminer';

      case 'ANNULER' :
        return 'annuler';

      // pour les états traitement point ordre
      case 'NON TRAITER' :
          return 'proposer';

      case 'TRAITER' :
        return 'valide';

      case 'AJOURNER' :
        return 'ajourner';

    }

    return '';

  }

  public getformattedEtatEvenement(etat :any){

    switch (etat){

      case 'CREATION' :
        return 'PLANIFICATION';
     case 'EN SEANCE' :
        return 'EN SEANCE';
     case 'TERMINER' :
        return 'TERMINÉ';
     case 'CLOTURER' :
        return 'CLOTURÉ';
      case 'ANNULER' :
        return 'ANNULÉ';
      case 'PLANIFIER' :
        return 'PLANIFICATION';
      case 'TRANSFORMER' :
        return 'EXPLOITÉ';
      case 'EN COURS' :
        return 'EN COURS';
    }

    return etat;

  }

  public getformattedEtatPo(etat :any){

    switch (etat){

      case 'NON TRAITER' :
          return 'Non traité';
     case 'TRAITER' :
          return 'Traité';
     case 'AJOURNER' :
          return 'Ajourné';
      case 'ANNULER' :
          return 'Annulé';

    }

    return etat;

  }


  public getColorEtatEvenement(etat :any){

    switch (etat){

      // pour les états évènement
      /* case 'CREATION' :
          return '#e57f1a';

      case 'PLANIFIER' :
          return '#e57f1a'; */

      case 'CREATION' :
          return '#0589c6';

      case 'PLANIFIER' :
          return '#0589c6';
      case 'PUBLIER' :
          return '#0589c6';

      /* case 'EN COURS' :
            return '#c605c6'; */
       case 'EN COURS' :
              return '#e57f1a';

      case 'EN SEANCE' :
            return '#c605c6';

      case 'TERMINER' :
        return '#0d763e';

      case 'CLOTURER' :
        return '#0d763e';

      case 'TRANSFORMER' :
        return '#0d763e';

      case 'ANNULER' :
        return '#d80000';

    }

    return '';

  }

  getAvatarMembreLabel(nom:any, prenom:any){

    let label = "";
    if(nom && nom.length>0)
    {
      label = label + nom[0].toUpperCase();
    }
    if(prenom && prenom.length > 0){
      label = label + prenom[0].toUpperCase() ;
    }
    console.log("getAvatarMembreLabel --> " + label );
    return label;

  }


  loadSharedDataEvenement(typeAccessOrg:typeAccessOrgane){


        this.organeService.getAllOrganesMembre(typeAccessOrg).subscribe(
          {
              next : (data : any[])=> {
                this.loadTypeOrganes(data);
              },
              error : (err : any) =>{
              console.log(err);
            }
        });

       //initialiser les types évènements
       this.typeEvenementService.getTypesEvenementExceptCA().subscribe(
        {
            next : (data : any)=> {
                let results = data?.map((te:any) => {
                    return {label : te.designation, value : te};
                });
                this.loadTypeEvenements(results);
            },
            error : (err : any) =>{
                console.log(err);
                this.loadTypeEvenements([]);
            }
        }
       );
  }

  loadTypeOrganes(organes : any[]){


    let type_organes : any[] = [];
    let societes : any[]=[];

    //this.sharedDataEvService.loadTypeEvenements(results);
    let allTypeOg = organes.map((og: any) => og.typeOrgane);
    let allSocietes = organes.map((og:any) => og.societe);

    //get type organes sans duplication
    const map = new Map(allTypeOg.map(pos => [pos.id, pos]));
    type_organes = [...map.values()];

    //get societes sans duplication
    const mapSocietes = new Map(allSocietes.map(pos => [pos.id, pos]));
    societes = [...mapSocietes.values()];

    //traitement background colors des types organes
    let typeOrganesStyles = [{ backgroundColor: 'rgba(22, 160, 133,0.9)', borderColor: 'white', textColor: 'white' },
    { backgroundColor: 'rgba(72, 113, 247, 0.9)', borderColor: 'white', textColor: 'white' },
    { backgroundColor: 'rgba(235, 149, 50,0.9)', borderColor: 'white', textColor: 'white' },
    { backgroundColor: 'rgba(140, 20, 252, 0.9)', borderColor: 'white', textColor: 'white' },
    { backgroundColor: 'rgba(243, 225, 107, 0.9)', borderColor: 'white', textColor: 'white' },
    { backgroundColor: 'rgba(94, 143, 105, 0.59)', borderColor: 'white', textColor: 'white' },
    { backgroundColor: 'rgba(91, 85, 102, 0.46)', borderColor: 'white', textColor: 'white' },
    { backgroundColor: 'rgba(132, 121, 199, 0.56)', borderColor: 'white', textColor: 'white' },
    { backgroundColor: 'rgba(135, 114, 114, 0.36)', borderColor: 'white', textColor: 'white' },
    { backgroundColor: 'rgba(109, 171, 73, 0.51)', borderColor: 'white', textColor: 'white' },
    { backgroundColor: 'rgba(94, 45, 105, 0.59)', borderColor: 'white', textColor: 'white' },
    { backgroundColor: 'rgba(91, 85, 10, 0.46)', borderColor: 'white', textColor: 'white' },
    { backgroundColor: 'rgba(26, 121, 199, 0.56)', borderColor: 'white', textColor: 'white' },
    { backgroundColor: 'rgba(111, 11, 114, 0.36)', borderColor: 'white', textColor: 'white' },
    { backgroundColor: 'rgba(244, 110, 30, 0.51)', borderColor: 'white', textColor: 'white' }];


    //Ajout des organes pour chaque type organes
    let fto = type_organes.map(to => {

      let organesO = organes.filter((obj) => {
        return obj.typeOrgane?.id === to.id;
      });

      return { ...to, organes: organesO };
    });

    //Ajout des couleurs pour chaques typeOG
    let i = 0;
    fto.forEach(element => {
      element.backgroundColor = typeOrganesStyles[i].backgroundColor;
      element.borderColor! = typeOrganesStyles[i].borderColor;
      element.textColor! = typeOrganesStyles[i].textColor;
      i++;
    });


    //load typesOG
    let typeOrganes = fto;
    this.loadTypeOrganesUser(typeOrganes);
    //console.log(typeOrganes);

    //load societes
    this.loadSocietes(societes);
    //console.log(societes);


  }


}




