import { Injectable } from '@angular/core';
import { Household, householdConverter } from 'src/app/model/household.model';
import { AppService } from '../app.service';

import { getFirestore, collection, query, getDocs, setDoc, doc,updateDoc, increment } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class HouseholdStaticService {

  constructor(
      private appService: AppService
    ) {}
  
    /**
   * Gets the household corresponding to a user on server
   *
   * Returns the request promise so that resulting data can be handled asynchronously
   */
  public getHouseholdOnServer(userId: String): Promise<Household>{
    return new Promise<Household>(async (resolve) => {
      

      const db = getFirestore(this.appService.firebaseApp);
      const q = query(collection(db, '/households'));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        
        let household: Household = householdConverter.fromServer(doc.data());
        resolve(household);
      }); 
    });
  }
  
  /**
   * Updates the number of adults of a particular household on server
   *
   * Returns the request promise so that we now when ok
   */
  public updateNumberOfAdultsOnServer(household: Household, newNumberOfAdults: number): Promise<void>{
    return new Promise<void>(async (resolve) => {
      
      const db = getFirestore(this.appService.firebaseApp);
      const batchRef = doc(db, '/households/' + household.id);
      await updateDoc(batchRef, {numberOfAdults: newNumberOfAdults}).then(() => {
            resolve();
          });
              
    });
  }
  
  /**
   * Updates the number of children of a particular household on server
   *
   * Returns the request promise so that we now when ok
   */
  public updateNumberOfChildrenOnServer(household: Household, newNumberOfChildren: number): Promise<void>{
    return new Promise<void>(async (resolve) => {
      
      const db = getFirestore(this.appService.firebaseApp);
      const batchRef = doc(db, '/households/' + household.id);
      await updateDoc(batchRef, {numberOfChildren: newNumberOfChildren}).then(() => {
            resolve();
          });
              
    });
  }
  
    /**
   * Updates the categories corresponding to the household on server
   *
   * Returns the request promise so that we now when ok
   */
  public updateCategoriesOnServer(household: Household, categories: string[]): Promise<void>{
    return new Promise<void>(async (resolve) => {
      
      const db = getFirestore(this.appService.firebaseApp);
      const batchRef = doc(db, '/households/' + household.id);
      await updateDoc(batchRef, {categories: categories}).then(() => {
            resolve();
          });
              
    });
  }
}
