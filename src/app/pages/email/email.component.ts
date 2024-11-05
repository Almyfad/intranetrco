import { Component, inject } from '@angular/core';
import { EmailingService, MailingList } from '../../core/osmose-api-client';
import { AsyncPipe } from '@angular/common';
import { AutocompleteChipsComponent } from '../../components/autocomplete-chips/autocomplete-chips.component';
import { MatCardModule } from '@angular/material/card';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { EmailEditorModule } from 'angular-email-editor';

@Component({
  selector: 'app-email',
  standalone: true,
  imports: [AsyncPipe, MatCardModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule,
    AutocompleteChipsComponent, EmailEditorModule
  ],
  templateUrl: './email.component.html',
  styleUrl: './email.component.scss'
})


export class EmailComponent {
  editorReady($event: Event) {
    throw new Error('Method not implemented.');
  }
  editorLoaded($event: Event) {
    throw new Error('Method not implemented.');
  }
  exportHtml() {
    throw new Error('Method not implemented.');
  }
  listSelected$ = new BehaviorSubject<MailingList[]>([])
  onlistChanged($event: MailingList[]) {
    this.listSelected$.next($event);
  }
  private readonly mailService = inject(EmailingService);
  list = this.mailService.apiEmailingListGet();

  aspectKeySelector = (x: MailingList | undefined): string => x?.id?.toString() ?? '0'
  aspectDisplayWith = (x: MailingList | undefined): string => x?.libelle ?? ''


  totalRecipient: Observable<number> = this.listSelected$.pipe(
    switchMap(l => this.mailService.apiEmailingCountRecipientPost(l.map(x => x.id ?? 0)),
    ));
}
