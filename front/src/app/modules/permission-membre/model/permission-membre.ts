export interface Profil {
  id ?: number ;
  nom ?: string ;
  description ?: string ;
  duplicated ?: boolean ;
}

export interface Privileges {
  id ?: number ;
  codePriv ?: string ;
  description ?: string ;
  type ?: string ;
}

export interface ProfilDetails {
  profil ?: Profil ;
  privileges ?: Privileges[];
}
