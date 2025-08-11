import { Component, Input } from '@angular/core';
import { NullableOfStatutsMembres, StatutMembreDTO } from 'src/app/core/helios-api-client';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-statut-membre',
  imports: [CommonModule, MatTooltipModule],
  templateUrl: './statut-membre.component.html',
  styleUrl: './statut-membre.component.scss'
})
export class StatutMembreComponent {
  @Input() statutMembre?: StatutMembreDTO;

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
}
