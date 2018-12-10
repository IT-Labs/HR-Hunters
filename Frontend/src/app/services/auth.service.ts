import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { User } from "../models/user.model";
import { Subject } from "rxjs";
import { Client } from "../models/client.model";
import { Applicant } from "../models/applicant.model";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class AuthService {
  baseUrl = environment.baseUrl;

  private isAuthenticated = false;
  private user = {
    id: null,
    firstName: '',
    lastName: '',
    token: "",
    email: "",
    role: 0
  };
  
  private roleStatusListener = new Subject<{
    role: number;
  }>();

  private authStatusListener = new Subject<boolean>();
  private authErrorStatusListener = new Subject<{
    error: string;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  // Gets the users token
  getToken() {
    return this.user.token;
  }

  getUser() {
    return this.user;
  }

  // Checks if the user is authenticated
  getIsAuth() {
    this.autoAuthUser();
    return this.isAuthenticated;
  }

  // Check users authentication status
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getAuthErrorStatusListener() {
    return this.authErrorStatusListener.asObservable();
  }

  getRoleStatusListener() {
    return this.roleStatusListener.asObservable();
  }

  getRole() {
    return this.user.role;
  }

  selectRole(role: number) {
    this.user.role = role;
  }

  // Saves the token to the local storage and deletes the old one if there already is a token saved
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

  // Saves the token to the local storage and deletes the old one if there already is a token saved
  private saveUserData(user: any) {
    const hasUserData = localStorage.getItem('user');
    const userData = JSON.parse(hasUserData);
    if (userData) {
      localStorage.removeItem("user");
    }
    localStorage.setItem("user", JSON.stringify(this.user));
  }

  // Deletes the token from the local storage
  private clearUserData() {
    localStorage.removeItem("user");
  }

  // REGISTER
  registerUser(
    companyName: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    userType: number
  ) {
    let authData: Client | Applicant;
    // FOR APPLICANTS
    if (companyName === null) {
      authData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        userType: userType
      };
      // FOR CLIENTS
    } else if (firstName === null) {
      authData = {
        firstName: companyName,
        lastName: lastName,
        email: email,
        password: password,
        userType: userType
      };
    }
    this.http
      .post<{
        succeeded: false;
        errors: {
          Error: string[] | null
        };
      }>(this.baseUrl + "/Authentication/register", authData)
      .subscribe(
        response => {
          if (response.succeeded) {
            this.router.navigate(["login"]);
          }
          if (!response.succeeded) {
            this.authErrorStatusListener.next({
              error: "Unknown error occured"
            });
          }
        },
        error => {
          if (error.error.errors) {
            this.authErrorStatusListener.next({
              error: error.error.errors.Error[0]
            });
          }
        }
      );
  }

  // LOGIN
  loginUser(email: string, password: string) {
    const authData: User = { email: email, password: password };
    this.http
      .post<{
        succeeded: boolean;
        firstName: string | null;
        lastName: string | null;
        token: string | null;
        email: string | null;
        id: number | null;
        role: number;
        errors: {
          Error: string[] | null;
        };
      }>(this.baseUrl + "/Authentication/login", authData)
      .subscribe(
        response => {
          if (response.succeeded) {
            const token = response.token;
            this.user.token = token;
            this.user.id = response.id;
            this.user.email = response.email;
            this.user.role = response.role;
            this.user.firstName = response.firstName;
            this.user.lastName = response.lastName;
            if (token) {
              this.isAuthenticated = true;
              this.authStatusListener.next(true);
              this.saveAuthData(token);
              this.saveUserData(JSON.stringify(this.user));
              if (response.role === 1) {
                this.router.navigate(["/applicant"]);
              } else if (response.role === 2) {
                this.router.navigate(["/client"]);
              } else if (response.role === 3) {
                this.router.navigate(["/admin-dashboard"]);
              }
            }
          } else if (!response.succeeded) {
            if (response.errors) {
              this.authErrorStatusListener.next({
                error: response.errors.Error[0]
              });
            }
          }
        },
        error => {
          if (error.error.errors) {
            this.authErrorStatusListener.next({
              error: error.error.errors.Error[0]
            });
          }
        }
      );
  }

  checkTokenValidity(token: string) {
    let validToken;
    this.http
      .post<{
        isValid: boolean;
        token: string;
      }>("BACKEND_URL", token)
      .subscribe(response => {
        if (!response.isValid) {
          return { isvalid: false, token: "" };
        }
        this.user.token = response.token;
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.saveAuthData(token);
        validToken = response.token;
      });
    return { isvalid: true, token: validToken };
  }

  // Call the func for getting the token from local storage on when user comes back to website
  autoAuthUser() {
    const token = this.getAuthData();
    if (!token) {
      return;
    } else if (token) {
    }
    this.isAuthenticated = true;
    this.user.token = token.token;
    this.authStatusListener.next(true);
  }

  // Get token from local storage
  private getAuthData() {
    let token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    if (!this.checkTokenValidity(token).isvalid) {
      return;
    }
    token = this.checkTokenValidity(token).token;
    return {
      token: token
    };
  }

  // LOGOUT
  logout() {
    this.user.token = null;
    this.user.email = "";
    this.user.id = "";
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.clearUserData
    this.router.navigate(["/login"]);
  }
}
