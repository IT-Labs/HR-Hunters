import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.scss"]
})
export class AdminDashboardComponent implements OnInit, OnDestroy {

  adminIsAuthenticated = false;

  dropdownOpen = false;

  private authListenerSubs: Subscription;
  
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    //this.adminIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.adminIsAuthenticated = isAuthenticated;
    })
    this.router.navigate(['/admin-dashboard/job-postings'])
  }

  // Closing the dropdown on click on link
  onDropdownClick() {
    const dropdown = document.getElementById('sidebar-navigation');

    if (dropdown.classList.contains('show')) {
      dropdown.classList.remove('show');
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
