export interface Privilege {
  id ?: number ;
  codePrivilege ?: string ;
  description ?: string ;
  type ?: string ;
}

export interface Role {
  id ?: number ;
  nom ?: string ;
  description ?: string ;
  privileges ?: Privilege[] ;
}


export interface RoleDetails {
  role ?: Role ;
  privileges ?: Privilege[] ;
}
