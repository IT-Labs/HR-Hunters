import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html'
})
export class ApplicantComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

}
