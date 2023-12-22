import { Etats } from "src/app/shared/models/etats";
import { Evenement } from "../../evenements/models/evenement";

export interface Seance {
  id ?: number ;
  typeQuorum ?: string ;
  quorumAtteint ?: boolean ;
  dateDebut : Date ;
  dateFin : Date ;
  lieu ?: string ;
  etatsByEtatsid ?: Etats ;
  evenementByEvenementid?: Evenement;
  numeroSeance? : number;
  validateQuorum?: boolean;

  //completed: boolean;
}
