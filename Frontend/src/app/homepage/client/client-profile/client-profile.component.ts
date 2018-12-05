import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { mimeType } from "../../../validators/mime-type.validator";

@Component({
  selector: "app-client-profile",
  templateUrl: "./client-profile.component.html",
  styleUrls: ["./client-profile.component.scss"]
})
export class ClientProfileComponent implements OnInit {
  imagePreview: string | ArrayBuffer;
  imageValid = true;
  validEmail = new RegExp(
    "[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}"
  );
  // validPhonenumber = new RegExp("^(\+\s?)?((?<!\+.*)\(\+?\d+([\s\-\.]?\d+)?\)|\d+)([\s\-\.]?(\(\d+([\s\-\.]?\d+)?\)|\d+))*(\s?(x|ext\.?)\s?\d+)?$");

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.imagePreview = 'https://about.canva.com/wp-content/uploads/sites/3/2016/08/Band-Logo.png';
  }

  clientProfileFormHP = this.fb.group({
    companyName: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern("[a-zA-Z0-9]*")
      ])
    ],

    phonenumber: ["", Validators.compose([Validators.required])],
    logo: [
      "",
      {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }
    ],
    companyEmail: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.pattern(this.validEmail)
      ])
    ]
  });

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      let img = new Image();
      img.src = reader.result.toString();
      setTimeout(() => {
        if (img.height < 600 || img.width < 600) {
          this.clientProfileFormHP.patchValue({ logo: file });
          this.clientProfileFormHP.controls["logo"].updateValueAndValidity();
          this.imagePreview = reader.result;
          this.imageValid = true;
        } else {
          this.imageValid = false;
        }
      }, 1000);
    };
    reader.readAsDataURL(file);
  }

  onSubmitClientProfile() {
    this.clientProfileFormHP.controls["companyName"].markAsTouched();
    this.clientProfileFormHP.controls["companyEmail"].markAsTouched();
    this.clientProfileFormHP.controls["phonenumber"].markAsTouched();
    this.clientProfileFormHP.controls["logo"].markAsTouched();

    if (this.imagePreview === undefined) {
      this.imageValid = false;
    } else {
      if (this.clientProfileFormHP.valid) {
        console.log('something')
      }
    }
  }
}
