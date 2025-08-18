import { Component, Input, input, computed } from '@angular/core';
import { MembreDTO, NullableOfStatutsMembres, StatutMembreDTO } from 'src/app/core/helios-api-client';
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
  membre = input<MembreDTO| null>();
  @Input() showTooltip: boolean = true;
  @Input() showLabel: boolean = false;

  statusColor = computed(() => getStatusColor(this.membre()?.statut?.code));

  statusIcon = computed(() => getStatusIcon(this.membre()?.statut?.code));
}

export function getStatusColor(membreCode: NullableOfStatutsMembres | null | undefined): string {
  switch (membreCode) {
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
