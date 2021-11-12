import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TlAlertService, TlHelpersService } from 'ngx-tl-common';
import { ITlFormItemState } from 'src/app/components/tl-form/tl-form.component';
import { Place } from 'src/app/model/place.model';
import { PlaceStaticService } from 'src/app/services/static/place.static.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'ms-stock-view',
  host: { 'class' : 'tl-padded-page'},
  templateUrl: './stock-view.component.html',
  styleUrls: ['./stock-view.component.css']
})
export class StockViewComponent implements OnInit {


  /**
   * Tells if the popup to create new place shall be displayed
   */
  public displayNewPlacePopup: boolean = false;

  /**
   * Status of the label of the "new place" button
   * 0 - Normal
   * 1 - Hidden
   * 2 - Not displayed
   */
  public newPlaceButtonLabelStatus = 0;
  
  /**
   * Loading status of the new place popup submit button
   */
  public newPlacePopupLoadingStatus: number = -1;


  constructor(
    private router: Router,
    private tlHelpersService: TlHelpersService,
    private tlAlertService: TlAlertService,
    private placeStaticService: PlaceStaticService,
    public stockService: StockService
  ) { }

  ngOnInit(): void {
    // Handle label of the "new batch" button
    setTimeout(() => {
      
      this.newPlaceButtonLabelStatus = 1;
      setTimeout(() => {
        this.newPlaceButtonLabelStatus = 2;
      }, 500);
    }, 4000);
  }

  /**
   * Handles click on a place
   */
  public onClickPlace(place: Place) {
    this.router.navigate(['/stock/' + place.id]);
  }
  
   /**
   * Submit form to add new batch to current place
   */
  public submitNewPlaceForm(formStates: ITlFormItemState[]){

    // Tell loading
    this.newPlacePopupLoadingStatus = 0;

    // Create new Batch from form content
    let newPlace: Place = new Place();
    newPlace.id = this.tlHelpersService.generateId();
    newPlace.name = this.getState('place-name', formStates).value;
    newPlace.favorite = this.getState('place-favorite', formStates).value;
    newPlace.position = this.getState('place-position', formStates).value;
    
    // Add new batch on server
    this.placeStaticService.addPlaceOnServer(newPlace).then(() => {
      this.stockService.reload();
      this.newPlacePopupLoadingStatus = 1;
      setTimeout(() => {
          this.displayNewPlacePopup = false;
          this.newPlacePopupLoadingStatus = -1;
          setTimeout(() => {
            this.tlAlertService.raiseInfo('La nouveau pièce "'+ newPlace.name + '" a bien été ajoutée');
          }, 500)
      }, 700);
    })
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
