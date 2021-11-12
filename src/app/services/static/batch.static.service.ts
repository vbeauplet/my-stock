import { Injectable } from '@angular/core';
import { Batch, batchConverter } from 'src/app/model/batch.model';

import { getFirestore, collection, query, getDocs, setDoc, doc,updateDoc, increment } from "firebase/firestore";
import { AppService } from '../app.service';
/**
 * Static services related to Batch Object
 *
 ******
 * This is a static service:
 * - Methods provided in the frame of this service do not depend on the context and dynamic behavior of the app
 * - This service do not depend on dynamic services
 ******
 *
 */
@Injectable({
  providedIn: 'root'
})
export class BatchStaticService {

  constructor(
      private appService: AppService
    ) { }
  
  /**
   * Gets all batches corresponding to a place on server
   *
   * Returns the request promise so that resulting data can be handled asynchronously
   */
  public getBatchesOnServer(placeId: String): Promise<Batch[]>{
    return new Promise<Batch[]>(async (resolve) => {
      
      let result: Batch[] = [];

      const db = getFirestore(this.appService.firebaseApp);
      const q = query(collection(db, '/places/' + placeId + '/batches'));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        
        let batch: Batch = batchConverter.fromServer(doc.data());
        result.push(batch);
      });
      
      resolve(result);      
    });
  }
  
  
  /**
   * Add a batch on server
   *
   * Returns the request promise so that we now when over
   */
  public addBatchOnServer(placeId: String, batch: Batch): Promise<void>{
    return new Promise<void>(async (resolve) => {
      
      const db = getFirestore(this.appService.firebaseApp);
      const batchRef = doc(db, '/places/' + placeId + '/batches', batch.id);
      await setDoc(batchRef, batchConverter.toServer(batch)).then(() => {
            resolve();
          });
              
    });
  }
  
  /**
   * Increment a batch quantity on server
   *
   * Returns the request promise so that we now when ok
   */
  public incrementBatchOnServer(placeId: String, batch: Batch): Promise<void>{
    return new Promise<void>(async (resolve) => {
      
      const db = getFirestore(this.appService.firebaseApp);
      const batchRef = doc(db, '/places/' + placeId + '/batches', batch.id);
      await updateDoc(batchRef, {quantity: increment(1)}).then(() => {
            resolve();
          });
              
    });
  }
  
  /**
   * Decrement a batch quantity on server
   *
   * Returns the request promise so that we now when ok
   */
  public decrementBatchOnServer(placeId: String, batch: Batch): Promise<void>{
    return new Promise<void>(async (resolve) => {
      
      const db = getFirestore(this.appService.firebaseApp);
      const batchRef = doc(db, '/places/' + placeId + '/batches', batch.id);
      await updateDoc(batchRef, {quantity: increment(-1)}).then(() => {
            resolve();
          });
              
    });
  }


}
