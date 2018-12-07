import { AbstractControl } from "@angular/forms";

export function PasswordValidator(control: AbstractControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
        const confirmPasswordValue = control.value;

        const passControl = control.root.get('applicantPassword');
        if (passControl) {
            const passValue = passControl.value;
            if (passValue !== confirmPasswordValue) {
                return {
                    isError: true
                }
            }
        }
    }
    return null;
}