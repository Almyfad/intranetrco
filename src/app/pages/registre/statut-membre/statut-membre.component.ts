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

  getStatusColor(): string {
    if (!this.statutMembre?.code) {
      return 'gray';
    }

    const code = this.statutMembre.code as NullableOfStatutsMembres;

    if (code === NullableOfStatutsMembres.Present) {
      return 'green';
    } else if (code === NullableOfStatutsMembres.Suivi) {
      return 'blue';
    } else if (code === NullableOfStatutsMembres.Demissionnaire) {
      return 'orange';
    } else if (code === NullableOfStatutsMembres.Decede) {
      return 'gray';
    }
    
    return 'gray';
  }

  getStatusIcon(): string {
    if (!this.statutMembre?.code) {
      return 'point';
    }

    const code = this.statutMembre.code as NullableOfStatutsMembres;

    if (code === NullableOfStatutsMembres.Present) {
      return 'point';
    } else if (code === NullableOfStatutsMembres.Suivi) {
      return 'eye-spark';
    } else if (code === NullableOfStatutsMembres.Demissionnaire) {
      return 'user-cancel';
    } else if (code === NullableOfStatutsMembres.Decede) {
      return 'user-x';
    }
    
    return 'point';
  }
}
