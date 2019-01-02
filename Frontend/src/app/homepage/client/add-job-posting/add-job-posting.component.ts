import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { JobPostingService } from "src/app/services/job-posting.service";
import { Router } from "@angular/router";
import { NgbDate, NgbCalendar } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "src/app/services/auth.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-add-job-posting",
  templateUrl: "./add-job-posting.component.html",
  styleUrls: ["./add-job-posting.component.scss"]
})
export class AddJobPostingComponent implements OnInit {
  validText = new RegExp("^([a-zA-Z0-9]|[- @.#&!',_])*$");
  jobTypes = ["Full-time", "Part-time", "Intern", "Select job type..."];
  education = [
    "Highschool",
    "Bachelor",
    "Master",
    "Doctor",
    "Select education level..."
  ];

  loggedInUser;
  experience = [
    "<1",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20+",
    "Select experience..."
  ];

  validDate = false;
  hoveredDate: NgbDate;
  todayDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;

  loading = false;

  constructor(
    private fb: FormBuilder,
    private jobPostingService: JobPostingService,
    private calendar: NgbCalendar,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.todayDate = this.calendar.getToday();
    this.fromDate = this.calendar.getToday();
    this.toDate = this.calendar.getNext(this.calendar.getToday(), "d", 10);

    if (this.fromDate >= this.todayDate) {
      this.validDate = true;
    } else {
      this.validDate = false;
    }

    this.loggedInUser = this.authService.getUser();
    this.loading = false;
  }

  newJobPostingFormHP = this.fb.group({
    title: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern(this.validText)
      ])
    ],
    location: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern(this.validText)
      ])
    ],
    education: ["", Validators.compose([Validators.required])],
    experience: [
      "",
      Validators.compose([Validators.required, Validators.maxLength(3)])
    ],
    jobType: ["", Validators.compose([Validators.required])],
    description: [
      "",
      Validators.compose([
        Validators.maxLength(300),
        Validators.pattern(this.validText)
      ])
    ]
  });

  buildJobPostingDataOnAddJobPosting(
    id: number,
    title: string,
    description: string,
    jobType: string,
    education: string,
    experience: number,
    dateFrom: string,
    dateTo: string
  ) {
    const newJobPostingData = {
      id: id,
      title: title,
      description: description,
      jobType: jobType,
      education: education,
      experience: experience,
      dateFrom: dateFrom,
      dateTo: dateTo
    };
    return newJobPostingData;
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    this.calculateDateValidity()
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      date.equals(this.toDate) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  calculateDateValidity() {
    let monthToDate,
      monthFromDate,
      dayToDate,
      dayFromDate,
      dateFrom,
      dateTo,
      dateToday,
      monthTodayDate,
      dayTodayDate;

    if (this.fromDate && this.toDate) {
      if (this.fromDate.month < 10) {
        monthFromDate = `0${this.fromDate.month}`;
      } else {
        monthFromDate = this.fromDate.month;
      }

      if (this.fromDate.day < 10) {
        dayFromDate = `0${this.fromDate.day}`;
      } else {
        dayFromDate = this.fromDate.day;
      }

      if (this.toDate.month < 10) {
        monthToDate = `0${this.toDate.month}`;
      } else {
        monthToDate = this.toDate.month;
      }

      if (this.fromDate.day < 10) {
        dayToDate = `0${this.toDate.day}`;
      } else {
        dayToDate = this.toDate.day;
      }

      if (this.todayDate.month < 10) {
        monthTodayDate = `0${this.todayDate.month}`;
      } else {
        monthTodayDate = this.todayDate.month;
      }

      if (this.todayDate.day < 10) {
        dayTodayDate = `0${this.todayDate.day}`;
      } else {
        dayTodayDate = this.todayDate.day;
      }

      dateFrom = `${this.fromDate.year}/${monthFromDate}/${dayFromDate}`;
      dateTo = `${this.toDate.year}/${monthToDate}/${dayToDate}`;
      dateToday = `${this.todayDate.year}/${monthTodayDate}/${dayTodayDate}`;
    }

    if (new Date(dateFrom) >= new Date(dateToday)) {
      this.validDate = true;
    } else {
      this.validDate = false;
    }

    return {
      dateTo: dateTo,
      dateFrom: dateFrom
    }
  }

  fixJobType() {
    let jobType;
    switch (this.newJobPostingFormHP.value.jobType) {
      case "Full-time":
        jobType = "Full_time";
        break;
      case "Part-time":
        jobType = "Part_time";
        break;
      case "Intern":
        jobType = "Intern";
        break;
    }
    return jobType
  }

  onSubmitNewJobPosting() {
    this.loading = true;
    this.newJobPostingFormHP.controls["title"].markAsTouched();
    this.newJobPostingFormHP.controls["location"].markAsTouched();
    this.newJobPostingFormHP.controls["education"].markAsTouched();
    this.newJobPostingFormHP.controls["experience"].markAsTouched();
    this.newJobPostingFormHP.controls["jobType"].markAsTouched();

    let jobPostingData = this.buildJobPostingDataOnAddJobPosting(
      this.loggedInUser.id,
      this.newJobPostingFormHP.value.title,
      this.newJobPostingFormHP.value.description,
      this.fixJobType(),
      this.newJobPostingFormHP.value.education,
      this.newJobPostingFormHP.value.experience,
      this.calculateDateValidity().dateFrom,
      this.calculateDateValidity().dateTo
    );

    if (
      this.newJobPostingFormHP.valid &&
      this.fromDate &&
      this.toDate &&
      this.validDate
    ) {
      this.jobPostingService.addJobPosting(jobPostingData).subscribe(
        response => {
          this.loading = false;
          this.toastr.success("", "Job posting added successfully!");
          this.router.navigate(["/client/job-postings"]);
        },
        error => {
          if (error.status == 401) {
            this.authService.logout();
            this.loading = false;
            return;
          }
          if (!!error.error.errors) {
            this.toastr.error(
              error.error.errors.Error[0],
              "Error occured!"
            );
            this.loading = false;
          }
        }
      );
    }
  }
}
