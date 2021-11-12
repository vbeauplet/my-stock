import { AbstractItem, abstractItemConverter } from "./abstract-item.model";

/**
 * Defines a Batch object
 *
 * @author vbeauplet
 */
export class Batch extends AbstractItem {
  
  /**
   * Batch category
   */
  public category: String = '';
  
  /**
   * Number of unitary elements within batch
   */
  public quantity: number = 0;
  
  /**
   * Low limit quantity
   */
  public lowLimitQuantity: number = 0;
  
  /**
   * Highest quantity to be displayed on batch gauge
   */
  public highestQuantity: number = 0;
  
  /**
   * Good enough quantity
   */
  public goodQuantity: number = 0;
  
  /**
   * Weight of an element within batch
   */
  public weight: number = 0;
  
  /**
   * Energy per kg of the item within batch
   */
  public energy: number = 0;
  
  /**
   * Price, in euros of a batch product
   */
  public price: number = 0;
  
  /**
   * Batch expiry date
   */
  public expiryDate: number = 0;
  
  constructor() {
    super()
  }
}

/**
 * Creates Place object from server raw data and the other way around if needed
 */
export const batchConverter = {
  fromServer: function(data: any): Batch{
    
      let batch = new Batch
      abstractItemConverter.setFromServer(data, batch);
      batch.category = data.category;
      batch.quantity = data.quantity;
      batch.lowLimitQuantity = data.lowLimitQuantity;
      batch.highestQuantity = data.highestQuantity;
      batch.goodQuantity = data.goodQuantity;
      batch.weight = data.weight;
      batch.energy = data.energy;
      batch.price = data.price;
      batch.expiryDate = data.expiryDate;
      
      return batch;
    },
  toServer: function(batch: Batch): any{
      
      return {
          id: batch.id,
          name: batch.name,
          category: batch.category,
          description: batch.description,
          favorite: batch.favorite,
          quantity: batch.quantity,
          lowLimitQuantity: batch.lowLimitQuantity,
          highestQuantity: batch.highestQuantity,
          goodQuantity: batch.goodQuantity,
          weight: batch.weight,
          energy: batch.energy,
          price: batch.price,
          expiryDate: batch.expiryDate,
        };
    }
}