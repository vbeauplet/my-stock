import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TlAlertService, TlHelpersService } from 'ngx-tl-common';
import { Subscription } from 'rxjs';
import { ITlFormItemState } from 'src/app/components/tl-form/tl-form.component';
import { Batch } from 'src/app/model/batch.model';
import { Place } from 'src/app/model/place.model';
import { BatchStaticService } from 'src/app/services/static/batch.static.service';
import { PlaceStaticService } from 'src/app/services/static/place.static.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'ms-place-view',
  host: { 'class' : 'tl-padded-page'},
  templateUrl: './place-view.component.html',
  styleUrls: ['./place-view.component.css']
})
export class PlaceViewComponent implements OnInit {

  /**
   * Subscription to route to retrieve the ID
   */
  public routeSub: Subscription;
  
  /**
   * Source place
   */
  public place: Place = new Place();

  /**
   * List of displayed batches
   */
  public displayedBatches: Batch[] = [];

  /**
   * Tells if the popup to create new batch shall be displayed
   */
  public displayNewBatchPopup: boolean = false;

  /**
   * Status of the label of the "new batch" button
   * 0 - Normal
   * 1 - Hidden
   * 2 - Not displayed
   */
  public newBatchButtonLabelStatus = 0;

  /**
   * Loading status of the new batch popup submit button
   */
  public newBatchPopupLoadingStatus: number = -1;

  constructor(
      private route: ActivatedRoute,
      private tlHelpersService: TlHelpersService,
      private tlAlertService: TlAlertService,
      private placeStaticService: PlaceStaticService,
      private batchStaticService: BatchStaticService,
      public stockService: StockService
    ) { }

  ngOnInit(): void {
    
    // Retrieve bindable place from stock service from URL ID
    this.routeSub = this.route.params.subscribe(params => {
        let id: String = params['id'];
         
        // If stock service is already loaded
        if(this.stockService.isLoaded){
          this.place = this.stockService.getPlace(id);
          this.resetDisplayedBatches();
        }
        
        // Else wait till it is loaded
        this.stockService.stockResolvedSubject.subscribe(() =>{
            this.place = this.stockService.getPlace(id);
            this.resetDisplayedBatches();
          });

      });

    // Handle reset of stock service
    this.stockService.stockResetSubject.subscribe(() =>{
        this.place = new Place();
        this.displayedBatches = [];
      });

    // Handle label of the "new batch" button
    setTimeout(() => {
    	this.newBatchButtonLabelStatus = 1;
      setTimeout(() => {
        this.newBatchButtonLabelStatus = 2;
      }, 500);
    }, 4000);
  }
  
  /**
   * Handles click on "add" over a batch
   */
  public onClickBatchAdd(batch: Batch){
	  this.batchStaticService.incrementBatchOnServer(this.place.id, batch);
    batch.quantity++;
    this.placeStaticService.computeWeather(this.place);
  }
  
  /**
   * Handles click on "remove" over a batch
   */
  public onClickBatchRemove(batch: Batch){
    this.batchStaticService.decrementBatchOnServer(this.place.id, batch);
    batch.quantity--;
    this.placeStaticService.computeWeather(this.place);
  }

  /**
   * Submit form to add new batch to current place
   */
  public submitNewBatchForm(formStates: ITlFormItemState[]){

    // Tell loading
    this.newBatchPopupLoadingStatus = 0;

    // Create new Batch from form content
    let newBatch: Batch = new Batch();
    newBatch.id = this.tlHelpersService.generateId();
    newBatch.name = this.getState('batch-name', formStates).value;
    newBatch.favorite = this.getState('batch-favorite', formStates).value;
    newBatch.category = this.getState('batch-category', formStates).value;
    newBatch.quantity = this.getState('batch-quantity', formStates).value;
    newBatch.lowLimitQuantity = this.getState('batch-low-quantity', formStates).value;
    newBatch.highestQuantity = this.getState('batch-highest-quantity', formStates).value;
    newBatch.goodQuantity = this.getState('batch-good-quantity', formStates).value;
    newBatch.weight = this.getState('batch-weight', formStates).value;
    newBatch.energy = this.getState('batch-energy', formStates).value;
    newBatch.price = this.getState('batch-price', formStates).value;
    
    // Add new batch on server
    this.batchStaticService.addBatchOnServer(this.place.id, newBatch).then(() => {
    	this.stockService.reload();
      this.newBatchPopupLoadingStatus = 1;
      setTimeout(() => {
          this.displayNewBatchPopup = false;
          this.newBatchPopupLoadingStatus = -1;
          setTimeout(() => {
            this.tlAlertService.raiseInfo('Nouveau lot "'+ newBatch.name + '" ajouté dans la pièce');
          }, 500)
      }, 700);
    })
  }

  /**
   * Updates displayed batches from free search
   */
  public searchBatch(search: string){
	  let temp: Batch[] = [];
    for(let batch of this.place.resolvedBatches){
    	if(batch.name.toLowerCase().includes(search.toLowerCase())){
	      temp.push(batch);
      }
    }
    this.displayedBatches = temp;
  }

  /**
   * Reset displayed batches from source PLace object
   */
  private resetDisplayedBatches(){
  	this.displayedBatches = [... this.place.resolvedBatches];
  }

  /**
   * Gets the item state within form states corresponding to provided item ID
   * Null if not found
   */
  private getState(itemId: string, states: ITlFormItemState[]): ITlFormItemState{
    for(let itemState of states){
      if(itemState.id == itemId){
        return itemState;
      }
    }
    return null;
  }

}
