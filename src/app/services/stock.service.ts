import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Place } from '../model/place.model';
import { PlaceStaticService } from './static/place.static.service';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  /**
   * Contextual places
   */
  public places: Place[] = [];

  /** 
   * Tells if all stock places has been fetched
   */ 
  public isLoaded: boolean = false;

  /** 
   * Tells if all stock places has been fetched and resolved
   */ 
  public isResolved: boolean = false;

  /**
   * Subject which is emitted whenever stock changes
   */
  public stockSubject: Subject<void> = new Subject<void>();
  
  /**
   * Subject which is emitted when stock is fully resolvedafter a reload
   */
  public stockResolvedSubject: Subject<void> = new Subject<void>();
  
  /**
   * Subject which is emitted when stock is reset
   */
  public stockResetSubject: Subject<void> = new Subject<void>();

  constructor(
      private placeStaticService: PlaceStaticService
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
    this.isResolved = false;
    this.places = [];
    this.stockResetSubject.next();
  }
  
  /**
   * Load stock
   */
  public load(){
     this.placeStaticService.getPlacesOnServer('toto')
      .then((response: Place[]) => {
          this.places = response;
          this.isLoaded = true;
          this.stockSubject.next();
          
          // Resolve all loaded places and compute weather
          for(let place of this.places){
            this.placeStaticService.resolvePlaceBatchesOnServer(place).then(() => {
                this.placeStaticService.computeWeather(place);
                this.checkResolved();
              });
          }
        });
  }
  
  /**
   * Check if stock is resolved and update corresponding flag accordingly
   * Additionaly emit corresponding event
   */
  public checkResolved(){
    for(let place of this.places){
      if(!place.areBatchesResolved){
        return;
      }
    }
    
    // Emit event, and set flag
    this.isResolved = true;
    this.stockResolvedSubject.next();
  }
  
  /**
   * return the place from the places contextual list from a prvided ID
   */
  public getPlace(placeId: String): Place{
    for(let place of this.places){
      if(place.id == placeId){
        return place;
      }
    }
    return new Place();
  }
  
}
