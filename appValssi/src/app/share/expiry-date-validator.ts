import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function expiryDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    const value = control.value;
    if (!value || typeof value !== 'string') return null;

    const [monthStr, yearStr] = value.split('/');
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear() % 100;

    return year < currentYear || (year === currentYear && month < currentMonth)
      ? { expired: true }
      : null;
  };
}