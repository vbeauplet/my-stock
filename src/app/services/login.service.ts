import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Household } from '../model/household.model';
import { HouseholdStaticService } from './static/household.static.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  /**
   * Current login Stock Code
   */
  public currentCode: string = null;
  
  /**
   * Subject which is emitted at any new Authentication change
   * Subject  payload is the current code
   */
  public  currentCodeSubject: BehaviorSubject<string>;

  constructor(
    private householdStaticService: HouseholdStaticService
  ) {
    
    // Init login from local storage, if a user is already connected
    // It avoids having to reconnect at each page refresh
    this.currentCodeSubject = new BehaviorSubject<string>(localStorage.getItem('stockCode'));
    this.currentCode = localStorage.getItem('stockCode');
  }
 
 
  /**
   * Tells if a user is logged in
   */
  public isLoggedIn(): boolean {
    return this.currentCode != undefined &&  this.currentCode != null;
  }
  
  /**
   * Logins from a stock code
   */
  public login(stockCode: string): Promise<void> {
    
    return new Promise<void>((resolve, reject) => {
        this.householdStaticService.getHouseholdOnServer(stockCode).then(
          () => {
              // Store user details and jwt token in local storage to keep user logged in between page refreshes
              localStorage.setItem('stockCode', stockCode);
                
              // Emit current authentication subject to let subscribers know it has been changed
              this.currentCode = stockCode;
              this.currentCodeSubject.next(stockCode);

              resolve();
            },
          (error) => {
              reject(error);
            });
      });
  }
  
  
  /**
   * Registers a new stock from stock code
   */
  public register(stockCode: string): Promise<void> {
    
    return new Promise<void>((resolve, reject) => {
      
        // Check not already existing
        this.householdStaticService.getHouseholdOnServer(stockCode).then(
              (household: Household) => {
                  reject('Stock Code already exists');
                },
              (error) => {
                 
                  // Create new Household
                  let household = new Household();
                  household.id = stockCode;
                  household.code = stockCode;
                  
                  // Upload household to server
                  this.householdStaticService.setHouseholdOnServer(household)
                    .then(() => {
                        
                        // Login to current household after it is finished uplaoding
                        this.login(stockCode)
                          .then(() => {
                              resolve();
                            });
                        
                      });
                });
       
      });
      
  }
  
  /**
   * Logs out a currently connected user
   */
  public logout() {
      // Remove user from local store to log user out
      localStorage.removeItem('stockCode');
      
      // Emit current auth subject to let subscribers know user is not connected anymore (null value is used)
      this.currentCode = null;
      this.currentCodeSubject.next(null);
  }
}
