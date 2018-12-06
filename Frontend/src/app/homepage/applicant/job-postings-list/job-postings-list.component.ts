import { Component, OnInit } from '@angular/core';
import { JobPosting } from 'src/app/models/job-posting.model';
import { JobPostingService } from 'src/app/services/job-posting.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-job-postings-list',
  templateUrl: './job-postings-list.component.html',
  styleUrls: ['./job-postings-list.component.scss']
})
export class JobPostingsListComponent implements OnInit {

  jobPostingQP = {
    postsPerPage: 10,
    currentPage: 9,
    currentSortBy: "dateTo",
    lastSortBy: "",
    currentSortDirection: 0,
    currentFilter: 0
  }

  private jobPostingSub: Subscription;

  constructor(private jobPostingService: JobPostingService) { }

  ngOnInit() {
    // const params = this.buildQueryParams(this.jobPostingQP);
    // this.jobPostingService.getJobPostings(params);
    // this.jobPostingSub = this.jobPostingService
    //   .getJobPostingUpdateListener()
    //   .subscribe(jobPostingData => {
    //     this.jobPostings = jobPostingData.jobPostings;
    //   });
  }

  buildQueryParams(data) {
    return `?pagesize=${data.postsPerPage}
            &page=${data.currentPage}
            &sort=${data.currentSortBy}
            &sortDir=${data.currentSortDirection}
            &filter=${data.currentFilter}`;
  }

  onScrollDown() {
    console.log('scrolled down!!');
    this.jobPostings.push({
      jobTitle: 'NOVOOO',
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
    })
  }
 
  onScrollUp() {
    console.log('scrolled up!!');
  }

  jobPostings = [
    {
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
  },
    {
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
  },
    {
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
  },
    {
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
  },
    {
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
  },
    {
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
  },
    {
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
  },
    {
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
  },
    {
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
  },
    {
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
  },
    {
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
  },
    {
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
  },
    {
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
  },
    {
    jobTitle: 'POSLEDNO',
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
  },
  ]


}
