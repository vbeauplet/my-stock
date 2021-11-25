import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ms-shopping-view',
  host: { 'class' : 'tl-padded-page'},
  templateUrl: './shopping-view.component.html',
  styleUrls: ['./shopping-view.component.css']
})
export class ShoppingViewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
