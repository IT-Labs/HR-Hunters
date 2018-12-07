import { AbstractControl } from "@angular/forms";

export function DateValidator(control: AbstractControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
        const durationTo = new Date(control.value);
        const dateControl = control.root.get('durationFrom');
        
        if (dateControl) {
            const dateFromValue = new Date(dateControl.value);
            if (dateFromValue >= durationTo) {
                return {
                    isError: true
                }
            }
        }
    }
    return null;
}