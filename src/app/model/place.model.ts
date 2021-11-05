import { AbstractItem, abstractItemConverter } from "./abstract-item.model";
import { Batch } from "./batch.model";

/**
 * Defines a Place object
 *
 * @author vbeauplet
 */
export class Place extends AbstractItem {
  
  /**
   * Place position
   */
  public position: String = '';
  
  /**
   * List of all resolved batches within place
   */
  public resolvedBatches: Batch[] = [];
  
  /**
   * Associated flag that tells if batches are resolved or not
   */
  public areBatchesResolved: boolean = false;
  
  constructor() {
    super()
  }
}

/**
 * Creates Place object from server raw data and the other way around if needed
 */
export const placeConverter = {
  fromServer(data: any): Place {
    let place = new Place
    abstractItemConverter.setFromServer(data, place);
    place.position = '';
    return place;
  }
}