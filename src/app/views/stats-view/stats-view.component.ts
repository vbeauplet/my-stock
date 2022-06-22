import { Component, HostListener, OnInit } from '@angular/core';
import { TlThemeService } from 'ngx-tl-common';
import { HouseholdService } from 'src/app/services/household.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'ms-stats-view',
  host: { 'class' : 'tl-padded-page'},
  templateUrl: './stats-view.component.html',
  styleUrls: ['./stats-view.component.css']
})
export class StatsViewComponent implements OnInit {
  
  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    if(this.isEnergyChartReady){
      this.refreshEnergyChart();
      this.refreshPriceChart();
    }
  }
  
  /**
   * Tells if Energy chart is ready for display
   */
  public isEnergyChartReady: boolean = false;
  
    /**
   * Tells if Price chart is ready for display
   */
  public isPriceChartReady: boolean = false;
  
  /**
   * Chart type
   */
  public chartType: String = 'PieChart';
  
  /**
   * Energy Chart column names
   */
  public energyChartColumnNames: String[] = ['Category', 'kCal'];
  
  /**
   * Energy Chart column names
   */
  public priceChartColumnNames: String[] = ['Category', '€'];
   
  /**
   * Stat: Energy chart bindable data 
   */
  public energyChartData: any[] = [];
  
    /**
   * Stat: Price chart bindable data 
   */
  public priceChartData: any[] = [];
   
   /**
    * Charts display options
    */
  public chartOptions: any = null;
  
  /**
   * Tells if all stats have been computed
   */
  public areStatsComputed: boolean = true;

  /**
   * Stat: Bindable total energy
   */
  public totalEnergy: number = 0;

  /**
   * Stat: Bindable total price
   */
  public totalPrice: number = 0;
  
  /**
   * Stat: bindable autonomy
   */
  public autonomy:number = 0;

  constructor(
      private tlThemeService: TlThemeService,
      private stockService: StockService,
      private householdService: HouseholdService
    ) {}

  ngOnInit(): void {
    
    // Set chart options
    this.chartOptions = {
        backgroundColor: { fill:'transparent' },
        legend: {
          position:'none',
          textStyle: {color: this.tlThemeService.currentTheme.mainContentColor, fontSize: 16},
          alignment: 'center'
        },
        pieSliceTextStyle: {
          color: 'white'
        },
        fontName: this.tlThemeService.currentTheme.mainFont,
        pieSliceText:'label',
        pieSliceBorderColor:'transparent',
        colors:[
            this.tlThemeService.currentTheme.outlineContentColor, 
            this.tlThemeService.currentTheme.softContentColor,
            this.tlThemeService.currentTheme.secondaryContentColor,
            this.tlThemeService.currentTheme.successContentColor,
            this.tlThemeService.currentTheme.neutralContentColor,
            this.tlThemeService.currentTheme.failureContentColor,
            this.tlThemeService.currentTheme.mainContentColor
          ]
      };
    
    // Try compute stats
    this.tryComputeStats()
   
    // Else wait till all needed services are loaded
    this.stockService.stockResolvedSubject.subscribe(() =>{
        this.tryComputeStats()
      });
    this.householdService.householdSubject.subscribe(() =>{
        this.tryComputeStats()
      });
  }
  
  /**
   * Computes stats if related services are loaded
   */
  public tryComputeStats(){
    if(this.stockService.isLoaded && this.householdService.isLoaded){
      this.computeStats();
    }
  }
  
  /**
   * Do computes stats
   */
  public computeStats(){
    // Tell stats are being computed
    this.areStatsComputed = false;
    
    // Compute basic total stats for energy, price and autonomy
    this.totalEnergy = 0;
    this.totalPrice = 0;
    this.autonomy = 0;
    for(let place of this.stockService.places){
      for(let batch of place.resolvedBatches){
        this.totalEnergy += batch.energy * batch.weight * batch.quantity;
        this.totalPrice += batch.price * batch.quantity;
      }
    }
    this.totalEnergy = Math.round(this.totalEnergy);
    this.totalPrice = Math.round(this.totalPrice);
    this.autonomy = Math.round(this.totalEnergy / this.householdService.household.computedNumberOfCalories);
    
    // Compute energy chart data
    this.energyChartData = [];
    for(let category of this.householdService.household.categories){
      this.energyChartData.push([category, this.computeEnergyFor(category)]);
    }
    this.refreshEnergyChart();
    
        // Compute price chart data
    this.priceChartData = [];
    for(let category of this.householdService.household.categories){
      this.priceChartData.push([category, this.computePriceFor(category)]);
    }
    this.refreshPriceChart();
    
    // Flag that stats have been computed
    this.areStatsComputed = true;
    
  }
  
  
  /**
   * Computes the total energy for a particular category of the stock
   */
  public computeEnergyFor(category: string): number {
    let result: number = 0;
    for(let place of this.stockService.places){
      for(let batch of place.resolvedBatches){
        if(batch.category == category){
          result += batch.energy * batch.weight * batch.quantity;
        }
      }
    }
    return result;
  }
  
    /**
   * Computes the total price for a particular category of the stock
   */
  public computePriceFor(category: string): number {
    let result: number = 0;
    for(let place of this.stockService.places){
      for(let batch of place.resolvedBatches){
        if(batch.category == category){
          result += batch.price * batch.quantity;
        }
      }
    }
    return result;
  }
  
  /**
   * Refreshes the energy chart display from new data
   */
  public refreshEnergyChart(){
    this.isEnergyChartReady = false;
    setTimeout(() => {
      this.isEnergyChartReady = true;
    }, 500);
  }
  
    
  /**
   * Refreshes the price chart display from new data
   */
  public refreshPriceChart(){
    this.isPriceChartReady = false;
    setTimeout(() => {
      this.isPriceChartReady = true;
    }, 500);
  }

}
