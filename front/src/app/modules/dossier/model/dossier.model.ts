import {User} from "../../users/model/user";

export interface Dossier {
    id: number,
	designation: string,
    owner: User;

}
