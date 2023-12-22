import { MembreService } from './../../services/membre.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { Membre, MembreResponse } from '../../model/membre';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-list-membre',
  templateUrl: './list-membre.component.html',
  styleUrls: ['./list-membre.component.scss']
})
export class ListMembreComponent {
  membres : Membre [] = [] ;
  organeTitre !: string ;
  isMAndate : boolean = true  ;
  idOrgane !: number ;
  etats = [{value : 1 , text :"true-icon pi-check-circle text-green-500" , name : "Activé"} ,{value : 0 , text :"false-icon pi-times-circle text-pink-500" , name:"Désactivé"} ]
  constructor(private router : Router ,private membreService : MembreService , private route : ActivatedRoute) {
    this.idOrgane = Number(this.route.snapshot.paramMap.get('id')!) ;
  }

  ngOnInit(): void {
    this.membreService.getAllMembresByOrgane(this.idOrgane).subscribe({
      next : (data : MembreResponse) => {
        this.membres = data.membres ;
        this.organeTitre = data.organeTitre ;
        this.isMAndate = data.mandate ;
      }
    })
  }


  //Exporter les membres en fichier excel
  exporter() {
    import('xlsx').then((xlsx) => {
        const worksheet = xlsx.utils.json_to_sheet(this.formatMembreBeforeExport(this.membres));
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, '');
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, "liste_des_membres_" + this.organeTitre + EXCEL_EXTENSION);
  }

  //Formatter la liste des membres avant l'exporter
  formatMembreBeforeExport(membres :Membre[]) {
    let membresResult: { Utilisateur: string | undefined; Profil: string | undefined; Date_debut : Date , Date_fin : Date ; Actif: string; }[] = [] ;
    membres.forEach(
      (membre) => {
        membresResult.push({Utilisateur : membre.membre , Profil : membre.profil , Date_debut : membre.date_debut ,Date_fin : membre.date_fin  , Actif : membre.etat ==1 ? "Activé" : "Désactivé"})
      }
    )
    return membresResult ;
  }


  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
