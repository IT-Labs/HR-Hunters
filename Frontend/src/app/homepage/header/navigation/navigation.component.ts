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
  breadcrumbs = ['Home', '\\', 'to be fixed']
  test = '';
  
  constructor(private authService: AuthService) { }

  ngOnInit() {   
  }

  onLogout() {
    this.authService.logout()
  }
}
