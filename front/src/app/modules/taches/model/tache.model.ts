export interface Tache {
    id : number,
    nom : string,
    description : string,
    ordre_execution : number
}

export interface Modele {
    id ?: number,
    nom ?: string,
    taches ?: Tache[]
}

export interface ListeTaches{
    id : number,
    titre: string,
    tasks : any[]
}

export interface TachesCard {
    id: string;
    nom : string;
    echeance: string;
    titre: string;
    //listeTaches?: ListeTaches;
    taux?: number;
    ordre_execution : number;
}

export interface Etat {
    listId: string;
    titre: string;
    couleur: string;
    first : boolean;
    cardsResponse: TachesCard[];
}

export interface TacheReponse{
    id: number,
    nom: string,
    echeance: string,
    ordreExecution: Number,
    suiviTache: SuiviTache[]
}

export interface EtatSuivi{
    id: number,
    etat: string,
    couleur: string,
    type: string
}

export interface SuiviTache{
    id: number,
    date: string,
    taux: number,
    etatsByEtatsid: EtatSuivi
}

export interface EventResponse{
    id : number,
    titre : string,
}

export interface SubMenu{
    id : number,
    label: string,
    items?: MenuItem,
}

export interface MenuItem{
    id : number,
    label: string,
    command: any
}
