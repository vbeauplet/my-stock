import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './guards/LoginGuard';
import { LoginViewComponent } from './views/login-view/login-view.component';
import { PlaceViewComponent } from './views/place-view/place-view.component';
import { ProfileViewComponent } from './views/profile-view/profile-view.component';
import { RegisterViewComponent } from './views/register-view/register-view.component';
import { ShoppingViewComponent } from './views/shopping-view/shopping-view.component';
import { StatsViewComponent } from './views/stats-view/stats-view.component';
import { StockViewComponent } from './views/stock-view/stock-view.component';

const routes: Routes = [
    { path: 'register', component: RegisterViewComponent },
    { path: 'login', component: LoginViewComponent },
    { path: 'stock', component: StockViewComponent, canActivate: [LoginGuard] },
    { path: 'stock/:id', component: PlaceViewComponent },
    { path: 'stats', component: StatsViewComponent },
    { path: 'shopping', component: ShoppingViewComponent },
    { path: 'profile', component: ProfileViewComponent },
  
    // otherwise redirect to stock page
    { path: '**', redirectTo: 'stock' }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
