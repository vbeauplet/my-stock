import { AbstractItem, abstractItemConverter } from "./abstract-item.model";

/**
 * Defines a Household object
 *
 * @author vbeauplet
 */
export class Household extends AbstractItem {
  
  /**
   * Household number of adults
   */
  public numberOfAdults: number = 1;
  
  /**
   * Household number of children
   */
  public numberOfChildren: number = 0;
  
  
  constructor() {
    super()
  }
}

/**
 * Creates Place object from server raw data and the other way around if needed
 */
export const householdConverter = {
  fromServer: function(data: any): Household{
    
      let household = new Household();
      abstractItemConverter.setFromServer(data, household);
      household.numberOfAdults = data.numberOfAdults;
      household.numberOfChildren = data.numberOfChildren;
      return household;
    },
  toServer: function(household: Household): any{
      
      return {
          id: household.id,
          name: household.name,
          description: household.description,
          favorite: household.favorite,
          numberOfAdults: household.numberOfAdults,
          numberOfChildren: household.numberOfChildren
        };
    }
}