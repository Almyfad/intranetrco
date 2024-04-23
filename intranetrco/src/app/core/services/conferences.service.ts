import { Injectable } from '@angular/core';
import { Inscription, DBMocked, Conference } from '../models/models';
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
    return of(DBMocked.conferences).pipe(delay(1000));
  }
}
