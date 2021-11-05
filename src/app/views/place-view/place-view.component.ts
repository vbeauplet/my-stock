import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Batch } from 'src/app/model/batch.model';
import { Place } from 'src/app/model/place.model';
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
   * Bindable place
   */
  public place: Place = new Place();

  constructor(
      private route: ActivatedRoute,
      public stockService: StockService
    ) { }

  ngOnInit(): void {
    
    // Retrieve bindable place from stock service from URL ID
    this.routeSub = this.route.params.subscribe(params => {
        let id: String = params['id'];
         
        // If stock service is already loaded
        if(this.stockService.isLoaded){
          this.place = this.stockService.getPlace(id);
        }
        
        // Else wait till it is loaded
        this.stockService.stockSubject.subscribe(() =>{
            this.place = this.stockService.getPlace(id);
          });
      });
  }
  
  /**
   * Handles click on "add" over a batch
   */
  public onClickBatchAdd(batch: Batch){
    batch.quantity++;
  }
  
  /**
   * Handles click on "remove" over a batch
   */
  public onClickBatchRemove(batch: Batch){
    batch.quantity--;
  }

}
