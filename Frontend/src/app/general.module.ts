import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { AdminComponent } from './authentication/admin/admin.component';
import { ClientsComponent } from './authentication/clients/clients.component';
import { ApplicantsComponent } from './authentication/applicants/applicants.component';
import { HeaderComponent } from './header/header.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ApplicationsComponent } from './admin-dashboard/applications/applications.component';
import { ClientComponent } from './homepage/client/client.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ApplicantComponent } from './homepage/applicant/applicant.component';
import { ClientJobPostingsComponent } from './homepage/client/client-job-postings/client-job-postings.component';
import { JobPostingDetailsComponent } from './homepage/applicant/job-posting-details/job-posting-details.component';
import { ApplicantLoginComponent } from './authentication/applicants/login/login.component';
import { ApplicantRegisterComponent } from './authentication/applicants/register/register.component';
import { ClientLoginComponent } from './authentication/clients/login/login.component';
import { ClientRegisterComponent } from './authentication/clients/register/register.component';
import { AddJobPostingComponent } from './homepage/client/add-job-posting/add-job-posting.component';
import { ApplicantApplicationsComponent } from './homepage/applicant/applicant-applications/applicant-applications.component';
import { ErrorComponent } from './error/error.component';
import { JobPostingsComponent } from './admin-dashboard/job-postings/job-postings.component';
import { AppicantJobPostingsComponent } from './homepage/applicant/applicant-job-postings/applicant-job-postings.component';
import { NewJobPostingComponent } from './admin-dashboard/job-postings/new-job-posting/new-job-posting.component';
import { ClientProfileComponent } from './homepage/client/client-profile/client-profile.component';
import { ApplicantProfileComponent } from './homepage/applicant/applicant-profile/applicant-profile.component';


@NgModule({
    declarations: [
        AdminComponent,
        ClientsComponent,
        ApplicantsComponent,
        HeaderComponent,
        AdminDashboardComponent,
        ApplicationsComponent,
        AddJobPostingComponent,
        ClientComponent,
        HomepageComponent,
        ApplicantComponent,
        ClientJobPostingsComponent,
        JobPostingsComponent,
        AppicantJobPostingsComponent,
        ApplicantApplicationsComponent,
        JobPostingDetailsComponent,
        ApplicantLoginComponent,
        ApplicantRegisterComponent,
        ClientLoginComponent,
        ClientRegisterComponent,
        ErrorComponent,
        NewJobPostingComponent,
        ClientProfileComponent,
        ApplicantProfileComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule
    ]
})

export class GeneralModule {}