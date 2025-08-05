import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, output, SimpleChanges, ViewChild } from '@angular/core';
import { MailingListOutput, MembreOuput } from '../../../../core/osmose-api-client';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DeleteConfirmComponent } from "../../../../components/delete-confirm/delete-confirm.component";
import { MatIconModule } from '@angular/material/icon';



interface ListDataSource {
  id: number | null | undefined;
  position: number;
  nom: string | null | undefined;
  prenom: string | null | undefined;
  email: string | null | undefined;

}
@Component({
  selector: 'app-email-list-table',
  standalone: true,
  imports: [DeleteConfirmComponent, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule],
  templateUrl: './email-list-table.component.html',
  styleUrl: './email-list-table.component.scss'
})
export class EmailListTableComponent implements AfterViewInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource<MembreOuput>(this.mailingList.membres ?? []);
    this.dataSource.paginator = this.paginator
  }
  deleteMembre(membre: MembreOuput) {
    this.delete.emit(membre)
  }
  @Input() mailingList: MailingListOutput = {} as MailingListOutput;
  @Input() readonly = false;
  @Output() delete = new EventEmitter<MembreOuput>();
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  ngAfterViewInit() {


  }
  dataSource: MatTableDataSource<MembreOuput> = new MatTableDataSource<MembreOuput>([]);
  get displayedColumns(): string[] {
    if (this.readonly) return ['nom', 'prenom', 'email'];
    return ['nom', 'prenom', 'email', 'id']
  };

}



