import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FilterMetadata, LazyLoadEvent, MessageService } from 'primeng/api';
import { UserLogService } from '../../services/user-log.service';
 import { Table } from 'primeng/table';
import { UserLog } from '../../model/user';

import { ApiResponse } from 'src/app/shared/models/shared';
import { DatePipe } from '@angular/common';
import * as FileSaver from 'file-saver';





@Component({
  selector: 'app-list-user-logs',
  templateUrl: './list-user-logs.component.html',
  styles: [`
    :host ::ng-deep .p-timeline-event-opposite {
        flex: 0;
        padding: 0 !important;
    }
`,]
})
export class ListUserLogsComponent {

  userLog: UserLog[] = [];

  modifiedUserLog: any[] = [];

  selectedUsers: UserLog[] = [];

  submitted: boolean = false;


  statuses: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  cols!: any[];

  exportColumns!:  any[];

  yearMonth: string = this.datePipe.transform(new Date(), 'yyyy-MM')!; ;
  selected_month: Date = new Date();


   @ViewChild('filter') filter!: ElementRef;
   @ViewChild('tableLog') tableLog!: ElementRef;
   @ViewChild("dt") dataTableComponent!: Table;



  constructor(private userLogService : UserLogService , private messageService: MessageService , private router : Router, private datePipe: DatePipe) {
  }

  ngOnInit(){
      this.fetchData();

      this.cols = [
        { field: 'login', header: 'Login' },
        { field: 'nameOfAction', header: 'Action' },
        { field: 'date', header: 'Date' },
        { field: 'detail', header: 'Detail' },

    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
 }




   // Function to fetch data from the server
  fetchData()
  {
    this.userLogService.getAllusersLogsByMonthYear(this.yearMonth)
      .subscribe(
         {
        next : (data: UserLog[]) => {
         this.userLog = data.map(item => {
          item.date = new Date(item.date!);
          item.userLogDetails.dateDebut = new Date(item.userLogDetails.dateDebut!);
          item.userLogDetails.dateFin = new Date(item.userLogDetails.dateFin!);
          // item.date = this.datePipe.transform(item.date, 'yyyy-MM-dd');
          // item.userLogDetails.dateDebut = this.datePipe.transform(item.userLogDetails.dateDebut, 'dd/MM/yyyy HH:mm:ss');
          // item.userLogDetails.dateFin = this.datePipe.transform(item.userLogDetails.dateFin, 'dd/MM/yyyy HH:mm:ss');
          return item;
        });
        // console.log('rrrrr', this.userLog);



         this.modifiedUserLog = this.userLog.map((userLogItem) => {
          let detail = `${userLogItem.userLogDetails.login} ${userLogItem.userLogDetails.nameOfAction}`;

          if (![0].includes(userLogItem.userLogDetails.actionsLogid!)) {
            detail += ` ${userLogItem.userLogDetails.titreAction}`;
          }

          if ([2, 3, 4, 8, 9, 10].includes(userLogItem.userLogDetails.actionsLogid!)) {
            detail += `Date debut: ${this.datePipe.transform(userLogItem.userLogDetails.dateDebut, 'yyyy-MM-dd HH:mm:ss')}, Date fin: ${this.datePipe.transform(userLogItem.userLogDetails.dateFin, 'yyyy-MM-dd HH:mm:ss')}`;}

            detail += ` En : ${this.datePipe.transform(userLogItem.date, 'yyyy-MM-dd HH:mm:ss')} , Adress ip : ${userLogItem.userLogDetails.adresseIp}`;
          return {
            Login: userLogItem.userLogDetails.login,
            Action: userLogItem.userLogDetails.nameOfAction,
            Date: userLogItem.userLogDetails.date,
            Detail: detail
          };
        });

        },
        error : (err : ApiResponse)=> {
          ;
        }
      }
      )
  }




  parseDetails(details: string) {
    return JSON.parse(details);
  }



   onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  async onSelectMonthChange (newMonth: Date) {
    // console.log("eeeeeeee", newMonth)
    this.yearMonth = await this.datePipe.transform(newMonth, 'yyyy-MM')!;
    this.fetchData();
  }


exportExcel() {
    import('xlsx').then((xlsx) => {
        const worksheet = xlsx.utils.json_to_sheet(this.modifiedUserLog);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, 'Liste des Logs des utilisateurs');
    });
}

saveAsExcelFile(buffer: any, fileName: string): void {
  let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  let EXCEL_EXTENSION = '.xlsx';
  const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
  });
  FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
}



  exportPdf() {
    import('jspdf').then((jsPDF) => {
        import('jspdf-autotable').then(({ default: autoTable }) => {
            const doc = new jsPDF.default('p', 'px', 'a4');
            const extractedData = this.userLog.map((userLogItem) => {
            let detail = `${userLogItem.userLogDetails.login} ${userLogItem.userLogDetails.nameOfAction}`;

            if (![0].includes(userLogItem.userLogDetails.actionsLogid!)) {
              detail += ` ${userLogItem.userLogDetails.titreAction}`;
            }



            if ([2, 3, 4, 8, 9, 10].includes(userLogItem.userLogDetails.actionsLogid!)) {
              detail += `
              Date debut: ${this.datePipe.transform(userLogItem.userLogDetails.dateDebut, 'yyyy-MM-dd HH:mm:ss')}
              Date fin: ${this.datePipe.transform(userLogItem.userLogDetails.dateFin, 'yyyy-MM-dd HH:mm:ss')}`;}

              detail += `
              En : ${this.datePipe.transform(userLogItem.date, 'yyyy-MM-dd HH:mm:ss')} ,
              Adress ip : ${userLogItem.userLogDetails.adresseIp}`;

            return {
                    login: userLogItem.userLogDetails.login || '',
                    nameOfAction: userLogItem.userLogDetails.nameOfAction || '',
                    date: this.datePipe.transform(userLogItem.date, 'yyyy-MM-dd HH:mm:ss') || '',
                    detail: detail || '',
                };
            });
            // (doc as any).autoTable(this.exportColumns, extractedData);
            autoTable(doc, { columns: this.exportColumns, body: extractedData });
            doc.save('Liste des Logs des utilisateurs.pdf');
        });
    });
}



}
