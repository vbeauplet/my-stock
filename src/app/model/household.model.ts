import { ITlSelectProposal } from "ngx-tl-common";
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
  
  /**
   * Household categories
   */
  public categories: string[] = [];
  

  // Derived attributes
  
  /**
   * Derived attributes representing the energy consumption (food) of the family, in kCal
   */
  public computedNumberOfCalories: number = 0;
  
  /**
   * Derived attributes representing the ecategory as 'TlSelect' proposals
   */
  public computedCategoryProposals: ITlSelectProposal[] = [];
   
   
  constructor() {
    super()
  }
  
  /**
   * Refreshes the derived attributes of the Household objecct
   */
  public refreshDerivedAttributes(){
    
    // ComputedNumberOfCalories
    this.computedNumberOfCalories = 2500 * this.numberOfAdults + 1500 * this.numberOfChildren;
    
    // Category proposals
    this.computedCategoryProposals = [];
    for(let category of this.categories){
      this.computedCategoryProposals.push({name: category});
    }
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
      household.categories = data.categories;
      household.refreshDerivedAttributes();
      
      return household;
    },
  toServer: function(household: Household): any{
      
      return {
          id: household.id,
          name: household.name,
          description: household.description,
          favorite: household.favorite,
          numberOfAdults: household.numberOfAdults,
          numberOfChildren: household.numberOfChildren,
          categoris: household.categories
        };
    }
}