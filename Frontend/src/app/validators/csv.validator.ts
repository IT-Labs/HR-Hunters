import { AbstractControl } from "@angular/forms";

export function CSVValidator(control: AbstractControl) {
  if (control && (control.value !== null || control.value !== undefined)) {
    const file = control.value;
    const allowedExtension = /(\.csv)$/i;

    if (!allowedExtension.exec(file)) {
      return {
        isError: true
      };
    }
  }
  return null;
}
