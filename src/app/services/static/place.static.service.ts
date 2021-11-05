import { Injectable } from '@angular/core';
import { Batch } from 'src/app/model/batch.model';
import { Place } from 'src/app/model/place.model';
import { BatchStaticService } from './batch.static.service';

@Injectable({
  providedIn: 'root'
})
export class PlaceStaticService {

  constructor(
      private batchStaticService: BatchStaticService
    ) { }
  
  /**
   * Gets all places correpsonding to a user on server
   *
   * Returns the request promise so that resulting data can be handled asynchronously
   */
  public getPlacesOnServer(userId: String): Promise<Place[]>{
    return new Promise<Place[]>((resolve, reject) => {
      
      // Stub
      let place1: Place = new Place;
      place1.id = '1';
      place1.name = 'Extension';
      place1.description = 'Pas de description';
      place1.favorite = false;
      place1.position = '';
    
      let place2: Place = new Place;
      place2.id = '2';
      place2.name = 'Congelateur';
      place2.description = 'Pas de description';
      place2.favorite = false;
      place2.position = '';
    
      let place3: Place = new Place;
      place3.id = '3';
      place3.name = 'Cuisine';
      place3.description = 'Pas de description';
      place3.favorite = true;
      place3.position = '';
      
      let place4: Place = new Place;
      place4.id = '4';
      place4.name = 'Coffrage';
      place4.description = 'Pas de description';
      place4.favorite = false;
      place4.position = '';
      
      setTimeout(() => {
        resolve([place1, place2, place3, place4]);
      }, 1000);
      
    });
  }
  
  
  /**
   * Resolves Place batches on server
   * Returns a promise to know when batches have been actually resolved
   */
  public resolvePlaceBatchesOnServer(place: Place): Promise<void>{
    return new Promise<void>((resolve, reject) => {
      
      // Get batches corresponding to place from server
      this.batchStaticService.getBatchesOnServer('toto')
        .then((response: Batch[]) => {
            place.resolvedBatches = response;
            place.areBatchesResolved = true;
            resolve();
          });
          
    });
  }
}
