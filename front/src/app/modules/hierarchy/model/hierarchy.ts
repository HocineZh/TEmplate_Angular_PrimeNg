import { User } from "../../users/model/user";

export interface Societe {
  id ?: number  | null;
  code ?: string ;
  raisonSocial ?: string ;
  siege ?: string ;
  structures ?: Structure[] ;
}

export interface Structure {
  id ?: number | null;
  chargeOrientation ?: User ;
  code ?: string ;
  nom ?: string ;
  societe ?: Societe ;
}
