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
   * Max number of batch to display on view 
   */
  public maxDisplayIndex = 10;
  
  /**
   * Tells if the "load more" button shall be visible
   */
  public showLoadMoreButton = false;
  
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
  
  /**
   * Batch being edited
   */
  public editedBatch: Batch = new Batch();

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
   * Handles click on "show more" button
   */
  public onClickShowMore(){
    let newMaxIndex: number = this.maxDisplayIndex + 10;
    let batchesToAdd: Batch[] = this.place.resolvedBatches.slice(this.maxDisplayIndex, newMaxIndex)
    for(let batch of batchesToAdd){
      this.displayedBatches.push(batch);
    }
    this.maxDisplayIndex = newMaxIndex;
  }
  
  /**
   * Handles click on the edition button over a batch
   */
  public onClickBatchEdit(batch: Batch){
    
    // Set edited batch
    this.editedBatch = batch;
    
    // Open popup
    this.displayNewBatchPopup = true;
  }
  
  /**
   * Handles click on the close button when editing a batch
   */
  public onClickClosePopup(){
    
    // Set edited batch
    this.editedBatch = new Batch();
    
    // Close popup
    this.displayNewBatchPopup = false;
  }

  /**
   * Submit form to add or edit batch to current place
   */
  public submitBatchForm(formStates: ITlFormItemState[]){

    // If this is a creation, generate ID
    if(this.editedBatch.isUndefined()){
      this.editedBatch.id = this.tlHelpersService.generateId();
    }
    
    console.log(this.editedBatch.id);

    // Create or update Batch from form content
    let batch: Batch = this.editedBatch
    batch.name = this.getState('batch-name', formStates).value;
    batch.favorite = this.getState('batch-favorite', formStates).value;
    batch.category = this.getState('batch-category', formStates).value;
    batch.quantity = this.getState('batch-quantity', formStates).value;
    batch.lowLimitQuantity = this.getState('batch-low-quantity', formStates).value;
    batch.highestQuantity = this.getState('batch-highest-quantity', formStates).value;
    batch.goodQuantity = this.getState('batch-good-quantity', formStates).value;
    batch.weight = this.getState('batch-weight', formStates).value;
    batch.energy = this.getState('batch-energy', formStates).value;
    batch.price = this.getState('batch-price', formStates).value;
    
    // Add new batch on server
    this.batchStaticService.setBatchOnServer(this.place.id, batch).then(() => {
    	this.stockService.reload();
      this.newBatchPopupLoadingStatus = 1;
      setTimeout(() => {
          this.displayNewBatchPopup = false;
          this.newBatchPopupLoadingStatus = -1;
          setTimeout(() => {
            this.tlAlertService.raiseInfo('Nouveau lot "'+ batch.name + '" ajouté dans la pièce');
          }, 500)
      }, 700);
    })
  }

  /**
   * Updates displayed batches from free search
   */
  public searchBatch(search: string){
    if(search.length < 2){
      this.resetDisplayedBatches();
      return;
    }
	  let temp: Batch[] = [];
    for(let batch of this.place.resolvedBatches){
    	if(batch.name.toLowerCase().includes(search.toLowerCase())){
	      temp.push(batch);
      }
    }
    this.showLoadMoreButton = false;
    this.displayedBatches = temp;
  }

  /**
   * Reset displayed batches from source PLace object
   */
  private resetDisplayedBatches(){
    this.maxDisplayIndex = 10;
  	this.displayedBatches = [... this.place.resolvedBatches.slice(0,this.maxDisplayIndex)];
    if(this.maxDisplayIndex < this.place.resolvedBatches.length) {
      this.showLoadMoreButton = true;
    }
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
