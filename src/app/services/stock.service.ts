import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Place } from '../model/place.model';
import { PlaceStaticService } from './static/place.static.service';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  public places: Place[] = [];

  public isLoaded: boolean = false;

  public stockSubject: Subject<void> = new Subject<void>();

  constructor(
      private placeStaticService: PlaceStaticService
    ) {
    
    // Load places
    this.load();
  }
  
  /**
   * refreshes stock
   */
  public refreshStock(){
    this.isLoaded = false;
    this.load();
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
          
          // Resolve all loaded places
          for(let place of this.places){
            this.placeStaticService.resolvePlaceBatchesOnServer(place);
          }
        });
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
