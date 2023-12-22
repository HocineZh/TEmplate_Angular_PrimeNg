import { Organe } from "../../organes/model/organe";
import { Profil } from "../../permission-membre/model/permission-membre";
import { User } from "../../users/model/user";

export interface MembreRequest {
  idUser ?: number ;
  profil ?: number ;
  date_debut_mandat ?: Date ;
  date_fin_mandat ?: Date ;
  fichier_just ?: File ;
}

export interface MembreResponse {
  organeTitre : string ;
  mandate : boolean ;
  membres : Membre [];
}
export interface Membre {
  etat ?: number ;
  profil ?:  string ;
  membre ?: string ;
  date_debut : Date;
  date_fin : Date;
}


export interface MembreInfo {
  idMembre ?: number ;
  nomComplet ?: string ;
}


export interface InitMembreDataResponse {
  users : User[];
  organes :any[] ;
  profils : Profil[] ;
}

export interface EditMembreResponse {
  idUser ?: number ;
  idMembre ?: number ;
  profil ?: number ;
  date_debut_mandat ?: Date ;
  date_fin_mandat ?: Date ;
  document : FileResponse ;
  actif ?: number ;
}

export interface FileResponse {
  size ?: number ;
  nom ?: string ;
  extension ?: string ;
  idFile ?: number ;
}

export interface DetailsMembres {
  convocation_id ?: number,
            convocation_date ?: Date,
            etat_validation_date ?: string,
            etat_validation_odj ?: string,
            profil_nom ?: string,
            membre_id ?: number,
            user_id ?: number,
            membre_nom ?: string,
            membre_prenom ?: string,
            membre_etatCivil ?: string,
            membre_fonction ?: string,
            membre_societe ?: string,
            user_actif ?: number,
            mandat_id ?: number,
            mandat_dateDebut ?: Date,
            mandat_dateFin ?: Date,
            membre_actif ?: number,
            propDate_id ?: number,
            propDate_date ?: Date,
            propDate_motif ?: string,
            reponse_presence ?: string,
            idFile ?: number ;
            nom_doc ? : string ;
            membre ?: boolean ;
}

export interface MembrePresent{
  userid ?: number ;
  membre_id ?: number ;
  login?: string ;
  profil_nom?: string ;
  date_reponse?: Date ;
  convocation_id?: number ;
}


