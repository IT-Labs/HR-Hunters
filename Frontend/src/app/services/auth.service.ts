import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { User } from "../models/user.model";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  // Gets the users token
  getToken() {
    return this.token;
  }

  // Checks if the user is authenticated
  getIsAuth() {
    return this.isAuthenticated;
  }

  // Check users authentication status
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  // Saves the token to the local storage
  private saveAuthData(token: string) {
    localStorage.setItem("token", token);
  }

  // Deletes the token from the local storage
  private clearAuthData() {
    localStorage.removeItem("token");
  }

  // REGISTER
  registerUser(name: string, email: string, password: string) {
    const authData: User = {
      id: null,
      email: email,
      password: password,
      name: name
    };
    this.http.post("BACKEND_URL", authData).subscribe(response => {});
    this.router.navigate(["/"]);
  }

  // LOGIN
  loginUser(email: string, password: string) {
    const authData: User = { email: email, password: password };
    this.http
      .post<{ token: string }>("BACKEND_URL", authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.saveAuthData(token);
          this.router.navigate(["/"]);
        }
      });
  }

  // Call the func for getting the token from local storage on when user comes back to website
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
  }

  // Get token from local storage
  private getAuthData() {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    return {
      token: token
    };
  }

  // LOGOUT
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }
}
