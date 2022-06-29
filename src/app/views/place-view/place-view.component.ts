import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TlAlertService, TlHelpersService, TlThemeService } from 'ngx-tl-common';
import { Subscription } from 'rxjs';
import { ITlFormItemState } from 'src/app/components/tl-form/tl-form.component';
import { Batch } from 'src/app/model/batch.model';
import { Place } from 'src/app/model/place.model';
import { HouseholdService } from 'src/app/services/household.service';
import { BatchStaticService } from 'src/app/services/static/batch.static.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'ms-place-view',
  host: { 'class' : 'tl-padded-page'},
  templateUrl: './place-view.component.html',
  styleUrls: ['./place-view.component.css']
})
export class PlaceViewComponent implements OnInit {

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    if(this.selectedBatches.length != 0 && document.documentElement.clientWidth < 800){
      this.highlightSelectionMenu();
    }
    else{
      this.unhighlightSelectionMenu();
    }
  }

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
   * List of all selected batches for batch action
   */
  public selectedBatches: Batch[] = [];

  /**
   * Max number of batch to display on view 
   */
  public maxDisplayIndex = 10;
  
  /**
   * Tells if the "load more" button shall be visible
   */
  public showLoadMoreButton = false;
  
  /**
   * Tells if view in currently in creation or edition submission mode
   */
  public isSubmittingEditionOrCreationForm: boolean = false;

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
   * Tells if the popup to create new batch shall be displayed
   */
  public displayNewBatchPopup: boolean = false;
 
 
  /**
   * Loading status of the 'change category' popup submit button
   */
  public changeCategoryPopupLoadingStatus: number = -1;
  
  /**
   * Tells if the popup to change batch category shall be displayed
   */
  public displayChangeCategoryPopup: boolean = false;
  
  /**
   * Tells if selection menu is highligted 
   */
  public isSelectionMenuHighlighted: boolean = false;
  
  
  /**
   * Batch being edited
   */
  public editedBatch: Batch = new Batch();

  constructor(
      private route: ActivatedRoute,
      private tlHelpersService: TlHelpersService,
      private tlAlertService: TlAlertService,
      private tlThemeService: TlThemeService,
      private batchStaticService: BatchStaticService,
      public stockService: StockService,
      public householdService: HouseholdService
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
  
  ngOnDestroy(): void {
    this.unhighlightSelectionMenu();
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
   * Handles batch selection
   */
  public onSelectBatch(batch: Batch){
    this.selectedBatches.push(batch);
    
    // Handle layout to improve visibility
    if(document.documentElement.clientWidth < 800){
      this.highlightSelectionMenu();
    }
  }
  
  /**
   * Handles batch un-selection
   */
  public onUnselectBatch(batch: Batch){
    const index = this.selectedBatches.indexOf(batch, 0);
    if (index > -1) {
       this.selectedBatches.splice(index, 1);
    }
    
    // Handle layout to improve visibility
    if(this.selectedBatches.length == 0 && document.documentElement.clientWidth < 800){
      this.unhighlightSelectionMenu();
    }
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
  public onClickCloseNewBatchPopup(){
    
    // Set edited batch
    this.editedBatch = new Batch();
    
    // Close popup
    this.displayNewBatchPopup = false;
  }

  /**
   * Submit form to add or edit batch to current place
   */
  public submitBatchForm(formStates: ITlFormItemState[]){

    this.newBatchPopupLoadingStatus = 0;
    this.isSubmittingEditionOrCreationForm = true;

    // Initialize result batch
    let batch: Batch;
    let isCreation = this.editedBatch.isUndefined();

    // If this is a creation, create a new batch and generate ID
    if(isCreation){
      batch = new Batch();
      
      // Initialize ID
      batch.id = this.tlHelpersService.generateId();
    }
    // if this is an edition, retrieve edited batch and update
    else{
      batch = this.editedBatch
    }

    // Create or update Batch from form content
    batch.name = this.getState('batch-name', formStates).value;
    batch.favorite = this.getState('batch-favorite', formStates).value;
    batch.expiryDate = this.getState('batch-date', formStates).value;
    batch.category = this.getState('batch-category', formStates).value;
    batch.quantity = this.getState('batch-quantity', formStates).value;
    batch.lowLimitQuantity = this.getState('batch-low-quantity', formStates).value;
    batch.highestQuantity = this.getState('batch-highest-quantity', formStates).value;
    batch.goodQuantity = this.getState('batch-good-quantity', formStates).value;
    batch.weight = this.getState('batch-weight', formStates).value;
    batch.energy = this.getState('batch-energy', formStates).value;
    batch.price = this.getState('batch-price', formStates).value;
    
    // Add or update batch on server
    this.batchStaticService.setBatchOnServer(this.place.id, batch).then(() => {
    	this.stockService.reload();
      this.newBatchPopupLoadingStatus = 1;
      setTimeout(() => {
          this.displayNewBatchPopup = false;
          this.newBatchPopupLoadingStatus = -1;
          setTimeout(() => {
            if(isCreation){
              this.tlAlertService.raiseInfo('Nouveau lot "'+ batch.name + '" ajouté dans la pièce');
            }
            else{
              this.tlAlertService.raiseInfo('Le lot "'+ batch.name + '" a bien été modifié');
            }
            this.isSubmittingEditionOrCreationForm = false;
          }, 500)
      }, 700);
    })
  }
  
    /**
   * Submit batchly change batch catergories
   */
  public submitChangeCategoryForm(formStates: ITlFormItemState[]){

    this.changeCategoryPopupLoadingStatus = 0;

    // Retrieve form content
    let newCategory = this.getState('batches-category', formStates).value;
    
    // For each selected batches, update on server
    let changeCategoryPromises: Promise<void>[] = [];
    for(let batch of this.selectedBatches){
      changeCategoryPromises.push(this.batchStaticService.setBatchCategoryOnServer(this.place.id, batch, newCategory));
    }
    Promise.all(changeCategoryPromises)
      .then(() => {
          this.changeCategoryPopupLoadingStatus = 1;
          setTimeout(() => {
              this.changeCategoryPopupLoadingStatus = -1;
              setTimeout(() => {
                this.tlAlertService.raiseInfo('La catégorie des lots séléctionnées a bien été mise à jour');
                this.stockService.reload();
              }, 500)
          }, 1000);
        });
    
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
   * Hilight the selection menu
   */
  private highlightSelectionMenu(){
    document.getElementById('my-stock-menu').style.setProperty('padding-top', '260px');
    document.documentElement.style.setProperty('--menu-bg-color', this.tlThemeService.currentTheme.sharpTransparentBgColor);
    this.isSelectionMenuHighlighted = true;
  }
  
  /**
   * Un-highlight the selection menu
   */
  private unhighlightSelectionMenu(){
    if(this.isSelectionMenuHighlighted){
      document.getElementById('my-stock-menu').style.setProperty('padding-top', '50px');
      document.documentElement.style.setProperty('--menu-bg-color', this.tlThemeService.currentTheme.menuBgColor);
      this.isSelectionMenuHighlighted = false;
    }
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
