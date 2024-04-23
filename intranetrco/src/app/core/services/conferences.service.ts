import { Injectable } from '@angular/core';
import { Inscription,DBMocked } from '../models/models';
import { Observable, delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConferencesService {

  constructor() { }

  getMesInscriptions():Observable<Inscription[]> {
    return of(DBMocked.inscriptions).pipe(delay(3000));
  }
}
