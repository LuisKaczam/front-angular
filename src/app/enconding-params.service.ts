import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncondingParamsService {

  constructor() { }

  encode(value: string): string {
    return btoa(value);
  }

  decode(encodedValue: string): string {
    return atob(encodedValue);
  }
}
