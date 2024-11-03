import { Component, inject } from '@angular/core';
import { EmailingService, MailingList } from '../../core/osmose-api-client';
import { AsyncPipe } from '@angular/common';
import { AutocompleteChipsComponent } from '../../components/autocomplete-chips/autocomplete-chips.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-email',
  standalone: true,
  imports: [AsyncPipe, MatCardModule,
    AutocompleteChipsComponent,
  ],
  templateUrl: './email.component.html',
  styleUrl: './email.component.scss'
})
export class EmailComponent {
  onlistChanged($event: MailingList[]) {
    throw new Error('Method not implemented.');
  }
  private readonly mailService = inject(EmailingService);
  list = this.mailService.apiEmailingListGet();

  aspectKeySelector = (x: MailingList | undefined): string => x?.id?.toString() ?? '0'
  aspectDisplayWith = (x: MailingList | undefined): string => x?.libelle ?? ''
}
