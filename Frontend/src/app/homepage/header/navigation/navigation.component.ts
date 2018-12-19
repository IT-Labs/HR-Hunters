import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  activeApplicant = true;
  name = 'Josh'
  test = '';
  loggedInUser;

  constructor(private authService: AuthService) { }

  ngOnInit() {  
   this.loggedInUser = this.authService.getUser();

   this.name = `${this.loggedInUser.firstName}`;

   if (this.loggedInUser.role === 1) {
     this.activeApplicant = true;
   } else if (this.loggedInUser.role === 2) {
     this.activeApplicant = false;
   }
  }

  onLogout() {
    this.authService.logout()
  }
}
