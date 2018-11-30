import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { User } from "../models/user.model";
import { Subject } from "rxjs";
import { Client } from "../models/client.model";
import { Applicant } from "../models/applicant.model";
import { environment } from "../../environments/environment"

@Injectable({ providedIn: "root" })
export class AuthService {

  baseUrl = environment.baseUrl;

  private isAuthenticated = false;
  private user = {
    id: null,
    token: "",
    email: ""
  };
  private currentRole;
  private roleStatusListener = new Subject<{
    applicant: boolean;
    client: boolean;
    admin: boolean;
  }>();
  private authStatusListener = new Subject<boolean>();
  private registerStatusListener = new Subject<{
    code: string;
    description: string;
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
    this.autoAuthUser()
    return this.isAuthenticated;
  }

  // Check users authentication status
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getRegisterStatusListener() {
    return this.registerStatusListener.asObservable();
  }

  getRoleStatusListener() {
    return this.roleStatusListener.asObservable();
  }

  getRole() {
    return this.currentRole;
  }

  selectRole(role: any) {
    this.currentRole = role;
    console.log(role);
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

  // REGISTER
  registerUser(
    companyName: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: number
  ) {
    let authData: Client | Applicant;
    if (companyName === null) {
      authData = {
        id: null,
        companyName: companyName,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        role: role
      };
    } else if (firstName === null) {
      authData = {
        id: null,
        companyName: companyName,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        role: role
      };
    }
    this.http
      .post<{
        succeeded: boolean;
        errors: { code: string; description: string };
      }>(this.baseUrl + '/Authentication/register', authData)
      .subscribe(response => {
        if (response.succeeded) {
          this.router.navigate(["login"]);
        } else if (!!response.errors) {
          this.registerStatusListener.next(response.errors[1]);
        }
      });
  }

  // LOGIN
  loginUser(email: string, password: string, role: number) {
    const authData: User = { email: email, password: password, role: role };
    this.http
      .post<{
        succeeded: boolean;
        firstName: string;
        lastName: string;
        companyName: string;
        token: string;
        email: string;
        id: number;
        role: number;
      }>(this.baseUrl + '/Authentication/login', authData)
      .subscribe(response => {
        const token = response.token;
        this.user.token = token;
        this.user.id = response.id;
        this.user.email = response.email;
        if (token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.saveAuthData(token);
          this.router.navigate(["/admin-dashboard/job-postings"]);
        }
      });
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
          return {isvalid: false, token: ''}
        }
        this.user.token = response.token;
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.saveAuthData(token);
        validToken = response.token;
        }
      );
      return {isvalid: true, token: validToken};
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
      return
    }
    token = this.checkTokenValidity(token).token
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
    this.router.navigate(["/login"]);
  }
}
