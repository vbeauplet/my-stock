import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ITlFormItemState } from 'ngx-tl-common/lib/components/tl-form/tl-form.component';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'ms-register-view',
  host: { 'class' : 'tl-padded-page'},
  templateUrl: './register-view.component.html',
  styleUrls: ['./register-view.component.css']
})
export class RegisterViewComponent implements OnInit {

  /**
   * Register error to be displayed
   */
  public registerError: string = null;
  
  /**
   * Loading status of the register button
   */
  public registerButtonLoadingStatus: number = -1;

  constructor(
      private router: Router,
      private loginService: LoginService
    ) {}

  ngOnInit(): void {
  }


  /**
   * Submit form to register
   */
  public register(formStates: ITlFormItemState[]){
    console.log('Begin registration');
    this.registerError = null;
    this.registerButtonLoadingStatus = 0;
    let stockCode = this.getState('stock-code', formStates).value;
    this.loginService.register(stockCode).then(
      () => {
        console.log('success');
        this.registerButtonLoadingStatus = 1;
        this.router.navigate(['/profile']);
      },
      (error) => {
        console.log('failure');
        this.registerButtonLoadingStatus = 2;
        this.registerError = error;
        setTimeout(() => {
          this.registerButtonLoadingStatus = -1;
        }, 1000);
      }
    );
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
