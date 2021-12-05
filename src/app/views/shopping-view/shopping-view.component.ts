import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ms-shopping-view',
  host: { 'class' : 'tl-padded-page'},
  templateUrl: './shopping-view.component.html',
  styleUrls: ['./shopping-view.component.css']
})
export class ShoppingViewComponent implements OnInit {

  public event1 = {
    date: new Date(),
    event: 'Day4Life'
  };
  
  public event2 = {
    date: new Date(),
    event: 'Montage'
  };

  constructor() { }

  ngOnInit(): void {
  }

}
