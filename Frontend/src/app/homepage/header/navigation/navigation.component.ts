import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { ClientService } from "src/app/services/client.service";

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.scss"]
})
export class NavigationComponent implements OnInit {
  activeApplicant = true;
  activeClient = false;
  name = "Josh";
  test = "";
  loggedInUser;
  loggedInClient;

  constructor(
    private authService: AuthService,
    private clientService: ClientService
  ) {}

  ngOnInit() {
    this.loggedInUser = this.authService.getUser();
    this.name = `${this.loggedInUser.firstName}`;

    if (this.loggedInUser.role === 1) {
      this.activeApplicant = true;
    } else if (this.loggedInUser.role === 2) {
      this.activeApplicant = false;

      this.clientService.getClient(this.loggedInUser.id);
      this.clientService.getClientProfileListener().subscribe(client => {
        this.loggedInClient = client;

        if (client.client.status === "Active") {
          this.activeClient = true;
        } else if (client.client.status === "Inactive") {
          this.activeClient = false;
        }
      });
    }
  }

  // Closing the dropdown on click on link
  onDropdownClick() {
    const dropdown = document.getElementById("homepage-navigation");

    if (dropdown.classList.contains("show")) {
      dropdown.classList.remove("show");
    }
  }

  onLogout() {
    this.authService.logout();
  }
}
