import { Injectable } from '@angular/core';
import { Household, householdConverter } from 'src/app/model/household.model';
import { AppService } from '../app.service';

import { getFirestore, collection, query, getDocs, setDoc, doc,updateDoc, increment, getDoc, arrayUnion } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class HouseholdStaticService {

  constructor(
      private appService: AppService
    ) {}
  
   /**
   * Adds an household on server
   *
   * Returns the request promise so that we know when over
   */
  public setHouseholdOnServer(household: Household): Promise<void>{
    return new Promise<void>(async (resolve) => {
      
      const db = getFirestore(this.appService.firebaseApp);
      const batchRef = doc(db, '/households', household.code);
      await setDoc(batchRef, householdConverter.toServer(household)).then(() => {
            resolve();
          });
              
    });
  }
  
  /**
   * Gets the household corresponding to a stock code
   *
   * Returns the request promise so that resulting data can be handled asynchronously
   */
  public getHouseholdOnServer(code: string): Promise<Household>{
    return new Promise<Household>(async (resolve, reject) => {
      
      const db = getFirestore(this.appService.firebaseApp);
      const docRef = doc(db, "households", code);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        let household: Household = householdConverter.fromServer(docSnap.data());
        resolve(household);
      } else {
        reject('Stock does not exist');
      }
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
  
  /**
   * Adds a place reference to the household on server
   *
   * Returns the request promise so that we now when ok
   */
  public addPlaceReferenceOnServer(household: Household, newPlaceReference: string): Promise<void>{
    return new Promise<void>(async (resolve) => {
      
      const db = getFirestore(this.appService.firebaseApp);
      const householdRef = doc(db, '/households/' + household.id);
      await updateDoc(householdRef, {places: arrayUnion(newPlaceReference)}).then(() => {
            resolve();
          });
              
    });
  }
}
