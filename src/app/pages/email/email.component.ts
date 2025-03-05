import { Component, inject, ViewChild } from '@angular/core';
import { EmailService, MailingListOutput } from '../../core/osmose-api-client';
import { AsyncPipe } from '@angular/common';
import { AutocompleteChipsComponent } from '../../components/autocomplete-chips/autocomplete-chips.component';
import { MatCardModule } from '@angular/material/card';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { EmailEditorComponent, EmailEditorModule } from 'angular-email-editor';
import { MatButtonModule } from '@angular/material/button';
import sample from './sample.json';


@Component({
  selector: 'app-email',
  standalone: true,
  imports: [AsyncPipe, MatCardModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule,
    AutocompleteChipsComponent, EmailEditorModule
  ],
  templateUrl: './email.component.html',
  styleUrl: './email.component.scss'
})


export class EmailComponent {
  private readonly mailService = inject(EmailService);
  private fb = inject(FormBuilder);
  form = this.fb.group({
    titreCampagne: [null as string | null, Validators.required],
    objet: [null as string | null, Validators.required],
    description: [null as string | null],
    content: [null as string | null, Validators.required],
  });

  listSelected$ = new BehaviorSubject<MailingListOutput[]>([])
  onlistChanged($event: MailingListOutput[]) {
    this.listSelected$.next($event);
  }

  list = this.mailService.apiEmailListGet();

  aspectKeySelector = (x: MailingListOutput | undefined): string => x?.id?.toString() ?? '0'
  aspectDisplayWith = (x: MailingListOutput | undefined): string => x?.libelle ?? ''

  allmail: Observable<number> = this.listSelected$.pipe(
    switchMap(l => this.mailService.apiEmailCountRecipientPost(l.map(x => x.id ?? 0)),
    ));

  totalRecipient: Observable<number> = this.listSelected$.pipe(
    switchMap(l => this.mailService.apiEmailCountRecipientPost(l.map(x => x.id ?? 0)),
    ));


  @ViewChild('editor')
  private emailEditor: EmailEditorComponent | undefined;

  onSubmit() {

    this.emailEditor?.editor.exportHtml((data) => {
      console.log('exportHtml', data)
      this.mailService.apiEmailCampaignSendPost(false, {
        name: this.form.value.titreCampagne ?? '',
        subject: this.form.value.objet ?? '',
        sender: {
          email: 'guadeloupe@rose-croix-d-or.org',
          name: 'RCO MAIL TEST',
        },
        htmlContent: data.html,
        mails: ["lary.sene@gmail.com"]
      }).subscribe();
    }
    );
  }

  editorReady($event: Event) {
    console.log('editor ready', $event);
  }
  editorLoaded($event: Event) {
    console.log('editor loaded', $event);
    this.emailEditor?.editor.loadDesign(sample.design);
  }



}
