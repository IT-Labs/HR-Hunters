import { Component, OnInit, } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.scss"]
})
export class AdminDashboardComponent implements OnInit {

  dropdownOpen = false;
  
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {

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
}
