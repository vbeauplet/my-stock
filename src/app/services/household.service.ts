import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Household } from '../model/household.model';
import { HouseholdStaticService } from './static/household.static.service';

@Injectable({
  providedIn: 'root'
})
export class HouseholdService {


  /**
   * Contextual household
   */
  public household: Household = new Household();
  
  /**
   * Tells if contextual household has been already loaded
   */
  public isLoaded: boolean = false;
  
  /**
   * Subject which is emitted whenever household changes
   */
  public householdSubject: Subject<void> = new Subject<void>();
  
  constructor(
      private householdStaticService: HouseholdStaticService
    ) {
    
    // Load places
    this.load();
  }
  
  /**
   * Reloads stock service
   */
  public reload(){
    this.reset();
    this.load();
  }
  
  /**
   * Reset stock service
   */
  public reset(){
    this.isLoaded = false;
  }
  
  /**
   * Load stock
   */
  public load(){
     this.householdStaticService.getHouseholdOnServer('toto')
      .then((response: Household) => {
          this.household = response;
          this.isLoaded = true;
          this.householdSubject.next();
        });
  }
}
