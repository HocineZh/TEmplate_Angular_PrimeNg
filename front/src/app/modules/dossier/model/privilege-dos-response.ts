import {Document} from "./document.model";
import {Dossier} from "./dossier.model";
import {PrivDocument} from "./priv-document.model";
import {PrivilegeDos} from "./privilege-dos";

export interface childrenDosResponse{
    dossier: Dossier;
    children: PrivilegeDos[];
    documents: PrivDocument[]
}
