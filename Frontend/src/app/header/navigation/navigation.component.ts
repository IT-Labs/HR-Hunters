import { Component,OnInit, OnDestroy  } from '@angular/core';
import { AuthService } from "../../services/auth.service";
// import { Subscription } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit, OnDestroy  {

  constructor(private authService: AuthService, private router: Router) { }
  ngOnInit() {
 
  }
  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  ngOnDestroy() {
   
  }
}
