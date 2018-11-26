import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { User } from "../models/user.model";
import { Subject } from "rxjs";
import { Client } from "../models/client.model";
import { Applicant } from "../models/applicant.model";

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private registerStatusListener = new Subject<{code: string, description: string}>();

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

  getRegisterStatusListener() {
    return this.registerStatusListener.asObservable();
  }

  // Saves the token to the local storage
  private saveAuthData(token: string) {
    const hasToken = localStorage.getItem("token");
    if (hasToken) {
      localStorage.removeItem("token");
    }
    localStorage.setItem("token", token);
  }

  // Deletes the token from the local storage
  private clearAuthData() {
    localStorage.removeItem("token");
  }

  // REGISTER CLIENT
  registerClient(name: string, email: string, password: string) {
    const authData: Client = {
      id: null,
      email: email,
      password: password,
      companyName: name
    };
    this.http
      .post<{
        succeeded: boolean;
        errors: { code: string; description: string };
      }>("BACKEND_URL", authData)
      .subscribe(response => {
        if (response.succeeded) {
          this.router.navigate(["client-login"]);
        } else if (!!response.errors) {
          this.registerStatusListener.next(response.errors[1]) 
        }
      });
  }

  // REGISTER APPLICANT
  registerApplicant(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    const authData: Applicant = {
      id: null,
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName
    };
    this.http.post<{
      succeeded: boolean;
      errors: { code: string; description: string };
    }>("", authData).subscribe(response => {
      if (response.succeeded) {
        this.router.navigate(["applicant-login"]);
      } else if (!!response.errors) {
        this.registerStatusListener.next(response.errors[1]) 
      }
    });
    
  }

  // LOGIN
  loginUser(email: string, password: string) {
    const authData: User = { email: email, password: password };
    this.http
      .post<{ token: string, email: string, id: number }>("BACKEND_URL", authData)
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
