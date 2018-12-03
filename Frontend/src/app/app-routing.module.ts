import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ClientRegisterComponent } from "./authentication/clients/register/register.component";
import { ApplicantRegisterComponent } from "./authentication/applicants/register/register.component";
import { AddJobPostingComponent } from "./homepage/client/add-job-posting/add-job-posting.component";
import { ApplicantsComponent } from "./authentication/applicants/applicants.component";
import { ClientComponent } from "./homepage/client/client.component";
import { ClientJobPostingsComponent } from "./homepage/client/client-job-postings/client-job-postings.component";
import { JobPostingDetailsComponent } from "./homepage/applicant/job-posting-details/job-posting-details.component";
import { ApplicantApplicationsComponent } from "./homepage/applicant/applicant-applications/applicant-applications.component";
import { ErrorComponent } from "./error/error.component";
import { AppicantJobPostingsComponent } from "./homepage/applicant/applicant-job-postings/applicant-job-postings.component";
import { ClientProfileComponent } from "./homepage/client/client-profile/client-profile.component";
import { ApplicantProfileComponent } from "./homepage/applicant/applicant-profile/applicant-profile.component";
import { WelcomeComponent } from "./authentication/welcome.component";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { LoginComponent } from './authentication/login/login.component';
import { ADApplicantsComponent } from "./admin-dashboard/applicants/applicants.component";
import { ADApplicationsComponent } from "./admin-dashboard/applications/applications.component";
import { ADClientsComponent } from "./admin-dashboard/clients/clients.component";
import { ADJobPostingsComponent } from "./admin-dashboard/job-postings/job-postings.component";
import { ADNewJobPostingComponent } from "./admin-dashboard/job-postings/new-job-posting/new-job-posting.component";
import {HomepageComponent} from "./homepage/homepage.component";
import {HeaderComponent} from "./header/header.component";
import { AuthGuard } from "./authentication/auth.guard";

const routes: Routes = [
  { path: "", redirectTo: 'welcome', pathMatch: 'full' },
  { path: "welcome", component: WelcomeComponent },
  { path: "login", component: LoginComponent },
  { path: "client-register", component: ClientRegisterComponent },
  { path: "applicant-register", component: ApplicantRegisterComponent },
  { path: "admin-dashboard", component: AdminDashboardComponent, children: [
    { path: "applicants", component: ADApplicantsComponent },
    { path: "applications", component: ADApplicationsComponent },
    { path: "clients", component: ADClientsComponent },
    { path: "job-postings", component: ADJobPostingsComponent },
    { path: "new-job-posting", component: ADNewJobPostingComponent }
  ]},
  { path: "homepage", component:HomepageComponent, children: [
    { path: "header", component: HeaderComponent }
   
  ]},
  {
    path: "client",
    component: ClientComponent,
    children: [
      { path: "profile", component: ClientProfileComponent },
      { path: "job-postings/:id", component: ClientJobPostingsComponent },
      { path: "job-posting/:id", component: JobPostingDetailsComponent },
      { path: "add-job-posting", component: AddJobPostingComponent }
    ]
  },
  {
    path: "applicant",
    component: ApplicantsComponent,
    children: [
      { path: "profile", component: ApplicantProfileComponent },
      { path: "job-postings", component: AppicantJobPostingsComponent },
      { path: "job-posting/:id", component: JobPostingDetailsComponent },
      { path: "applications/:id", component: ApplicantApplicationsComponent }
    ]
  },
  { path: "**", component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
