import {User} from "../../users/model/user";
import {DocumentVersion} from "./document-version.model";
import {TypeDocument} from "./type-document.model";

export interface Document {
    
        id: number,
        nom: string,
        dateCreation: Date,
        typeDocuement: TypeDocument,
        mimeType: string;
        owner: User;
        version: DocumentVersion[];
}
