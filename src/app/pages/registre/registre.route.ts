import { Routes } from '@angular/router';
import { ElevesComponent } from './fiches/eleves/eleves.component';

export const RegistreRoutes: Routes = [
  {
    data : { title: 'Fiche Élèves' },
    path: 'fiches/eleves',
    component: ElevesComponent,
  },
  {
    data: { title: 'Fiche Élèves' },
    path: 'fiches/eleve/detail/:id',
    component: ElevesComponent,
  },
];
