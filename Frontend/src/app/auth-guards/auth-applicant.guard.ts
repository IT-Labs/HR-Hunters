import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router
  } from "@angular/router";
  import { Injectable } from "@angular/core";
  import { Observable } from "rxjs";
  
  import { AuthService } from "../services/auth.service";
  
  @Injectable()
  export class AuthApplicantGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
  
    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): boolean | Observable<boolean> | Promise<boolean> {
      const user = this.authService.getAuthData();
      const token = this.authService.getToken();
      let isAuth;
  
      if (!token && !user) {
        this.router.navigate(["/login"]);
        isAuth = false
        return isAuth
      }
  
      if (user.role === 1) {
        isAuth = true;
      } else {
        this.router.navigate(["/welcome"]);
        isAuth = false
      }

      return isAuth;
    }
  }
  