import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { delay, map } from 'rxjs';
import { Inscription } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class InscriptionsService {
  private http = inject(HttpClient)
  private readonly url = 'http://localhost:3000';
  constructor() { }

  getMesInscriptions() {
    return this.http.get<Inscription[]>(`${this.url}/mesinscriptions`)
    .pipe(delay(1000) );
  }
}
