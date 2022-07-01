import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Household } from '../model/household.model';
import { LoginService } from './login.service';
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
   * Subject which is emitted whenever household changes (or at subscirption time because it is a behavior subject)
   */
  public householdSubject: BehaviorSubject<Household> = new BehaviorSubject<Household>(new  Household());
  
  constructor(
      private householdStaticService: HouseholdStaticService,
      private loginService: LoginService
    ) {
    
    // Subscribe to the stock code behavior subject so that household is loaded from it consistently
    this.loginService.currentCodeSubject.subscribe(
      (stockCode: string) => {
          this.load(stockCode);
        });
    
  }

  /**
   * Reset stock service
   */
  public reset(){
    this.household = new Household();
    this.isLoaded = false;
  }
  
  /**
   * Loads a stock household from stock code
   */
  public load(stockCode: string){
    this.reset();
    if(stockCode != undefined && stockCode != null && stockCode != ''){
      this.householdStaticService.getHouseholdOnServer(stockCode)
        .then((response: Household) => {
            this.household = response;
            this.householdSubject.next(this.household);
            this.isLoaded = true;
          });
    }
  }
}
