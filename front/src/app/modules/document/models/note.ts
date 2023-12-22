import { UserInfoResponse } from "../../authentication/model/login";
import { User } from "../../users/model/user";

export interface Note {
    id ?: number;
    contenu?: string;
    owner?: string;
    ownerId?: number;
    createdAt?: Date;
    docId?: number;
}
