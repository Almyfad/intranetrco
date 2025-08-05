import { Injectable } from '@angular/core';
import { Conference, Inscription } from '../models/models';

export enum CurrentMode { editInscription, ajoutInscription };
@Injectable({
  providedIn: 'root'
})
export class InscriptionConferenceService {

  mode: CurrentMode | undefined = undefined;
  mesinscriptions: Inscription[] | undefined = undefined;
  conference: Conference | undefined = undefined;

  get isEditable(): boolean { return this.mode === CurrentMode.editInscription }
  get isInscription(): boolean { return this.mode === CurrentMode.ajoutInscription }


  constructor() { }

  reset() {
    this.mode = undefined;
    this.conference = undefined;
    this.mesinscriptions = undefined;
  }

  set Mode(mode: CurrentMode) {
    this.mode = mode;
  }
  get inscription() {
    return this.mesinscriptions?.find(x => x.conference.id === this.conference?.id);
  }
  set Conference(conference: Conference) {
    this.conference = conference;
  }

  set MesInscriptions(inscriptions: Inscription[]) {
    this.mesinscriptions = inscriptions;
  }
}
