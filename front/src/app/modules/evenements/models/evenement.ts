 export interface Evenement {
    id? : number;
    numero? : string;
    titre? : string;
    description? :string;
    emplacement? :string;

    dateDebut? : Date;
    dateFin? : Date;

    etat_date_ev? : string;
    etat? : string;
    annulerLe? : string;
    motifAnnulation? : String;
    publierLe? : string;

    odjPublier?:boolean;
    odjValide?:boolean;

    dateevPublier?:boolean;
    dateevValide?:boolean;

    access_depot_documents?:boolean;
    previsionnel? : boolean;
    remuneration? : boolean;
    isperiodique? : boolean;
    periodicite? : string;

    evenementId? : number;
    societeid? : number;
    societeCode? : string;
    typeOrganeId? : number;
    organeId? : number;
    typeEvenementId? : number;
    delaisEvenement? : any | null;
    //evenementPrevisionel : Evenement;

    typeOrgane? : any | null;
    organe? : any | null;
    typeEvenement? : any | null;
    ismandate ?: boolean ;

    currentSeance? : any | null;
    seances? : any[];

    listeMembres? : any[];
    membreConvocation? : any;

    alertesNotifs? : any[];
    convocations? : any[];
    evenementFonctionnalitesProcesses? : any[];
    privilegeEvenements? : string[];
    propositionDates? : any[];
    propositionPointordres? : any[];
    tachesEvenement? : any[];
    traitementPoints? : any[] | null;
    listePointsOrdre? :any[] | null;
    hasAccessIntervenant? : boolean;
    backgroundColor? : string;
    borderColor? : string;
		textColor? : string;

}

export const newEvenement:any = {
    titre : '',
    title :'',
    description : '',
    emplacement : '',

    dateDebut : new Date(),
    dateFin: new Date(),

    etat_date_ev : '',
    etat : '',

    previsionnel : true,
    remuneration : true,
    isperiodique: false,
    periodeFrom : new Date(),
    periodeTo : new Date(),
    periodicite: null,

    societeId : 0,
    typeOrganeId : 0,
    organeId :0,
    typeEvenementId : 0,
    typeOrgane : null,
    organe : null,
    typeEvenement : null,

    delaisEvenement : null,

    evenementFonctionnalitesProcesses : [],
    privilegeEvenements : [],
    tachesEvenement : [],
    traitementPoints : [],

  }

  export const evenementValidation:any = {

    titre : {label :'Titre', messageRequis : "Le titre de l'évènement est requis."},
    description : {label :'Déscription'},
    emplacement : {label :'Emplacement'},
    dateDebut : {label :'Date début', messageRequis : "La date de début de l'évènement est requise.", messageFormat : 'Le format de la date est incorrect, le format valide est <JJ/MM/AAAA>.' },
    dateFin: {label :'Date fin', messageRequis : "La date de fin de l'évènement est requise.", messageFormat : 'Le format de la date est incorrect, le format valide est <JJ/MM/AAAA>.' },
    etat_date_ev : {},
    etat : {},
    remuneration : {label :'Rémunérer?'},
    isperiodique : {label : 'Periodique?'},
    periodicite: {label : 'Periodicité'},
    typeOrgane: {label : 'Type organe'},
    organe: {label : 'Organe de gestion'},
    typeEvenement : {label : 'Type évènement'},


    titreDialog :{labelNew : 'Nouveau évènement', labelEdit : 'Modifier évènement', labelDetails : 'Détails évènement' },
    bouttonEnregistrer :{label : 'Enregistrer'},
    bouttonModifier :{label : 'Modifier'},
    bouttonSupprimer :{label : 'Supprimer'},
    bouttonExploiter : { label : 'Exploiter'},
  }

  export const evenementFilters:any = {

    societeid:  0,
    type_organeid :0,
    organeid : 0,
    dateFrom : '',
    dateTo : '',
    type_evenementid : 0,
    etat_evenement : null,
    isPrevisionnel : '',
    isRemunerer : "",
    isPeriodique : "",
    keyword : '',
    typeAcces : '',


  }

  export const evenementView:any = {
    showCalendar : true,
    applyFilters : false,
    listFilters : []
  }

  export var evenementListFilters:any[] = [];


  export const periodicite :any[] = [
    {id : 1, designation : 'Hébdomadaire', value : 'weekly'},
    {id : 2, designation : 'Mensuel', value : 'monthly'},
    {id : 3, designation : 'trimestriel', value : 'trimestrial'},
    {id : 4, designation : 'semestriel', value : 'semestrial'},
    {id : 5, designation : 'Annuel', value : 'Annual'}
  ];



  export const Jours :any[] = [{id : 7, designation : 'Dimanche', value : 'SUNDAY'},
  {id : 1, designation : 'Lundi', value : 'MONDAY'},
  {id : 2, designation : 'Mardi', value : 'TUESDAY'},
  {id : 3, designation : 'Mercredi', value : 'WEDNESDAY'},
  {id : 4, designation : 'Jeudi', value : 'THURSDAY'},

 ];
  export const typePeriodiciteMois :any[] = [{id : 1, designation : 'Numéro de jour', value : 'dayNumber'},
  {id : 2, designation : 'Premier', value : 'firstDay'},
  {id : 3, designation : 'Deuxième', value : 'secondDay'},
  {id : 4, designation : 'Toisième', value : 'thirdDay'},
  {id : 5, designation : 'Avant dernier', value : 'bLastDay'},
  {id : 6, designation : 'Dernier', value : 'lastDay'}
];

  export const numerosMoisTrimestre :any[] = [{id : 1, designation : 'Premier mois', value : '1'},
  {id : 2, designation : 'Deuxième mois', value : '2'},
  {id : 3, designation : 'Troisième mois', value : '3'}];

  export const numerosMoisSemestre :any[] = [
    ...numerosMoisTrimestre,
    {id : 4, designation : 'Quatrième mois', value : '4'},
    {id : 5, designation : 'Cinquième mois', value : '5'},
    {id : 6, designation : 'Sixième mois', value : '6'}

  ];

  export const numeroMoisAnnee:any[] = [{id : 1, designation : 'Janvier', value : '1'},
  {id : 2, designation : 'Février', value : '2'},
  {id : 3, designation : 'Mars', value : '3'},
  {id : 4, designation : 'Avril', value : '4'},
  {id : 5, designation : 'Mai', value : '5'},
  {id : 6, designation : 'Juin', value : '6'},
  {id : 7, designation : 'Juillet', value : '7'},
  {id : 8, designation : 'Août', value : '8'},
  {id : 9, designation : 'Septembre', value : '9'},
  {id : 10, designation : 'Octobre', value : '10'},
  {id : 11, designation : 'Novembre', value : '11'},
  {id : 12, designation : 'Décembre', value : '12'}
];


//'membre' : tous les organes dont il est membre
//'ownSociete' : tous les organes de sa société
//'allSocietes' : tous les organes de toutes les sociétés
//'canCreate' : tous les organes dont il a le privilèges de création d'un évènement
export type typeAccessOrgane = 'membre' | 'ownSociete' | 'allSocietes' | 'canCreate' | '';


export interface TypeOrgane{
    id : number;
    designation : string;
    abreviation : string;

    description?:string;
    quorum?: number;


    backgroundColor : string;
    borderColor : string;
    textColor : string;
  }

export interface TypeEvenement{
    id:number;
    designation: string;
}





