import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaceViewComponent } from './views/place-view/place-view.component';
import { ShoppingViewComponent } from './views/shopping-view/shopping-view.component';
import { StatsViewComponent } from './views/stats-view/stats-view.component';
import { StockViewComponent } from './views/stock-view/stock-view.component';

const routes: Routes = [
    { path: 'stock', component: StockViewComponent },
    { path: 'stock/:id', component: PlaceViewComponent },
    { path: 'stats', component: StatsViewComponent },
    { path: 'shopping', component: ShoppingViewComponent },
  
    // otherwise redirect to stock page
    { path: '**', redirectTo: 'stock' }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
