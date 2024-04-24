import { Injectable } from '@angular/core';
import { Inscription, DBMocked, Conference, Centre, TypeConference } from '../models/models';
import { Observable, delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConferencesService {

  constructor() { }

  getMesInscriptions(): Observable<Inscription[]> {
    return of(DBMocked.inscriptions).pipe(delay(1000));
  }

  getConferences(): Observable<Conference[]> {
    return of(DBMocked.conferences).pipe(delay(100));
  }
  getCentres(): Observable<Centre[]> {
    return of(DBMocked.centres).pipe(delay(1000));
  }
  getTypes(): Observable<TypeConference[]> {
    return of(DBMocked.types).pipe(delay(1000));
  }
}
