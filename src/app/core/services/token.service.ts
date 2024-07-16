import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  get tokenStorageKey() { return 'angular' }

  set token(value: string) {
    localStorage.setItem(this.tokenStorageKey, value)
  }
  get token() {
    return localStorage.getItem(this.tokenStorageKey) as string
  }
}
