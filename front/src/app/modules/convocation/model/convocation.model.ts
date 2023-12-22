import { FileResponse } from "../../membres/model/membre";

export interface CurrentReponse {
    remplacentMembreInfo : RemplacentMembreInfo ;
    convocationInfo : ConvocationInfo ;
}


export interface ConvocationInfo {
  id ?: number ;
  reponse ?: string ;
  dateReponse ?: Date ;
}


export interface RemplacentMembreInfo {
    membre ?: number  ;
    file ?: FileResponse ;
    nomComplet ?: string ;
    fonctionMembre ?: string ;
}


export interface RemplcamentDetail {
  nomParent ?: string ;
  nomRemplacent ?: string;
  fonctionRemplacent ?: string;
  etat ?: string;
  idUserRemplacent ?: number ;
  convocationSeance ?: number ;
  idFile ?: number ;
  nomDoc ?: string ;
  idProfil ?: number ;
  id ? : number ;

}

export interface MandatRemplacement {
  societe ?: string,
  siege ? : string ,
  nomCompletMembre  ?: string,
  nomCompletRemplacant ?: string ;
  dateSeance ?: string,
  ordreDuJour ?: string[]
}
