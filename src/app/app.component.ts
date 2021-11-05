import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ITlMenuItem, ITlTheme, TlMenuService, TlThemeService } from 'ngx-tl-common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'own-stock';
  
  public menuItems: ITlMenuItem[] = [
    {
      id: 'stock',
      label:'Stock',
      icon:'ion-speedometer-outline',
      route:'/stock'
    },
    {
      id: 'stats',
      label:'Stats',
      icon:'ion-stats-chart-outline',
      route:'/stats'
    },
    {
      id: 'search',
      label:'Recherche',
      icon:'ion-search-outline',
      route:'/search'
    }
  ];
  
  public theme: ITlTheme = {
      name: 'tweed',
      label: 'Tweed',
      
      mainBgColor: '#474747',
      mainBgPattern: 'url("/assets/img/tweed.png")',
      elementBgColor: '#474747',
      secondaryBgColor: '#8CBDB9',
      menuBgColor: 'rgba(0,0,0,0.3)',
      transparentBgColor: 'rgba(0,0,0,0.3)',
      sharpTransparentBgColor: 'rgba(0,0,0,0.7)',
      glassBgColor: 'rgba(0,0,0,0.4)',
      
      mainContentColor: '#F2E9EB',
      menuContentColor: '#F2E9EB',
      secondaryContentColor: '#212529',
      outlineContentColor: '#47E087',
      successContentColor: 'green',
      failureContentColor: 'red',
      neutralContentColor: 'orange',
      softContentColor: '#5b7480',
      
      lightShadowColor: '#515151',
      darkShadowColor: '#3d3d3d',
      sharpLightShadowColor: '#525252',
      sharpDarkShadowColor: '#3c3c3c',
      
      lightDomeColor: '#4c4c4c',
      darkDomeColor: '#404040',
      
      titleFont: 'Hammersmith One',
      subtitleFont: 'Hammersmith One',
      mainFont: 'Roboto',
      
      primaryStyle: 'tl-soft-transparent',
      secondaryStyle: 'tl-glassmorphic',
      preferedShape: 'tl-round'
    };
  
  constructor(
    public router: Router,
    public menuService: TlMenuService,
    public themeService: TlThemeService) {}
    
  ngOnInit() {
    // Initialize app menu
    this.menuService.init(this.menuItems);
    
    // Initialize app theme
    this.themeService.init([this.theme],'tweed');
  }
}
