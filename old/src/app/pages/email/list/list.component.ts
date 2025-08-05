import { animate, style, transition, trigger } from '@angular/animations';
import { Component, inject, Input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { EmailService, MailingListOutput, MembreOuput, } from '../../../core/osmose-api-client';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { of, BehaviorSubject, Subject } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { toSignal } from '@angular/core/rxjs-interop';

import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AutocompleteChipsComponent, AutocompleteChipsDataSource, AutocompleteChipsInput } from "../../../components/autocomplete-chips/autocomplete-chips.component";
import { EditableLabelComponent } from "../../../components/editable-label/editable-label.component";
import { DeleteConfirmComponent } from '../../../components/delete-confirm/delete-confirm.component';
import { MenuService } from '../../../core/services/menu.service';
import { EmailListTableComponent } from "./email-list-table/email-list-table.component";
import { EmailListAddButtonComponent } from "./email-list-add-button/email-list-add-button.component";
export type ExpansionColor = 'parents' | 'enfants' | undefined;

enum Mode { detail, edit }
@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MatInputModule, MatExpansionModule, MatCardModule, MatIconModule, MatButtonModule,
    FormsModule, ReactiveFormsModule, MatAccordion, DeleteConfirmComponent,
    MatAutocompleteModule, AutocompleteChipsComponent, EditableLabelComponent, EmailListTableComponent, EmailListAddButtonComponent],
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
  readonly openedPanel = signal<number | null | undefined>(null);
  membertoadd: number[] = [];
  private readonly mailService = inject(EmailService)
  private refreshSubject = new Subject<void>(); // déclencheur de rafraîchissement
  searchContacts = (pattern: string | null | undefined) =>
    pattern ? this.mailService.apiEmailContactSearchGet(pattern).pipe(map(x => {
      return x.map((x) => ({
        id: x.id!,
        item: x,
        displayWith: `${x.nom} ${x.prenom}`,
      }))
    }))
      : of([])

  newList: string = '';

  searchContactOptions: AutocompleteChipsInput<MembreOuput> = {
    label: 'Membre',
    placeholder: 'Rechercher un membre',
    formControlName: 'membre',
    datasource: new AutocompleteChipsDataSource<MembreOuput>({
      asyncDataPatern: this.searchContacts
    })
  }


  onsaveAddMembre(id: number | null | undefined) {
    if (!id) return;
    this.mailService.apiEmailListIdMemberAddPost(id, this.membertoadd)
      .pipe(
        tap(() => this.refreshSubject.next()))
      .subscribe()
  }

  onlistChanged($event: MembreOuput[]) {
    this.membertoadd = $event.map(x => x.id ?? 0);
  }

  addList($event: void) {
    this.mailService.apiEmailListPost({ libelle: this.newList, centreId: this.menuService.selectedCenter.id }).subscribe({
      next: () => {
        this.refreshSubject.next();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  readonly dialog = inject(MatDialog);
  private readonly menuService = inject(MenuService)
  editables: Array<Number> = [];

  mailingLists$ = this.refreshSubject.pipe(
    startWith(null),
    switchMap(() => this.menuService.selectedCenter$.pipe(
      switchMap(centre => centre ? this.mailService.apiEmailCentreCentreIdListsGet(centre.id ?? 0) : of([])),
      tap(x => {
        let i = 0;
        return x.map(x => {
          x.id ??= --i;
          return x;
        })
      })
    ))
  );
  mailingLists = toSignal(this.mailingLists$, { initialValue: {} as MailingListOutput[] })

  onpanelOpen(list: MailingListOutput) {
    this.openedPanel.set(list.id);
  }

  isPanelOpen(list: MailingListOutput): boolean {
    return this.openedPanel() === list.id;
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

  onsave(list: MailingListOutput,) {
    this.swithView(list.id ?? 0);
    this.mailService.apiEmailListIdPut(list.id ?? 0, { libelle: list.libelle }).subscribe(() => {
      this.refreshSubject.next();
    });
  }


  delete(list: MailingListOutput) {
    this.mailService.apiEmailListIdDelete(list.id ?? 0).subscribe(() => {
      this.refreshSubject.next();
    });
  }
  deleteMembre(membre: MembreOuput, list: MailingListOutput) {
    this.mailService.apiEmailListIdPut(list.id ?? 0, { membresId: list.membres?.map(x => x.id).filter((x): x is number => x !== null && x !== undefined && x !== membre.id) })
      .pipe(tap(() => this.refreshSubject.next()))
      .subscribe();
  }

  deleteMembre2($event: MembreOuput) {
    throw new Error('Method not implemented.');
  }
}

