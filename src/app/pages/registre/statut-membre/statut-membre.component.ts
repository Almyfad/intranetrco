import { Component, Input } from '@angular/core';
import { NullableOfStatutsMembres, StatutMembreDTO } from 'src/app/core/helios-api-client';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-statut-membre',
  imports: [CommonModule, MatTooltipModule, TablerIconsModule],
  templateUrl: './statut-membre.component.html',
  styleUrl: './statut-membre.component.scss'
})
export class StatutMembreComponent {
  @Input() statutMembre?: StatutMembreDTO;
  @Input() showTooltip: boolean = true;
  @Input() showLabel: boolean = false;

  get statusColor(): string {
    return getStatusColor(this.statutMembre?.code);
  }

  get statusIcon(): string {
    return getStatusIcon(this.statutMembre?.code);
  }
}

export function getStatusColor(statutMembreCode: NullableOfStatutsMembres | null | undefined): string {
  switch (statutMembreCode) {
    case NullableOfStatutsMembres.Present:
      return 'green';
    case NullableOfStatutsMembres.Suivi:
      return 'blue';
    case NullableOfStatutsMembres.Absent:
      return 'red';
    case NullableOfStatutsMembres.Demissionnaire:
      return 'orange';
    case NullableOfStatutsMembres.Decede:
      return 'gray';
    default:
      return 'gray';
  }
}

export function getStatusIcon(statutMembreCode: NullableOfStatutsMembres | null | undefined): string {
  switch (statutMembreCode) {
    case NullableOfStatutsMembres.Present:
      return 'point';
    case NullableOfStatutsMembres.Suivi:
      return 'eye-star';
    case NullableOfStatutsMembres.Absent:
      return 'user-cancel';
    case NullableOfStatutsMembres.Demissionnaire:
      return 'user-question';
    case NullableOfStatutsMembres.Decede:
      return 'user-x';
    default:
      return 'point';
  }
}
