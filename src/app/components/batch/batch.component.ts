import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Batch } from 'src/app/model/batch.model';
import { Place } from 'src/app/model/place.model';
import { HouseholdService } from 'src/app/services/household.service';
import { BatchStaticService } from 'src/app/services/static/batch.static.service';
import { PlaceStaticService } from 'src/app/services/static/place.static.service';

@Component({
  selector: 'ms-batch',
  host: { 
    '[class]' : 'this.size + " tl-shadowed-soft-transparent tl-big-padded tl-container-flex-block"',
    '[class.selected]' : 'this.isSelected'
    },
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.css']
})
export class BatchComponent implements OnInit {

  /**
   * Size of the batch component
   * 'tl-full' by default
   */
  @Input() size: string = 'tl-full';
  

  /**
   * Input containing place for the batch. Mandatory
   */
  @Input() place: Place;
  
  /**
   * Input batch. Mandatory
   */
  @Input() batch: Batch;
  
  /**
   * Tells if Edit button shall be displayed
   */
  @Input() displayEditButton: boolean = false;
  
  /**
   * Enables the selection mode
   */
  @Input() enableSelectionMode: boolean = false;
  
  /**
   * Tells if the batch is in selection mode
   */
  @Input() isInSelectionMode: boolean = false;
  
  /**
   * Event which is emitted if the "Edit" button is clicked
   */
  @Output() clickEditButton: EventEmitter<Batch> = new EventEmitter<Batch>();
  
  /**
   * Event which is emitted when current batch is being selected. 
   * Only available if the enableSelectionMode flag is set tot tru
   */
  @Output() select: EventEmitter<Batch> = new EventEmitter<Batch>(); 
  
    /**
   * Event which is emitted when current batch is being unselected. 
   * Only available if the enableSelectionMode flag is set tot tru
   */
  @Output() unselect: EventEmitter<Batch> = new EventEmitter<Batch>(); 
  
  /**
   * Tells if current batch is selected
   */
  public isSelected: boolean = false;
  
  
  constructor(
      private placeStaticService: PlaceStaticService,
      private batchStaticService: BatchStaticService,
      public householdService: HouseholdService) { }

  ngOnInit(): void {
  }
  
  /**
   * Select the batch
   */
  public selectBatch(){
    this.isInSelectionMode = true;
    this.isSelected = true;
    this.select.next(this.batch);
  }
  
  /**
   * Select the batch
   */
  public unselectBatch(){
    this.isSelected = false;
    this.unselect.next(this.batch);
  }
  
  /**
   * Handles click on "add" over a batch
   */
  public onClickBatchAdd(){
    this.batchStaticService.incrementBatchOnServer(this.place.id, this.batch);
    this.batch.quantity++;
    this.placeStaticService.computeWeather(this.place);
  }
  
  /**
   * Handles click on "remove" over a batch
   */
  public onClickBatchRemove(){
    this.batchStaticService.decrementBatchOnServer(this.place.id, this.batch);
    this.batch.quantity--;
    this.placeStaticService.computeWeather(this.place);
  }
  
  /**
   * Handles change on the favorite flag of a batch
   */
  public onChangeFavoriteFlag(newValue: boolean){
    this.batchStaticService.setBatchFavoriteFlagOnServer(this.place.id, this.batch, newValue);
    this.batch.favorite = newValue;
  }
  
    
  /**
   * Selects or unselect a batch, depending on its current selection status
   */
  public onClickBatch(){
    if(this.isInSelectionMode){
      if(this.isSelected){
        this.unselectBatch();
      }
      else{
        this.selectBatch();
      }
    }
  }
  
  /**
   * Handles long click on batch
   */
  public onLongClickBatch(){
    if(this.enableSelectionMode && !this.isInSelectionMode){
      this.selectBatch()
    }
  }
  
  

}
