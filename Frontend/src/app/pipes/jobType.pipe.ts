import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'jobtype' })
export class JobTypePipe implements PipeTransform {
    transform(value: string): any {
        if (value === "Full_time") {
            return 'Full-time'
        } else if (value === 'Part_time') {
            return 'Part-time'
        } else if (value === 'Intern') {
            return 'Intern'
        }
    }
  }