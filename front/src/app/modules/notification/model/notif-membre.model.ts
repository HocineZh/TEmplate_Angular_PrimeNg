import {Notification} from "./notification.model";

export interface NotifMembre {
    id: number,
    etat: boolean,
    dateLecture: null | Date,
    idmail: null | string,
    isrecu: boolean,
    alerteNotif: Notification
}
