import { Component, OnInit } from '@angular/core';
import { HouseholdService } from 'src/app/services/household.service';
import { HouseholdStaticService } from 'src/app/services/static/household.static.service';

@Component({
  selector: 'ms-profile-view',
  host: { 'class' : 'tl-padded-page'},
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {

  constructor(
    private householdStaticService: HouseholdStaticService,
    public householdService: HouseholdService) { }

  ngOnInit(): void {
  }
  
  /**
   * Handles set number of adults
   */
  public onSetNumberOfAdults(rawValue: number){
    this.householdService.household.numberOfAdults = rawValue;
    this.householdService.household.refreshDerivedAttributes();
    this.householdService.householdSubject.next();
    this.householdStaticService.updateNumberOfAdultsOnServer(this.householdService.household, rawValue);
  }
  
  /**
   * Handles set number of children
   */
  public onSetNumberOfChildren(rawValue: number){
    this.householdService.household.numberOfChildren = rawValue;
    this.householdService.household.refreshDerivedAttributes();
    this.householdService.householdSubject.next();
    this.householdStaticService.updateNumberOfChildrenOnServer(this.householdService.household, rawValue);
  }

  /**
   * Handles change on category list
   */
  public onChangeCategories(rawValue: string[]){
    this.householdService.household.categories = rawValue;
    this.householdService.household.refreshDerivedAttributes();
    this.householdService.householdSubject.next();
    this.householdStaticService.updateCategoriesOnServer(this.householdService.household, rawValue);
  }
}
