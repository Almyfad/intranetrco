import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Membre, MembreOutput } from '../../core/osmose-api-client';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-fiche-eleve',
  standalone: true,
  imports: [MatCardModule,MatButtonModule,MatExpansionModule,MatIconModule],
  templateUrl: './fiche-eleve.component.html',
  styleUrl: './fiche-eleve.component.scss'
})
export class FicheEleveComponent {
delete(arg0: number|undefined) {
throw new Error('Method not implemented.');
}
edit(arg0: number|undefined) {
throw new Error('Method not implemented.');
}
  @Input() eleve!: MembreOutput;
}
