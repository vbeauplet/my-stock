import { Injectable } from '@angular/core';
import { Batch, batchConverter } from 'src/app/model/batch.model';

import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
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
      const q = query(collection(db, '/places/KWibamcbLKqwwn5HP7M5/batches'));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        
        let batch: Batch = batchConverter.fromServer(doc.data());
        result.push(batch);
      });
      
      resolve(result);

//      // Stub
//      let batch1 = new Batch();
//      batch1.id = '1';
//      batch1.name = 'Sucre Complet';
//      batch1.category  = 'Sucre';
//      batch1.energy = 3600;
//      batch1.weight = 1;
//      batch1.quantity = 6;
//      batch1.lowLimitQuantity = 5;
//      batch1.highestQuantity = 20;
//      batch1.goodQuantity = 15;
//      
//      let batch2 = new Batch();
//      batch2.id = '2';
//      batch2.name = 'Sucre Bond';
//      batch2.category  = 'Sucre';
//      batch2.energy = 3800;
//      batch2.weight = 1;
//      batch2.quantity = 11;
//      batch2.lowLimitQuantity = 3;
//      batch2.highestQuantity = 15;
//      batch2.goodQuantity = 10;
//      
//      let batch3 = new Batch();
//      batch3.id = '3';
//      batch3.name = 'Riz blanc';
//      batch3.category  = 'Riz';
//      batch3.energy = 3400;
//      batch3.weight = 1;
//      batch3.quantity = 8;
//      batch3.lowLimitQuantity = 10;
//      batch3.highestQuantity = 30;
//      batch3.goodQuantity = 15;
//      
//      let batch4 = new Batch();
//      batch4.id = '4';
//      batch4.name = 'Huile d\'olive';
//      batch4.category  = 'Huile';
//      batch4.energy = 8000;
//      batch4.weight = 1;
//      batch4.quantity = 3;
//      batch4.lowLimitQuantity = 2;
//      batch4.highestQuantity = 10;
//      batch4.goodQuantity = 3;
//      
//      setTimeout(() => {
//        resolve([batch1, batch2, batch3, batch4]);
//      }, 1000);
      
    });
  }
}
