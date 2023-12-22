import {Dossier} from "./dossier.model";

export interface PrivilegeDos {
    id: string;
    dossier: Dossier;
    privilege: string
}
