import { Component, OnInit } from '@angular/core';
import { Place } from 'src/app/model/place.model';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'ms-shopping-view',
  host: { 'class' : 'tl-padded-page'},
  templateUrl: './shopping-view.component.html',
  styleUrls: ['./shopping-view.component.css']
})
export class ShoppingViewComponent implements OnInit {

  /**
   * Subpart of the stock which is displayed in the shopping list
   */
  public displayedStock: Place[] = [];
  
  /**
   * Tels if the shopping list is loaded
   */
  public isLoaded: boolean = false;

  constructor(
    private stockService: StockService
  ) { }

  ngOnInit(): void {
    
    // If stock service is already loaded
    if(this.stockService.isLoaded){
      this.refresh();
    }
    
    // Else react every time it is dully loaded
    this.stockService.stockResolvedSubject.subscribe(() =>{
        this.refresh();
      });
  }
  
  /**
   * Refreshes the displayed stock for the shopping list
   */
  public refresh(){
    this.isLoaded = false;
    this.displayedStock = [];
    
    for(let place of this.stockService.places){
      // Shopping place is created only for display/binding puposes
      let shoppingPlace = new Place();
      shoppingPlace.id = place.id;
      shoppingPlace.name = place.name;
      
      // See if there are batches in this shopping place
      for(let batch of place.resolvedBatches){
        if(batch.quantity < batch.lowLimitQuantity){
          shoppingPlace.resolvedBatches.push(batch);
        }
      }
      
      // Add place to "shopping" stock to bind, if not empty
      if(place.resolvedBatches.length != 0){
        this.displayedStock.push(shoppingPlace);
      }
    }
    
    // Tell shopping stock have been resolved
    this.isLoaded = true;
  }

}
