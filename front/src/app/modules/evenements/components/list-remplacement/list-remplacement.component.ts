import { MessageService } from 'primeng/api';
import { ConvocationService } from './../../../convocation/services/convocation.service';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Evenement } from '../../models/evenement';
import { RemplcamentDetail } from 'src/app/modules/convocation/model/convocation.model';
import { ApiResponse } from 'src/app/shared/models/shared';
import { Table } from 'primeng/table';
import { User } from 'src/app/modules/users/model/user';
import { DocumentService } from 'src/app/modules/document/services/document.service';

@Component({
  selector: 'app-list-remplacement',
  templateUrl: './list-remplacement.component.html',
  styleUrls: ['./list-remplacement.component.scss']
})
export class ListRemplacementComponent {

  @Input() selectedEvenement : Evenement = {};
  loading: boolean = true;
  remplacents !: RemplcamentDetail[] ;
  currentRemplacent !: RemplcamentDetail ;
  @ViewChild('filter') filter!: ElementRef;
  validerRemplacentPreview : boolean = false ;
  users !: User[] ;
  user!: User ;
  constructor(private convocationService : ConvocationService , private messageService : MessageService , private documentService : DocumentService  ) {

  }

  ngOnInit(): void {

    this.initLIstRemplacent();
    this.convocationService.initRemplacentPossible().subscribe(
      {
        next : (data : User[]) => {
          this.loading = false ;
          this.users = data ;
        },
        error : (err : ApiResponse)=> {
        }
      }
    );
  }

  initLIstRemplacent () {
    this.convocationService.getListRemplcament(this.selectedEvenement.id!).subscribe(
      {
        next : (data : RemplcamentDetail[]) => {
          this.loading = false ;
          this.remplacents = data ;
        },
        error : (err : ApiResponse)=> {
        }
      }
    )
  }


  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  validerRemplacement(remplacent : RemplcamentDetail) {
    this.validerRemplacentPreview = true ;
    this.currentRemplacent = remplacent ;
  }

  valider() {
    this.validerRemplacentPreview = false ;
    this.convocationService.addRemplacement(this.currentRemplacent.id!,this.user.id!,this.currentRemplacent.convocationSeance!,this.currentRemplacent.idFile!,this.currentRemplacent.idProfil!)
    .subscribe(
      {
        next : (data : ApiResponse) => {
          this.messageService.add({ severity: 'success', summary: 'Message', detail: data.message , key : 'tstMbr' }) ;
          this.validerRemplacentPreview = false ;
          this.initLIstRemplacent();
          this.currentRemplacent = {} ;
        },
        error : (err : ApiResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.message , key : 'tstMbr' }) ;
        }
      }
    )
  }

  download(idFile : number , name: string) {
    this.documentService.downloadFile(idFile).subscribe(
      {
        next : (data : Blob) =>{
          let url = window.URL.createObjectURL(data);
          let a = document.createElement('a');
          a.download = name ;
          document.body.appendChild(a);
          a.href = url;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
        }
      }
    )
  }
}
