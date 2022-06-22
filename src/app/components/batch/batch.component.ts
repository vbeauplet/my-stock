import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Batch } from 'src/app/model/batch.model';
import { Place } from 'src/app/model/place.model';
import { BatchStaticService } from 'src/app/services/static/batch.static.service';
import { PlaceStaticService } from 'src/app/services/static/place.static.service';

@Component({
  selector: 'ms-batch',
  host: { 
    '[class]' : 'this.size + " tl-shadowed-soft-transparent tl-big-padded tl-container-flex-block"'
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
   * Event which is emitted if the "Edit" button is clicked
   */
  @Output() clickEditButton: EventEmitter<Batch> = new EventEmitter<Batch>();

  constructor(
      private placeStaticService: PlaceStaticService,
      private batchStaticService: BatchStaticService) { }

  ngOnInit(): void {
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

}
