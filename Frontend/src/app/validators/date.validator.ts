import { AbstractControl } from "@angular/forms";

export function DateValidator(control: AbstractControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
        const dateTo = new Date(control.value);
        const dateControl = control.root.get('dateFrom');

        const date = new Date();
        const dd = date.getDay()
        const mm = date.getMonth()+1
        const yyyy = date.getFullYear()
        let newDD;
        let newMM;
        if (dd < 10) {
            newDD = `0${dd}`
        } else {
            newDD = dd
        }
        if (mm < 10) {
            newMM = `0${mm}`
        } else {
            newMM = mm
        }
        
        const today = `${yyyy}-${newMM}-${newDD}`
        
        if (dateControl) {
            const dateFromValue = new Date(dateControl.value);

            const todayDate = new Date(today);

            if (dateFromValue < todayDate) {
                return {
                    isError: true
                }
            }
            if (dateFromValue >= dateTo) {
                return {
                    isError: true
                }
            }
        }
    }
    return null;
}