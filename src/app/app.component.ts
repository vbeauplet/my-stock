import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ITlTheme, TlThemeService } from 'ngx-tl-common';
import { initializeApp } from "firebase/app";
import { AppService } from './services/app.service';
import { TlcMenuService } from './services/tl-menu.service';
import { ITlMenuItem } from './services/tl-menu-item.interface';

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
      iconOn:'ion-speedometer',
      route:'/stock'
    },
    {
      id: 'stats',
      label:'Stats',
      icon:'ion-stats-chart-outline',
      iconOn:'ion-stats-chart',
      route:'/stats'
    },
    {
      id: 'shopping',
      label:'Liste',
      icon:'ion-receipt-outline',
      iconOn:'ion-receipt',
      route:'/shopping'
    },
    {
      id: 'search',
      label:'Recherche',
      icon:'ion-search-outline',
      iconOn:'ion-search',
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
    public menuService: TlcMenuService,
    public themeService: TlThemeService,
    public appService: AppService) {
      
      // Configure firebase
      const firebaseConfig = {
        apiKey: "AIzaSyC9MLc19dgPr2M_1t29wzNYCBm8x16OLZE",
        authDomain: "my-personal-stock.firebaseapp.com",
        projectId: "my-personal-stock",
        storageBucket: "my-personal-stock.appspot.com",
        messagingSenderId: "66957192486",
        appId: "1:66957192486:web:2971449e8c8bb87fa865e7",
        measurementId: "G-1P49T1PSPS"
      };
      
      // Initialize Firebase
      const firebaseApp: any = initializeApp(firebaseConfig);
      this.appService.firebaseApp = firebaseApp;
    }
    
  ngOnInit() {
    // Initialize app menu
    this.menuService.init(this.menuItems);
    
    // Initialize app theme
    this.themeService.init([this.theme],'tweed');
  }
}
