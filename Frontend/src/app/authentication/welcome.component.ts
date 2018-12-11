import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.scss"]
})
export class WelcomeComponent implements OnInit {

  private userIsAuthenticated = false;
  private authStatusSub: Subscription;

  role = 3;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    //this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onSelectRole(role: number) {
    this.role = role;

    this.authService.selectRole(this.role)
  }

  
}
