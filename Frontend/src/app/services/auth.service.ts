import { Injectable } from "@angular/core";
import { HttpClient, HttpRequest } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { environment } from "../../environments/environment";
import { ToastrService } from "ngx-toastr";

@Injectable({ providedIn: "root" })
export class AuthService {
  baseUrl = environment.baseUrl;

  user = {
    id: null,
    firstName: "",
    lastName: "",
    token: "",
    email: "",
    role: 0
  };

  private roleStatusListener = new Subject<{
    role: number;
  }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  // Gets the users token
  getToken() {
    return localStorage.getItem("token");
  }

  getUser() {
    let user = localStorage.getItem("user");
    return JSON.parse(user);
  }

  getAuthData() {
    let token = this.getToken();
    let loggedInUser = this.getUser();
    if (!token || !loggedInUser) {
      return;
    }
    this.user.role = loggedInUser.role;
    return this.user;
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

  // DA
  saveAuthData(token: string) {
    const hasToken = localStorage.getItem("token");
    if (hasToken) {
      localStorage.removeItem("token");
    }
    localStorage.setItem("token", token);
  }

  // Deletes the token and user from the local storage
  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  // DA
  saveUserData(user: any) {
    const hasUserData = localStorage.getItem("user");
    const userData = JSON.parse(hasUserData);
    if (userData) {
      localStorage.removeItem("user");
    }
    localStorage.setItem("user", JSON.stringify(this.user));
  }

  // REGISTER
  registerUser(authData) {
    return this.http.post(this.baseUrl + "/Authentication/register", authData)
  }

  // LOGIN
  loginUser(authData) {
    return this.http.post<{
        firstName: string | null;
        lastName: string | null;
        token: string | null;
        email: string | null;
        id: number | null;
        role: number;
        newUser: boolean;
      }>(this.baseUrl + "/Authentication/login", authData)
      
  }

  // Caching unauthorized requests
  cachedRequests: Array<HttpRequest<any>> = [];

  public collectFailedRequest(request): void {
    this.cachedRequests.push(request);
  }

  // LOGOUT
  logout() {
    this.user = {
      id: null,
      firstName: "",
      lastName: "",
      token: "",
      email: "",
      role: 0
    };
    this.clearAuthData();
    this.router.navigate(["/login"]);
  }
}
