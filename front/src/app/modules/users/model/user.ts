import { Structure } from "../../hierarchy/model/hierarchy";
import { Role } from "../../permissions/model/permission";

export interface User {
  id ?: number ;
  login ?: string ;
  password ?: string ;
  fax ?: string ;
  structure ?: Structure ;
  nom ?: string ;
  prenom ?: string ;
  phone ?: string ;
  dateNaiss ?: Date ;
  adresse ?: string ;
  email ?: string ;
  fonction ?: string ;
  pays ?: string ;
  active ?: number ;
  etatCivil ?: string;
}

export interface UserDetails  {
  roles ?: Role[];
  user ?:User ;
}


export interface Pays {
  nom ?: string ;
  designation ?: string ;
  image ?: string ;
}



export interface userLogDetailsItem  {
  actionsLogid?: number;
  adresseIp?: string;
  date?: Date | string;
  dateDebut?: Date | string;
  dateFin?: Date | string;
  id?: number;
  isinstantane?: boolean;
  login?: string;
  nameOfAction?: string;
  titreAction?: string;
}


export interface UserLog {
  id?: number;
  date?: Date | string  ;
  adresseIp?: string;
  userLogDetails: userLogDetailsItem;
}


