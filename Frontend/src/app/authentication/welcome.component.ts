import { Component } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.scss"]
})
export class WelcomeComponent {

  loading = false;
  role = 3;

  constructor(private authService: AuthService, private router: Router) {}

  onSelectRole(role: number) {
    this.role = role;
    this.authService.selectRole(this.role)
  }
}
