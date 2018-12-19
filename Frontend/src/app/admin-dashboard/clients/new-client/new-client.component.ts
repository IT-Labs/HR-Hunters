import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { ClientService } from "src/app/services/client.service";

@Component({
  selector: "app-new-client-posting",
  templateUrl: "./new-client.component.html",
  styleUrls: ["./new-client.component.scss"]
})
export class NewClientComponent implements OnInit {
  validEmail = new RegExp(
    "[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}"
  );

  validText = new RegExp(
    "^([a-zA-Z0-9]|[- @\.#&!',_])*$"
  )

  loading = false;

  constructor(private fb: FormBuilder, private clientService: ClientService) {}

  ngOnInit() {}

  newClientForm = this.fb.group({
    companyName: [
      "",
      Validators.compose([
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern(this.validText)
      ])
    ],
    companyEmail: [
      "",
      Validators.compose([
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern(this.validEmail)
      ])
    ],
    companyPhoneNumber: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(11)
      ])
    ],
    companyLocation: [
      "",
      Validators.compose([
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern(this.validText)
      ])
    ]
  });

  buildClientDataOnAddClient(
    companyName: string,
    email: string,
    phoneNumber: string,
    location: string
  ) {
    const newClientData = {
      companyName: companyName,
      email: email,
      phoneNumber: phoneNumber,
      location: location
    };
    return newClientData;
  }

  onSubmitNewClient() {
    this.loading = true;
    this.newClientForm.controls.companyName.markAsTouched();
    this.newClientForm.controls.companyEmail.markAsTouched();
    this.newClientForm.controls.companyPhoneNumber.markAsTouched();
    this.newClientForm.controls.companyLocation.markAsTouched();

    let clientData = this.buildClientDataOnAddClient(
      this.newClientForm.value.companyName,
      this.newClientForm.value.companyEmail,
      this.newClientForm.value.companyPhoneNumber,
      this.newClientForm.value.companyLocation
    );

    if (this.newClientForm.valid) {
      this.clientService.addClient(clientData);
      this.loading = false;
    }
  }
}
