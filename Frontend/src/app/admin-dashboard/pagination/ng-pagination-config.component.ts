import {Component} from '@angular/core';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ngbd-pagination-config',
    templateUrl: './ng-pagination-config.component.html',
    providers: [NgbPaginationConfig] // add NgbPaginationConfig to the component providers
  })
  export class NgbdPaginationConfig {
    page = 1;
  
    constructor(config: NgbPaginationConfig) {
      // customize default values of paginations used by this component tree
      // config.size = 'lg';
      config.boundaryLinks = true;
      config.directionLinks = true;
    }
  }
  