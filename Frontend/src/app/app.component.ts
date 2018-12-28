import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  loggedInUser;

  constructor(
    public http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  public ping() {
    this.http
      .get("")
      .subscribe(data => console.log(data), err => console.log(err));
  }
}
