import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function expiryDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    const value = control.value;
    if (!value || typeof value !== 'string') return null;

    const [monthStr, yearStr] = value.split('/');
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    const now = new Date();
    //suma 1 porque getMonth() va de 0-11
    const currentMonth = now.getMonth() + 1;
    //toma los últimos 2 dígitos del año 
    const currentYear = now.getFullYear() % 100;

    return year < currentYear || (year === currentYear && month < currentMonth)
      ? { expired: true }
      : null;
  };
}