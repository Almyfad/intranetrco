import { animate, style, transition, trigger } from '@angular/animations';
import { Component, inject, Input, OnInit, signal, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { EmailService, MailingListOutput, MembreOuput, MembreOutput, } from '../../../core/osmose-api-client';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { map, Observable, shareReplay, of, BehaviorSubject } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../components/dialog/dialog.component';

import { debounceTime, switchMap, tap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AutocompleteChipsComponent } from "../../../components/autocomplete-chips/autocomplete-chips.component";
export type ExpansionColor = 'parents' | 'enfants' | undefined;

enum Mode { detail, edit }
@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MatInputModule, MatExpansionModule, MatCardModule, MatIconModule, AsyncPipe, MatButtonModule,
    MatTableModule, MatPaginatorModule, FormsModule, ReactiveFormsModule, MatAccordion,
    MatAutocompleteModule, AutocompleteChipsComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  animations: [
    trigger('toogleView', [
      transition(':enter', [
        style({
          opacity: 0,
          height: '0px',
          transform: 'translateX(100%)',
        }),
        animate('500ms', style(
          {
            opacity: 1,
            height: '*',
            transform: 'translateX(0)'
          }))
      ]),
      transition(':leave', [
        style({
          opacity: 1,
          height: '*',
          transform: 'translateX(0)',
        }),
        animate('500ms', style(
          {
            opacity: 0,
            height: '0px',
            transform: 'translateX(-100%)'
          }))
      ]),
    ],
    )]
})
export class ListComponent {


  @Input() color: ExpansionColor = undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  readonly openedPanel = signal<number | null | undefined>(null);
  readonly addingMembreId = signal<number | null | undefined>(null);
  membertoadd: number[] = [];
  private readonly mailService = inject(EmailService)
  updateMailingLists: BehaviorSubject<string> = new BehaviorSubject<string>("");

  searchContacts = (pattern: string | null | undefined) => pattern ? this.mailService.apiEmailContactSearchGet(pattern) : of([])
  aspectKeySelector = (x: MembreOuput | undefined): string => x?.id?.toString() ?? '0'
  aspectDisplayWith = (x: MembreOuput | undefined): string => `${x?.nom ?? ''} ${x?.prenom ?? ''}`

  openFormAddContact(arg0: number | null | undefined) {
    this.addingMembreId.set(arg0);
  }
  onsaveAddMembre(id: number | null | undefined) {
    if (!id) return;
    this.mailService.apiEmailListIdMemberAddPost(id, this.membertoadd)
      .pipe(tap(() => this.updateMailingLists.next('new member added')))
      .subscribe()
  }
  closeFormAddContact() {
    this.addingMembreId.set(-1);

  }
  onlistChanged($event: MembreOuput[]) {
    this.membertoadd = $event.map(x => x.id ?? 0);
  }

  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = ['position', 'nom', 'prenom', 'email', 'id'];
  dataSources = new Map<number, MatTableDataSource<ListDataSource>>([]);
  editables: Array<Number> = [];

  mailingLists = this.updateMailingLists
    .pipe(
      switchMap(() => this.mailService.apiEmailListGet()),
      shareReplay(1))

  onpanelOpen(list: MailingListOutput) {
    this.openedPanel.set(list.id);
    this.getMembers(list.id ?? 0).subscribe(members => {
      const dataSource = this.dataSources.get(list.id ?? 0);
      if (dataSource) {
        dataSource.paginator ??= this.paginator;
        dataSource.data = members;
      }
    });
  }

  isPanelOpen(list: MailingListOutput): boolean {
    return this.openedPanel() === list.id;
  }
  isaddingMembre(list: MailingListOutput): boolean {
    return this.addingMembreId() === list.id;
  }

  getdataSource(listid: number | null | undefined): MatTableDataSource<ListDataSource> {
    if (!this.dataSources.has(listid ?? 0)) {
      this.dataSources.set(listid ?? 0, new MatTableDataSource<ListDataSource>([]));

    }
    return this.dataSources.get(listid ?? 0) ?? new MatTableDataSource<ListDataSource>([]);
  }

  getMembers(listid: number): Observable<ListDataSource[]> {
    return this.mailingLists
      .pipe(map(list => list.find(x => x.id === listid)?.membres ?? []))
      .pipe(map(members => members.map((x, i) => ({ position: i + 1, nom: x.nom, prenom: x.prenom, email: x.email, id: x.id })))

      );
  }

  isEditMode(id: number | null | undefined): boolean {
    if (id === null || id === undefined) {
      return false;
    }
    return this.editables.includes(id);
  }

  swithView(id: number) {

    if (this.editables.includes(id)) {
      this.editables = this.editables.filter(x => x !== id);
    } else {
      this.editables.push(id);
    }
  }

  onedit(list: MailingListOutput, event: Event) {
    event.stopPropagation();
    this.swithView(list.id ?? 0);
  }
  onsave(list: MailingListOutput, event: Event) {
    event.stopPropagation();
    this.swithView(list.id ?? 0);
    this.mailService.apiEmailListIdPut(list.id ?? 0, { libelle: list.libelle }).subscribe(() => {
      this.mailingLists = this.mailService.apiEmailListGet();
    });
  }
  oncancel(list: MailingListOutput, event: Event) {
    event.stopPropagation();
    this.swithView(list.id ?? 0);
  };


  ondelete(list: MailingListOutput, event: Event) {
    event.stopPropagation();
    this.openDialogDeleteList(list);
    return;
  }

  delete(list: MailingListOutput) {
    this.mailService.apiEmailListIdDelete(list.id ?? 0).subscribe(() => {
      this.dataSources.delete(list.id ?? 0);
      this.mailingLists = this.mailService.apiEmailListGet();
    });
  }

  openDialogDeleteList(list: MailingListOutput, enterAnimationDuration: string = '300ms', exitAnimationDuration: string = '300ms'): void {
    this.dialog.open(DialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        title: 'Suppression',
        message: ['Voulez-vous vraiment supprimer cette liste ?'],
        actions: [
          { label: 'Annuler' },
          {
            label: 'Confirmer', initial: true, callback: () => {
              this.delete(list);
            }
          }
        ]
      }
    });
  }

  ondeleteMembre(id: number, list: MailingListOutput, event: Event) {
    event.stopPropagation();
    this.openDialogDeleteMembre(id, list);
  }

  deleteMembre(id: number, list: MailingListOutput) {
    this.mailService.apiEmailListIdPut(list.id ?? 0, { membresId: list.membres?.map(x => x.id).filter((x): x is number => x !== null && x !== undefined && x !== id) })
      .pipe(tap(() => this.updateMailingLists.next('member deleted')))
      .subscribe();
  }
  openDialogDeleteMembre(id: number, list: MailingListOutput, enterAnimationDuration: string = '300ms', exitAnimationDuration: string = '300ms'): void {
    this.dialog.open(DialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        title: 'Suppression',
        message: ['Voulez-vous vraiment supprimer ce membre ?'],
        actions: [
          { label: 'Annuler' },
          {
            label: 'Confirmer', initial: true, callback: () => {
              this.deleteMembre(id, list);
            }
          }
        ]
      }
    });
  }
}

interface ListDataSource {
  id: number | null | undefined;
  position: number;
  nom: string | null | undefined;
  prenom: string | null | undefined;
  email: string | null | undefined;

}
