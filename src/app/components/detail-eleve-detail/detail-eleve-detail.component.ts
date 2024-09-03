import { Component, Input } from '@angular/core';
import { MembreOutput } from '../../core/osmose-api-client';
import { DetailEleveComponent } from "../detail-eleve/detail-eleve.component";



@Component({
  selector: 'app-detail-eleve-detail',
  standalone: true,
  imports: [ DetailEleveComponent,],
  templateUrl: './detail-eleve-detail.component.html',
  styleUrl: './detail-eleve-detail.component.scss',
})
export class DetailEleveDetailComponent {

  @Input() eleve!: MembreOutput;
}
