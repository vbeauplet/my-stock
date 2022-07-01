import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HouseholdService } from 'src/app/services/household.service';
import { LoginService } from 'src/app/services/login.service';
import { HouseholdStaticService } from 'src/app/services/static/household.static.service';

@Component({
  selector: 'ms-profile-view',
  host: { 'class' : 'tl-padded-page'},
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {

  constructor(
    private router: Router,
    private householdStaticService: HouseholdStaticService,
    private loginService: LoginService,
    public householdService: HouseholdService) { }

  ngOnInit(): void {
  }
  
  /**
   * Handles set number of adults
   */
  public onSetNumberOfAdults(rawValue: number){
    this.householdService.household.numberOfAdults = rawValue;
    this.householdService.household.refreshDerivedAttributes();
    this.householdStaticService.updateNumberOfAdultsOnServer(this.householdService.household, rawValue);
  }
  
  /**
   * Handles set number of children
   */
  public onSetNumberOfChildren(rawValue: number){
    this.householdService.household.numberOfChildren = rawValue;
    this.householdService.household.refreshDerivedAttributes();
    this.householdStaticService.updateNumberOfChildrenOnServer(this.householdService.household, rawValue);
  }

  /**
   * Handles change on category list
   */
  public onChangeCategories(rawValue: string[]){    
    this.householdService.household.categories = rawValue;
    this.householdService.household.refreshDerivedAttributes();
    this.householdStaticService.updateCategoriesOnServer(this.householdService.household, rawValue);
  }
  
  /**
   * Logs out of the application
   */
  public logout(){
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
