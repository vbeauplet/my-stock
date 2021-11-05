import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Place } from 'src/app/model/place.model';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'ms-stock-view',
  host: { 'class' : 'tl-padded-page'},
  templateUrl: './stock-view.component.html',
  styleUrls: ['./stock-view.component.css']
})
export class StockViewComponent implements OnInit {

  constructor(
    private router: Router,
    public stockService: StockService
  ) { }

  ngOnInit(): void {
  }

  /**
   * Handles click on a place
   */
  public onClickPlace(place: Place) {
    this.router.navigate(['/stock/' + place.id]);
  }
}
