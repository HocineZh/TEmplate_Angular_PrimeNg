import { TypeOrgane } from "../../type-organe/model/type-organe";
import { Societe } from "../../hierarchy/model/hierarchy";

export interface Organe {
    id?: number;
    titre?: string;
    description?: string;
    typeOrgane?: TypeOrgane;
    societe?: Societe;
    mandate ?: boolean ;
}
