import { Component, OnInit } from '@angular/core';
import { JobPosting } from 'src/app/models/job-posting.model';

@Component({
  selector: 'app-job-posting-details',
  templateUrl: './job-posting-details.component.html',
  styleUrls: ['./job-posting-details.component.scss']
})
export class JobPostingDetailsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  jobPosting: JobPosting = {
    jobTitle: 'JavaScript Developer wanted',
    jobType: 'JavaScript',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime laboriosam facilis quod molestias autem ipsum maiores aliquid suscipit quis perferendis sed voluptatum ullam laudantium soluta nulla eveniet aliquam, impedit est?',
    dateFrom: '12/12/2018',
    dateTo: '20/12/2018',
    companyEmail: 'company@comp.com',
    companyName: 'Anhoch',
    education: 'High-school',
    experience: 5,
    id: 123,
    location: 'Skopje',
    logo: 'logo.jpg',
    status: 'Active'
  }

}
