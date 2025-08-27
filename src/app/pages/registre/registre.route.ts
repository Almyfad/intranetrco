import { Routes } from '@angular/router';
import { ElevesComponent } from './fiches/eleves/eleves.component';

export const RegistreRoutes: Routes = [
  {
    data: {
      title: 'Fiche Élèves', 
      urls: [
        { title: 'Accueil', url: '/' },
        { title: 'Fiche Élèves', },
      ],
    },
    path: 'fiches/eleves',
    component: ElevesComponent,
  },
  {
    data: { title: 'Détail Élève' },
    path: 'fiches/eleves/:id',
    component: ElevesComponent,
  },
];
