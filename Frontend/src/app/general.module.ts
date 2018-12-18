import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgxPopper } from 'angular-popper';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxLoadingModule } from 'ngx-loading';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { HeaderComponent } from './homepage/header/header.component';
import { NavigationComponent } from './homepage/header/navigation/navigation.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ClientComponent } from './homepage/client/client.component';
import { ApplicantComponent } from './homepage/applicant/applicant.component';
import { ClientJobPostingsComponent } from './homepage/client/client-job-postings/client-job-postings.component';
import { JobPostingDetailsComponent } from './homepage/job-posting-details/job-posting-details.component';
import { ApplicantRegisterComponent } from './authentication/applicants/register/register.component';
import { ClientRegisterComponent } from './authentication/clients/register/register.component';
import { AddJobPostingComponent } from './homepage/client/add-job-posting/add-job-posting.component';
import { ApplicantApplicationsComponent } from './homepage/applicant/applicant-applications/applicant-applications.component';
import { JobPostingsListComponent } from './homepage/applicant/job-postings-list/job-postings-list.component';
import { ClientProfileComponent } from './homepage/client/client-profile/client-profile.component';
import { ApplicantProfileComponent } from './homepage/applicant/applicant-profile/applicant-profile.component';
import { WelcomeComponent } from './authentication/welcome.component';
import { LoginComponent } from './authentication/login/login.component';
import { ADClientsComponent } from './admin-dashboard/clients/clients.component';
import { ADApplicantsComponent } from './admin-dashboard/applicants/applicants.component';
import { ADApplicationsComponent } from './admin-dashboard/applications/applications.component';
import { ADJobPostingsComponent } from './admin-dashboard/job-postings/job-postings.component';
import { ADNewJobPostingComponent } from './admin-dashboard/job-postings/new-job-posting/new-job-posting.component';
import { ErrorComponent } from './error/error.component';
import { NgbModule, NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NewClientComponent } from './admin-dashboard/clients/new-client/new-client.component';

@NgModule({
    declarations: [
        HeaderComponent,
        NavigationComponent,
        AdminDashboardComponent,
        AddJobPostingComponent,
        ClientComponent,
        ApplicantComponent,
        ClientJobPostingsComponent,
        JobPostingsListComponent,
        ApplicantApplicationsComponent,
        JobPostingDetailsComponent,
        ApplicantRegisterComponent,
        ClientRegisterComponent,
        ErrorComponent,
        ClientProfileComponent,
        ApplicantProfileComponent,
        WelcomeComponent,
        ADClientsComponent,
        ADApplicantsComponent,
        ADApplicationsComponent,
        ADJobPostingsComponent,
        ADNewJobPostingComponent,
        LoginComponent,
        NewClientComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        NgxPopper,
        InfiniteScrollModule,
        NgbModule,
        NgbPaginationModule,
        NgbAlertModule,
        NgxLoadingModule.forRoot({}),
        BrowserAnimationsModule,
        ToastrModule.forRoot()
    ]
})

export class GeneralModule {}