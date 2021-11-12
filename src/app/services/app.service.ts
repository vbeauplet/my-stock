import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  /**
   * Firebase application, built at application init
   */
  public firebaseApp: any;

  constructor() { }
}
