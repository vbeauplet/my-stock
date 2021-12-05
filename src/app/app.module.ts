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
import { TlFormComponent } from './components/tl-form/tl-form.component';
import { TlInputComponent } from './components/tl-input/tl-input.component';
import { TlSelectComponent } from './components/tl-select/tl-select.component';
import { TlShapeBlockComponent } from './components/tl-shape-block/tl-shape-block.component';
import { TlIconTogglerComponent } from './components/tl-icon-toggler/tl-icon-toggler.component';
import { TlMobileMenuComponent } from './components/tl-mobile-menu/tl-mobile-menu.component';
import { ShoppingViewComponent } from './views/shopping-view/shopping-view.component';
import { TlDatePickerComponent } from './components/tl-date-picker/tl-date-picker.component';
import { TlCalendarComponent } from './components/tl-calendar/tl-calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    TlGaugeComponent,
    StockViewComponent,
    StatsViewComponent,
    PlaceViewComponent,
    TlFormComponent,
    TlInputComponent,
    TlSelectComponent,
    TlIconTogglerComponent,
    TlMobileMenuComponent,
    ShoppingViewComponent,
    TlDatePickerComponent,
    TlShapeBlockComponent,
    TlCalendarComponent
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
