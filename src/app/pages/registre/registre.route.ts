import { Routes } from '@angular/router';
import { ElevesComponent } from './fiches/eleves/eleves.component';
import { ParvisComponent } from './fiches/parvis/parvis.component';
import { ContactsComponent } from './fiches/contacts/contacts.component';
import { JeunessesComponent } from './fiches/jeunesses/jeunesses.component';
import { JeunesRosicruciensComponent } from './fiches/jeunes-rosicruciens/jeunes-rosicruciens.component';

const buildUrlsFiches = (child: string) => {
  return {
    urls: [
      { title: 'Registre > ' },
      { title: 'Fiches > ' },
      { title: child }
    ]
  };
};

export const RegistreRoutes: Routes = [
  { data: { title: 'Fiche Élèves', ...buildUrlsFiches('Élèves') }, path: 'fiches/eleves', component: ElevesComponent },
  { data: { title: 'Parvis', ...buildUrlsFiches('Parvis') }, path: 'fiches-parvis', component: ParvisComponent },
  { data: { title: 'Contacts', ...buildUrlsFiches('Contacts') }, path: 'fiches-contacts', component: ContactsComponent },
  { data: { title: 'Jeunesses', ...buildUrlsFiches('Jeunesses') }, path: 'fiches-jeunesses', component: JeunessesComponent },
  { data: { title: 'Jeunes Rosicruciens', ...buildUrlsFiches('Jeunes Rosicruciens') }, path: 'fiches-jeunes-rosicruciens', component: JeunesRosicruciensComponent },
  { data: { title: 'Détail Élève'}, path: 'fiches/eleves/:id', component: ElevesComponent },
];

