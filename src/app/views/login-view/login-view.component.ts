import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ITlFormItemState } from 'ngx-tl-common/lib/components/tl-form/tl-form.component';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'ms-login-view',
  host: { 'class' : 'tl-padded-page'},
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.css']
})
export class LoginViewComponent implements OnInit {

  /**
   * Loggin error to be displayed
   */
  public loginError: string = null;
  
  /**
   * MLoading status of the login button
   */
  public loginButtonLoadingStatus: number = -1;

  constructor(
      private router: Router,
      private loginService: LoginService
    ) { }

  ngOnInit(): void {
  }
  
  /**
   * Submit form to login
   */
  public login(formStates: ITlFormItemState[]){
    this.loginError = null;
    this.loginButtonLoadingStatus = 0;
    let stockCode = this.getState('stock-code', formStates).value;
    this.loginService.login(stockCode).then(
      () => {
        this.loginButtonLoadingStatus = 1;
        this.router.navigate(['/stock']);
      },
      (error) => {
        this.loginButtonLoadingStatus = 2;
        this.loginError = 'Ce code n\'existe pas';
        setTimeout(() => {
          this.loginButtonLoadingStatus = -1;
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
