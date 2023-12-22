import { ModelOJ } from "../../model-ordre-jour/models/model-ordre-jour";
import { ModelDelai } from "../../model-delai/model/model-delai";
import { ModelProcess } from "../../model-process/models/model-process";

export interface TypeOrgane {
    id?: number;
    designation?: string;
    abreviation?: string;
    description?: string;
    quorum?: number;
    modelDelais?: ModelDelai;
    modelOrdreJour?: ModelOJ;
    modeleProcess?: ModelProcess;
}
