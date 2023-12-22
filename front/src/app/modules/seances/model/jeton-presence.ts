import { Seance } from "./seance";

export interface JetonPresence {
    id ?: number ;
    somme : number ;
    convocation : number ;
}

export interface ListPresent {
    somme? : number ;
    convocationId ? : number ;
    membreFonction ? : String;
    membreNom?   : String;
    profilNom ? : String;
    remplacantNom ? : String;
    present ? : boolean;
    jetonRemis ? : boolean;

}
