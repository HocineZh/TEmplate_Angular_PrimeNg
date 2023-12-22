import {User} from "../../users/model/user";

export interface UserPermission {
    user: User;
    privilege: string;
}
