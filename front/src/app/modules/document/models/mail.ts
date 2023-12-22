import { MembreRequest } from "../../membres/model/membre";

export interface MailContent{
  titre ?: string;
 content ?: string;
 selectedMembers ?: MembreRequest[];
}