import { Etats } from "src/app/shared/models/etats";
import { Structure } from "../../hierarchy/model/hierarchy";
import { User } from "../../users/model/user";
import { Orientation } from "./orientation";
import { List } from "pspdfkit";

export interface OrientationStructureSuivi {
    id?: number;
    orientationByOrientationid?: Orientation;
    selectedUsers?: User[];
    selectedStructures?: Structure[];
    typeSuivi?: string;
    detailOrientation? : string;
}
export interface SuiviOrientation {
    id?: number;
    taux?: number;
    date?: Date;
    delai?: any;
    etatsByEtatsid?: Etats;
    orientationStructureSuivi?: OrientationStructureSuivi;
    motif?: string;
}



export interface SuiviOrientationDetail {
    id?: number;
    orientation_id?: number;
    intitule?: string;
    contenu?: string;
    type?: string;
    dateEcheance?: Date;
    typeSuivi?: string;
    date?: Date;
    etatsid?: string;
    delai?: Date;
    taux?: number;
    motif?: string;
    structureid?: string;
    userid?: string;
    couleurs?: string;
    pointordreid?: number;
    designation?: string;
    evenementid?: number;
    titre?: string;
}


export interface OrientationStructureSuiviU {
    id?: number;
    orientationByOrientationid?: Orientation;
    userByUserid?: User;
    structureByStructureid?: Structure;
    typeSuivi?: string;
    detailOrientation? : string;
}
