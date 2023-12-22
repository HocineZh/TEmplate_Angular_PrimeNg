import {Document} from "../../document/models/document";
import {Evenement} from "../../evenements/models/evenement";
import {Action} from "./action.model";

export interface Notification {
    id: number,
    emetteurid: number,
    date: Date,
    type: string,
    action: Action,
    notifiable: Evenement | Document

}
