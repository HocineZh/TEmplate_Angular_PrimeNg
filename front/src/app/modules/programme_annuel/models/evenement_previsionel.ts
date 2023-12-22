import { Evenement, TypeEvenement, TypeOrgane } from "../../evenements/models/evenement";

 export interface evenementPrevisionel extends Evenement {

}

export const newEvenementPrevisionnel:evenementPrevisionel = {


    titre : '',
    description : '',
    dateDebut : new Date(),
    dateFin: new Date(),
    emplacement : '',
    previsionnel : true,
    remuneration : true,
    isperiodique: false,
    periodicite: '',

    societeid : 0,
    //typeOrgane : <TypeOrgane>{},
    typeOrganeId : 0,
    //typeEvenement : <TypeEvenement>{},
    typeEvenementId : 0,
    typeOrgane : null,
    organe : null,
    typeEvenement : null,

    //delaisEvenement :[],
    traitementPoints : []

  }

  export const evenementPrvValidation:any = {

    titre : {label :'Titre', messageRequis : "Le titre de l'évènement est requis."},
    description : {label :'Déscription'},
    dateDebut : {label :'Date de début', messageRequis : "La date de début de l'évènement est requise.", messageFormat : 'Le format de la date est incorrect, le format valide est <JJ/MM/AAAA>.' },
    dateFin: {label :'Date de fin', messageRequis : "La date de fin de l'évènement est requise.", messageFormat : 'Le format de la date est incorrect, le format valide est <JJ/MM/AAAA>.' },
    emplacement : {label :'Emplacement'},
    etat_date_ev : {},
    etat : {},
    remuneration : {label :'Rémunération?'},
    datePlanification :{label :'Planification de date'},
    isperiodique : {label : 'Periodique?'},
    periodicite: {label : 'Periodicité'},
    typeOrgane: {label : 'Type organe'},
    organe : {label : 'Organe de gestion'},
    typeEvenement : {label : 'Type évènement'},
    etatEvenement : {label : 'Etat évènement'},


    titreDialog :{labelNew : 'Nouveau évènement prévisionnel', labelEdit : 'Modifier évènement', labelDetails : 'Détails évènement prévisionnel' },
    bouttonEnregistrer :{label : 'Enregistrer'},
    bouttonModifier :{label : 'Modifier'},
    bouttonSupprimer :{label : 'Supprimer'},
    bouttonExploiter : { label : 'Exploiter'},

  }

  export const evenementPrvFilters:any = {

    societeid:  0,
    type_organeid :0,
    dateFrom : '',
    dateTo : '',
    type_evenementid : 0,
    etat_evenement : null,
    isRemunerer : "",
    isperiodique : "",
    keyword : null,
    typeAcces : ''

  }

  export const evenementPrvView:any = {        
    applyFilters : false,
    listFilters : []
  }

