import { Component, OnInit } from "@angular/core";
import { JobPosting } from "src/app/models/job-posting.model";
import { JobPostingService } from "src/app/services/job-posting.service";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { ApplicationService } from "src/app/services/application.service";

@Component({
  selector: "app-job-posting-details",
  templateUrl: "./job-posting-details.component.html",
  styleUrls: ["./job-posting-details.component.scss"]
})
export class JobPostingDetailsComponent implements OnInit {
  jobPosting: JobPosting = {
    jobTitle: '',
    jobType: '',
    description: '',
    dateFrom: '',
    dateTo: '',
    education: '',
    experience: 0
  };
  jobPostingId;
  isApplicant = false;
  loggedInUser;
  loading = false;

  private jobPostingSub: Subscription;

  constructor(
    private jobPostingService: JobPostingService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.loggedInUser = this.authService.getUser();
    if (this.loggedInUser.role === 1) {
      this.isApplicant = true;
    }
    this.jobPostingId = this.activatedRoute.snapshot.paramMap.get('id')
    this.jobPostingService.getJobPosting(this.jobPostingId);
    this.jobPostingSub = this.jobPostingService.getJobPostingEditListener().subscribe(
      jobPostingData => {
        this.jobPosting = jobPostingData
        this.loading = false;
      }
    )
  }

  buildApplicationData(applicantId: number, jobId: number) {
    const applicationData = {
      applicantId: applicantId,
      jobId: jobId
    };
    return applicationData;
  }

  onApply() {
    this.loading = true;
    let applicationData = this.buildApplicationData(
      this.loggedInUser.id,
      this.jobPostingId
    );
    this.applicationService.addApplication(applicationData);
    this.loading = false;
  }

  ngOnDestroy() {
    this.jobPostingSub.unsubscribe();
  }
}
