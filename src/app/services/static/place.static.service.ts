import { Injectable } from '@angular/core';
import { Batch } from 'src/app/model/batch.model';
import { Place, placeConverter } from 'src/app/model/place.model';
import { BatchStaticService } from './batch.static.service';

import { getFirestore, collection, query, getDocs, setDoc, doc,updateDoc, increment } from "firebase/firestore";
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class PlaceStaticService {

  constructor(
      private appService: AppService,
      private batchStaticService: BatchStaticService
    ) { }
  
  
  /**
   * Gets all places correpsonding to a user on server
   *
   * Returns the request promise so that resulting data can be handled asynchronously
   */
  public getPlacesOnServer(userId: String): Promise<Place[]>{
    return new Promise<Place[]>(async (resolve) => {
      
      let result: Place[] = [];

      const db = getFirestore(this.appService.firebaseApp);
      const q = query(collection(db, '/places'));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        
        let place: Place = placeConverter.fromServer(doc.data());
        result.push(place);
      });
      
      resolve(result);      
    });
  }
  
    
  /**
   * Add a place on server
   *
   * Returns the request promise so that we now when over
   */
  public addPlaceOnServer(place: Place): Promise<void>{
    return new Promise<void>(async (resolve) => {
      
      const db = getFirestore(this.appService.firebaseApp);
      const batchRef = doc(db, '/places', place.id);
      await setDoc(batchRef, placeConverter.toServer(place)).then(() => {
            resolve();
          });
              
    });
  }
  
  
  /**
   * Resolves Place batches on server
   * Returns a promise to know when batches have been actually resolved
   */
  public resolvePlaceBatchesOnServer(place: Place): Promise<void>{
    return new Promise<void>((resolve, reject) => {
      
      // Get batches corresponding to place from server
      this.batchStaticService.getBatchesOnServer(place.id)
        .then((response: Batch[]) => {
            place.resolvedBatches = response;
            place.areBatchesResolved = true;
            resolve();
          });
          
    });
  }
  
  /**
   * Compoute weather derived property
   */
  public computeWeather(place: Place){
    
    // Do nothing if batch are not resolved yet
    if(!place.areBatchesResolved){
      return; 
    }
    
    // Check if there are items
    if(place.resolvedBatches.length === 0){
      place.computedWeather = 4;
      return;
    }
    
    // Check number of items in red state
    let red: number = 0;
    for(let batch of place.resolvedBatches){
      if(batch.quantity < batch.lowLimitQuantity){
        red ++;
      }
    }
    if(red > 1){
      place.computedWeather = 1;
      return;
    }
    if(red == 1){
      place.computedWeather = 2;
      return;
    }
    
    // If needed, check number of items in orange state
    let orange: number = 0;
    for(let batch of place.resolvedBatches){
      if(batch.quantity < batch.goodQuantity){
        orange ++;
      }
    }
    if(orange/place.resolvedBatches.length > 0.5){
      place.computedWeather = 3;
    }
    else{
      place.computedWeather = 4;
    }
    
  }
  
}
