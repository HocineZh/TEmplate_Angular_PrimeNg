import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  extToMimes(ext : string) : string  {
    let type =""
    switch (ext) {
        case 'jpg':
        case 'png':
        case 'jpeg':
            type = 'image/jpeg'
            break;
        case 'txt':
            type = 'text/plain'
            break;
        case 'xls':
            type = 'application/vnd.ms-excel'
            break;
        case 'docx':
            type = 'application/msword'
            break;
        case 'xlsx':
            type = 'application/vnd.ms-excel'
            break;
        default:

    }
    return type;
  }

  generateFile (ext : string , name : string) : File {
    let _type = this.extToMimes(ext.toLowerCase());
    const blob = new Blob([], { type: _type});
    return new File([blob],name);
  }

  getIconFile(name ?: String) {
    let icon ={
      icon : "",
      color : ""
    };
    let ext = name?.split(".")[1] ? name?.split(".")[1].toLowerCase() : ""
    switch (ext) {
        case "doc" :
        case "docx" :
          icon = {
            icon : "pi pi-file-word",
            color : "blue"
          }
          break ;
        case "pdf" :
          icon = {
           icon :"pi pi-file-pdf" ,
           color : "red"
          }
          break ;
        default :
        icon = {
          icon :"pi pi-file-pdf" ,
          color : "red"
         }
         break ;
    }

    return icon;
  }
}
