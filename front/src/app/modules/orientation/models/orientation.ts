import { Famille } from "./famille";
import { Document } from "../../document/models/document";
import { Evenement } from "../../evenements/models/evenement";
import { pointOrdre } from "../../evenements/models/pointOrdre";

export interface Orientation {
    id?: number;
    intitule?: String;
    type?: String;
    contenu?: String;
    motif ?: string;
    //evenementId ?: Evenement;
    pointOrdreId ?: pointOrdre;
    parametrageGeneralByFamilleid?: Famille;
    documentByDocumentid?:Document;
    dateEcheance?: any;

}
