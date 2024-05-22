import { Injectable } from '@angular/core';
import { Inscription, DBMocked, Conference, Centre, TypeConference, HeureArrivee, HeureDepart, Lit, ParticipationTache } from '../models/models';
import { Observable, delay, merge, mergeMap, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConferencesService {

  constructor() { }

  get mesInscriptions(): Observable<Inscription[]> {
    return of(DBMocked.inscriptions).pipe(delay(300));
  }

  get conferences(): Observable<Conference[]> {
    return of(DBMocked.conferences).pipe(delay(300));
  }
  get centres(): Observable<Centre[]> {
    return of(DBMocked.centres).pipe(delay(300));
  }
  get types(): Observable<TypeConference[]> {
    return of(DBMocked.types).pipe(delay(300));
  }
  get lit(): Observable<Lit[]> {
    return of(DBMocked.lits).pipe(delay(100));
  }

  get heuresArrivee(): Observable<HeureArrivee[]> {
    return of(DBMocked.heureArrivees).pipe(delay(100));
  }

  get HeuresDepart(): Observable<HeureDepart[]> {
    return of(DBMocked.heureDeparts).pipe(delay(100));
  }

  get ParticipationTaches(): Observable<ParticipationTache[]> {
    return of(DBMocked.participationTaches).pipe(delay(100));
  }

  setInscription(inscription: Inscription): Observable<Inscription> {
    return this.InscriptionExist(inscription)
      .pipe(
        mergeMap(exist => {
          if (exist) return throwError(() => new Error('Inscription already exist'));
          let lit = DBMocked.lits.find(x => x.id === inscription.lit.id);
          let heureDepart = DBMocked.heureDeparts.find(x => x.id === inscription.heureDepart.id);
          let participation = DBMocked.participationTaches.find(x => x.id === inscription.participation.id);
          let heureArrivee = DBMocked.heureArrivees.find(x => x.id === inscription.heureArrivee.id);
          let conference = DBMocked.conferences.find(x => x.id === inscription.conference.id);
          if (!lit || !heureArrivee || !heureDepart || !participation || !conference) {
            return throwError(() => new Error('Invalid data'));
          }

          DBMocked.inscriptions.push({
            ...inscription,
            id: DBMocked.inscriptions.length + 1,
            lit: lit,
            heureArrivee: heureArrivee,
            heureDepart: heureDepart,
            participation: participation,
            conference: conference
          });
          return of(inscription).pipe(delay(100));
        })
      );
  }

  updateInscription(inscription: Inscription): Observable<Inscription> {
    return this.InscriptionExist(inscription).pipe(
      mergeMap(exist => {
        if (!exist) return throwError(() => new Error('Inscription does not exist'));

        let lit = DBMocked.lits.find(x => x.id === inscription.lit.id);
        let heureDepart = DBMocked.heureDeparts.find(x => x.id === inscription.heureDepart.id);
        let participation = DBMocked.participationTaches.find(x => x.id === inscription.participation.id);
        let heureArrivee = DBMocked.heureArrivees.find(x => x.id === inscription.heureArrivee.id);

        if (!lit || !heureArrivee || !heureDepart || !participation) {
          return throwError(() => new Error('Invalid data'));
        }

        let index = DBMocked.inscriptions.findIndex(x => x.id === inscription.id);
        if (index === -1) return throwError(() => new Error('Inscription does not exist'));
        DBMocked.inscriptions[index] = {
          ...inscription,
          lit: lit,
          heureArrivee: heureArrivee,
          heureDepart: heureDepart,
          participation: participation
        };
        return of(inscription).pipe(delay(100));
      })
    )
  }

  InscriptionExist(inscription: Inscription): Observable<boolean> {
    return of(DBMocked.inscriptions.map(x => x.conference)
      .some(x => x.id === inscription.conference.id)).pipe(delay(100));
  }
}
