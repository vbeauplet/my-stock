/**
 * Defines an abstract stock item
 *
 * @author vbeauplet
 */
export abstract class AbstractItem {
  
  /**
   * Object ID
   */
  public id: string;

  /**
   * Object name
   */
  public name: string = '';

  /**
   * Object description
   */
  public description: string = '';
  
  /**
   * Tells if this object has a favorite flag on
   */
  public favorite: boolean = false;
  
  constructor() {
    // Nothing to do here
  }
  
  public isUndefined(): boolean {
    return this.id == undefined;
  }
}

export const abstractItemConverter = {
  setFromServer(data: any, abstractItem: AbstractItem) {
    abstractItem.id = data.id;
    abstractItem.name = data.name;
    abstractItem.description = data.description;
    abstractItem.favorite = data.favorite;
  }
}