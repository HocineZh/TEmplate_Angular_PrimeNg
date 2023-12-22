
import { Folder } from "../../dossier/model/folder";
import { Famille } from "../../orientation/models/famille";
import { Version } from "../../document/models/version";



export interface Document {
    id?: number;
    nom?: string;
    dateCreation?: String;
    dossier?: Folder;
    typeDocuement?: Famille;
    version?: Version[];
    size ?: number;
}

export interface DocumentDetails {
  idDocument : number ;
  version : number ;
}

  export interface UtilisationUlt{
    id?: number;
    titre?: string;
  }

  export interface UtilisationUltRequest{
    idDoc ?: number;
    selectedutil ?: UtilisationUlt[] ;
  }
