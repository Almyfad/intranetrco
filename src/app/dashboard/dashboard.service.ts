import { inject, Injectable } from '@angular/core';
import { ConferenceService } from '../core/osmose-api-client';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly ConferenceService = inject(ConferenceService);
  constructor() { }

  mesconferences() {
    return this.ConferenceService.apiConferenceConferenceGet();
  }
}
