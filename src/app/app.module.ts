import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// External modules
import { NgxTlCommonModule } from 'ngx-tl-common';
import { GoogleChartsModule } from 'angular-google-charts';

// Views
import { StockViewComponent } from './views/stock-view/stock-view.component';
import { StatsViewComponent } from './views/stats-view/stats-view.component';
import { PlaceViewComponent } from './views/place-view/place-view.component';

// Components
import { TlGaugeComponent } from './components/tl-gauge/tl-gauge.component';

@NgModule({
  declarations: [
    AppComponent,
    TlGaugeComponent,
    StockViewComponent,
    StatsViewComponent,
    PlaceViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxTlCommonModule,
    GoogleChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
