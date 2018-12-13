import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Client } from "src/app/models/client.model";
import { JobPostingService } from "src/app/services/job-posting.service";
import { ClientService } from "src/app/services/client.service";
import { Subscription, Subject, Observable, merge } from "rxjs";
import { NgbDate, NgbCalendar, NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { debounceTime, distinctUntilChanged, filter, map } from "rxjs/operators";

@Component({
  selector: "app-ad-new-job-posting",
  templateUrl: "./new-job-posting.component.html",
  styleUrls: ["./new-job-posting.component.scss"]
})
export class ADNewJobPostingComponent implements OnInit {

  @ViewChild('instance') instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  jobTypes = ["Full-time", "Part-time", "Intership", "Select job type..."];
  education = [
    "High School degree",
    "Bachelor degree",
    "Masters degree",
    "Doctoral degree",
    "Select education level..."
  ];

  validEmail = new RegExp(
    "[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}"
  );
  validDate = false;
  validClient = false;
  clients: Client[] = [];
  clientNames: string[] = [];
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
  selectedCompany: Client = {
    id: null,
    email: null,
    companyName: null,
    activeJobs: null,
    allJobs: null,
    status: null,
    location: null
  };

  hoveredDate: NgbDate;
  todayDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;

  private clientsSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private jobPostingService: JobPostingService,
    private clientService: ClientService,
    private calendar: NgbCalendar
  ) {}

  ngOnInit() {
    const params = this.buildQueryParams();
    this.clientService.getClients(params);
    this.clientsSub = this.clientService
      .getClientsUpdateListener()
      .subscribe(clientsData => {
        this.clients = clientsData.clients;
        clientsData.clients.forEach(c => {
          this.clientNames.push(c.companyName);
        })
      });

    this.todayDate = this.calendar.getToday();
    this.fromDate = this.calendar.getToday();
    this.toDate = this.calendar.getNext(this.calendar.getToday(), "d", 10);

    if (this.fromDate >= this.todayDate) {
      this.validDate = true;
    } else {
      this.validDate = false;
    }
  }

  newJobPostingForm = this.fb.group({
    companyName: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ])
    ],
    title: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50)
      ])
    ],
    description: ["", Validators.compose([Validators.maxLength(300)])],
    jobType: ["", Validators.compose([Validators.required])],
    education: ["", Validators.compose([Validators.required])],
    experience: ["", Validators.compose([Validators.required])]
  });

  buildJobPostingDataOnAddJobPosting(
    existingCompany: boolean,
    id: number,
    companyName: string,
    companyEmail: string,
    companyLocation: string,
    jobTitle: string,
    description: string,
    jobType: string,
    education: string,
    experience: number,
    dateFrom: string,
    dateTo: string
  ) {
    const newJobPostingData = {
      existingCompany: existingCompany,
      id: id,
      companyName: companyName,
      companyEmail: companyEmail,
      companyLocation: companyLocation,
      jobTitle: jobTitle,
      description: description,
      jobType: jobType,
      education: education,
      experience: experience,
      dateFrom: dateFrom,
      dateTo: dateTo
    };
    return newJobPostingData;
  }

  buildQueryParams() {
    return `?pageSize=0&currentPage=0`;
  }

  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.clientNames
        : this.clientNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
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

  onSubmitNewJobPosting() {
    this.newJobPostingForm.controls["companyName"].markAsTouched();
    this.newJobPostingForm.controls["title"].markAsTouched();
    this.newJobPostingForm.controls["jobType"].markAsTouched();
    this.newJobPostingForm.controls["education"].markAsTouched();
    this.newJobPostingForm.controls["experience"].markAsTouched();

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

    this.clientNames.forEach(c => {
      if (this.newJobPostingForm.value.companyName === c) {
        this.validClient = true;
      }
    })

    let jobPostingData = this.buildJobPostingDataOnAddJobPosting(
      true,
      this.selectedCompany.id,
      null,
      null,
      null,
      this.newJobPostingForm.value.title,
      this.newJobPostingForm.value.description,
      this.newJobPostingForm.value.jobType,
      this.newJobPostingForm.value.education,
      this.newJobPostingForm.value.experience,
      dateFrom,
      dateTo
    );

    if (
      this.newJobPostingForm.valid &&
      this.fromDate &&
      this.toDate &&
      this.validDate &&
      this.validClient
    ) {
      this.jobPostingService.addJobPosting(jobPostingData);
    }
  }
}
