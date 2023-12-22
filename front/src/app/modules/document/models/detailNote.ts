
import { Note } from './note';

export interface DetailNote {
    id: number;
    societe: string;
    structure: string;
    login: string;
    //image: string;
   // status: string;
    evenement: string;
    notes: Note[];
    //lastSeen: string;
}