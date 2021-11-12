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
  public position: string = '';
  
  /*
   * Attributes to be resolved
   */
  
  /**
   * List of all resolved batches within place
   */
  public resolvedBatches: Batch[] = [];
  
  /**
   * Associated flag that tells if batches are resolved or not
   */
  public areBatchesResolved: boolean = false;
  
  /*
   * Derived attributes to be computed
   */
  
  /**
   * Place "weather" depending on you stock item quantity status
   * 0 - Not computed
   * 1 - Storm (Multiple items are in red state)
   * 2 - Rain (1 item is in red state)
   * 3 - Parly sunny (No item in red state, less than 50% in green state)
   * 4 - Sunny (No item in red state, more than 50% in green state)
   */ 
  public computedWeather: number  = 0;

  constructor() {
    super()
  }
}

/**
 * Creates Place object from server raw data and the other way around if needed
 */
export const placeConverter = {
  fromServer: function(data: any): Place{
    
      let place = new Place
      abstractItemConverter.setFromServer(data, place);
      place.position = data.position;
      return place;
    },
  toServer: function(place: Place): any{
      
      return {
          id: place.id,
          name: place.name,
          description: place.description,
          favorite: place.favorite,
          position: place.position
        };
    }
}