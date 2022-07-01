import { ITlSelectProposal } from "ngx-tl-common";
import { AbstractItem, abstractItemConverter } from "./abstract-item.model";

/**
 * Defines a Household object
 *
 * @author vbeauplet
 */
export class Household extends AbstractItem {
  
  /**
   * Stock Code
   */
  public code: string = null;
  
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
  public categories: string[] = ['Féculent', 'Noix', 'Huile', 'Friandise', 'Alcool', 'Conserve'];
  
  /**
   * Places carried by the stock household
   */
  public places: string[] = [];
  

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
   * Tells if this is an actual household
   */
  public isDefined(){
    return this.code != null;
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
      household.code = data.code;
      household.numberOfAdults = data.numberOfAdults;
      household.numberOfChildren = data.numberOfChildren;
      household.categories = data.categories;
      household.places = data.places;
      household.refreshDerivedAttributes();
      
      return household;
    },
  toServer: function(household: Household): any{
      
      return {
          id: household.id,
          name: household.name,
          description: household.description,
          favorite: household.favorite,
          code: household.code,
          numberOfAdults: household.numberOfAdults,
          numberOfChildren: household.numberOfChildren,
          categories: household.categories,
          places: household.places
        };
    }
}