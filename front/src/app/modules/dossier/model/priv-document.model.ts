import {Document} from "./document.model";

export interface PrivDocument {
    id: number,
    document: Document,
    privilege: string,
}
