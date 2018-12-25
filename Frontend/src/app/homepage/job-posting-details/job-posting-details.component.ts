import { Component, OnInit } from "@angular/core";
import { JobPosting } from "src/app/models/job-posting.model";
import { JobPostingService } from "src/app/services/job-posting.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { ApplicationService } from "src/app/services/application.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-job-posting-details",
  templateUrl: "./job-posting-details.component.html"
})
export class JobPostingDetailsComponent implements OnInit {
  jobPosting: JobPosting = {
    jobTitle: "",
    jobType: "",
    description: "",
    dateFrom: "",
    dateTo: "",
    education: "",
    experience: 0
  };
  jobPostingId;
  isApplicant = false;
  loggedInUser;
  loading = false;

  constructor(
    private jobPostingService: JobPostingService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private applicationService: ApplicationService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    this.loggedInUser = this.authService.getUser();
    if (this.loggedInUser.role === 1) {
      this.isApplicant = true;
    }
    this.jobPostingId = this.activatedRoute.snapshot.paramMap.get("id");
    this.jobPostingService
      .getJobPosting(this.jobPostingId)
      .subscribe(jobPostingData => {
        this.jobPosting = jobPostingData;
        this.loading = false;
      });
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
    this.applicationService.addApplication(applicationData).subscribe(
      response => {
        this.router.navigate(["/applicant/job-postings"]);
        this.toastr.success("", "You've applied to this job successfully!");
        this.loading = false;
      },
      error => {
        if (error.status == 401) {
          this.authService.logout();
          this.loading = false;
          return;
        }
        if (!!error.error.errors) {
          this.toastr.error(error.error.errors.Error[0], "Error occured!");
          this.loading = false;
        }
      }
    );
  }
}
