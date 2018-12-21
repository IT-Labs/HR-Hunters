import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { mimeType } from "../../../validators/mime-type.validator";
import { ClientService } from "src/app/services/client.service";
import { AuthService } from "src/app/services/auth.service";
import { Subscription } from "rxjs";
import { Client } from "src/app/models/client.model";

@Component({
  selector: "app-client-profile",
  templateUrl: "./client-profile.component.html",
  styleUrls: ["./client-profile.component.scss"]
})
export class ClientProfileComponent implements OnInit {
  serverError;
  validText = new RegExp("^([a-zA-Z0-9]|[- @.#&!',_])*$");
  imagePreview: string | ArrayBuffer;
  imageValid = true;
  loggedInUser;
  loggedInClient: Client = {
    id: null,
    companyName: null,
    email: null,
    location: null,
    phoneNumber: null,
    logo: null
  };
  validEmail = new RegExp(
    "[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}"
  );
  loading = false;

  private clientProfileSub: Subscription;

  private clientErrorSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.loggedInUser = this.authService.getUser();
    this.clientService.getClient(this.loggedInUser.id);
    this.clientProfileSub = this.clientService
      .getClientProfileListener()
      .subscribe(clientProfile => {
        this.loggedInClient = clientProfile.client;
        this.clientProfileFormHP.controls.companyName.setValue(
          this.loggedInClient.companyName
        );
        this.clientProfileFormHP.controls.companyEmail.setValue(
          this.loggedInClient.email
        );
        this.clientProfileFormHP.controls.location.setValue(
          this.loggedInClient.location
        );
        this.clientProfileFormHP.controls.phonenumber.setValue(
          this.loggedInClient.phoneNumber
        );
        this.imagePreview = this.loggedInClient.logo;
        this.loading = false;
      });

    this.clientErrorSub = this.clientService
      .getClientErrorListener()
      .subscribe(error => {
        this.serverError = error.error;
      });
  }

  clientProfileFormHP = this.fb.group({
    companyName: [
      "",
      Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(this.validText)
      ])
    ],
    companyEmail: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.pattern(this.validEmail)
      ])
    ],
    phonenumber: [
      "",
      Validators.compose([Validators.required, Validators.minLength(10)])
    ],
    location: [
      "",
      Validators.compose([
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern(this.validText)
      ])
    ]
  });

  clientProfileImageFormHP = this.fb.group({
    logo: [
      "",
      {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }
    ]
  });

  buildClientDataOnUpdateClientProfile(
    companyName: string,
    companyEmail: string,
    location: string,
    phoneNumber: string,
    status: string
  ) {
    const newClientData = {
      companyName: companyName,
      companyEmail: companyEmail,
      location: location,
      phoneNumber: phoneNumber,
      status: status
    };
    return newClientData;
  }

  onImagePicked(event: Event) {
    this.loading = true;
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      let img = new Image();
      img.src = reader.result.toString();
      setTimeout(() => {
        if (img.height < 600 || img.width < 600) {
          this.clientProfileImageFormHP.patchValue({ logo: file });
          this.clientProfileImageFormHP.controls["logo"].updateValueAndValidity();
          this.imagePreview = reader.result;
          this.imageValid = true;
        } else {
          this.imageValid = false;
        }
      }, 1000);
      console.log(img)
    };
    reader.readAsDataURL(file);
    this.onSubmitClientLogo();
    this.loading = false;
  }

  buildImageFile(logo: any) {
    const logoData = new FormData();
    logoData.append("logo", logo);
    return logoData
  }
  
  onSubmitClientLogo() {
    this.loading = true;
    this.clientService.uploadCLientLogo(this.loggedInUser.id, this.buildImageFile(this.clientProfileImageFormHP.value.logo))
    setTimeout(() => {
      this.clientService.getClient(this.loggedInUser.id);
      this.loading = false;
    }, 3000);
  }

  onSubmitClientProfile() {
    this.loading = true;
    this.clientProfileFormHP.controls["companyName"].markAsTouched();
    this.clientProfileFormHP.controls["companyEmail"].markAsTouched();
    this.clientProfileFormHP.controls["phonenumber"].markAsTouched();
    this.clientProfileFormHP.controls["location"].markAsTouched();

    let clientData = this.buildClientDataOnUpdateClientProfile(
      this.clientProfileFormHP.value.companyName,
      this.clientProfileFormHP.value.companyEmail,
      this.clientProfileFormHP.value.location,
      this.clientProfileFormHP.value.phonenumber,
      null
    );

    if (this.clientProfileFormHP.valid) {
      this.clientService.updateClientProfile(clientData, this.loggedInUser.id);
    }
    this.loading = false;
  }
}
