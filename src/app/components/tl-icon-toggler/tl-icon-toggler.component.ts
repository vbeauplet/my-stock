import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'tl-icon-toggler',
  templateUrl: './tl-icon-toggler.component.html',
  styleUrls: ['./tl-icon-toggler.component.css']
})
export class TlIconTogglerComponent implements OnInit {
  
  /**
   * Size of the square icon, in px
   */
  @Input() size: number = 40;
  
  /**
   * Initial state of the icon toggler
   */
  @Input() initialState: boolean = false;
  
  /**
   * Accentuation color of the icon when toggled on
   */
  @Input() color: string = 'tl-outline';

  /**
   * Icon, in the tl-icon-system
   */
  @Input() icon: string = 'tl-ion-heart';
  
  /**
   * Icon, in the tl-icon-system, when the toggler is toggled on
   * If undefined, icon is the default 'icon'
   */
  @Input() iconOn: string = undefined;

  /**
   * Event that is raised when toggler is toggled on
   */
  @Output() toggleOn: EventEmitter<any> = new EventEmitter();
  
  /**
   * Event that is raised when toggler is toggled off
   */
  @Output() toggleOff: EventEmitter<any> = new EventEmitter();
  
  /**
   * Event that is raised when toggler is toggled
   * Carries the new state as payload
   */
  @Output() toggle: EventEmitter<boolean> = new EventEmitter();
  
  /**
   * State of the toggler
   */
  public state: boolean;
  
  /**
   * Flag to tell if 'off' icon is bounced
   */
  public iconOffBounced: boolean;

  constructor() {
  }
  
  ngOnInit(): void {
    this.state = this.initialState;
  }
  
  /**
   * Handles bounce click event
   */
  public bounce(){
    
    // If toggler is in "off" state
    if(!this.state){
      this.state = true;
      this.toggleOn.next();
      this.toggle.next(true);
      this.iconOffBounced = true;
      setTimeout(() => {
          this.iconOffBounced = false;
        }, 500);
    }
    
    // If toggler is in "on" state
    else{
      this.state = false;
      this.toggleOff.next();
      this.toggle.next(false);
    }
  }
}
