import { Component, HostListener, OnInit } from '@angular/core';
import { TlThemeService } from 'ngx-tl-common';

@Component({
  selector: 'ms-stats-view',
  host: { 'class' : 'tl-padded-page'},
  templateUrl: './stats-view.component.html',
  styleUrls: ['./stats-view.component.css']
})
export class StatsViewComponent implements OnInit {
  
  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    if(this.isChartReady){
      this.refreshChart();
    }
  }
  
  /**
   * Tells if chart is ready for display
   */
  public isChartReady: boolean = false;
  
  /**
   * Chart type
   */
  public chartType: String = 'PieChart';
  
  /**
   * Chart column name
   */
  public chartColumnNames: String[] = ['Browser', 'Percentage'];
   
  /**
   * Bindable chart data 
   */
  public chartData: any[] = [
       ['Firefox', 45.0],
       ['IE', 26.8],
       ['Chrome', 12.8],
       ['Safari', 8.5],
       ['Opera', 6.2],
       ['Others', 0.7] 
    ];
   
   /**
    * Chart display options
    */
   public chartOptions: any = null;
  

  constructor(
      private tlThemeService: TlThemeService
    ) {}

  ngOnInit(): void {
    
    // Set chart options
    this.chartOptions = {
        backgroundColor: { fill:'transparent' },
        legend: {
          position:'bottom',
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
   
    // Tell chart is ready for display
    this.isChartReady = true;
   
    // Stub data modification
    setTimeout(() => {
      this.chartData[2][1] = 20;
      this.refreshChart();
    }, 1000);
    setTimeout(() => {
      this.chartData[2][1] = 30; 
      this.refreshChart();
    }, 2000);
    setTimeout(() => {
      this.chartData[2][1] = 50; 
      this.refreshChart();
    }, 3000);
  }
  
  public refreshChart(){
    this.isChartReady = false;
    setTimeout(() => {
      this.isChartReady = true;
    }, 500);
  }

}
