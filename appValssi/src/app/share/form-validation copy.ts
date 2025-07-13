import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

/**
 * Interface para los mensajes de error de form validation.
 */
export interface FormValidatorMessage {
  forControl: string;
  forValidator: string;
  text: string;
}

// Mensajes de errores de validación
export const FormErrorMessage: FormValidatorMessage[] = [
  {
    forControl: 'name',
    forValidator: 'required',
    text: 'El nombre es requerido',
  },
  {
    forControl: 'name',
    forValidator: 'minlength',
    text: 'El nombre debe tener al menos 3 caracteres',
  },
  {
    forControl: 'type',
    forValidator: 'required',
    text: 'Debe seleccionar un tipo de descuento',
  },
  {
    forControl: 'amount',
    forValidator: 'required',
    text: 'El monto del descuento es obligatorio',
  },
  {
    forControl: 'amount',
    forValidator: 'min',
    text: 'El monto debe ser mayor a cero',
  },
  {
    forControl: 'startDate',
    forValidator: 'required',
    text: 'La fecha de inicio es requerida',
  },
  {
    forControl: 'endDate',
    forValidator: 'required',
    text: 'La fecha de fin es requerida',
  },
  {
    forControl: 'categoryId',
    forValidator: 'required',
    text: 'Debe seleccionar una categoría',
  },
  {
    forControl: 'productId',
    forValidator: 'required',
    text: 'Debe seleccionar un producto',
  },
  {
    forControl: 'applyTo',
    forValidator: 'required',
    text: 'Debe indicar si aplica a producto o categoría',
  },
];

/**
 * Recupera el mensaje de error de validación apropiado para un control de formulario determinado.
 *
 * @param control La instancia de AbstractControl (FormControl, FormGroup o FormArray).
 * @param controlName el nombre del control, tal como se define en FormErrorMessage.
 * @returns La cadena del mensaje de error si existe un error y el control está touched/dirty, de lo contrario es falso.
 */
export function getFormValidationErrorMessage(
  formGroup: FormGroup | FormArray,
  controlPath: string
): string | false {
  const control = formGroup.get(controlPath);
  if (!control) {
    return false;
  }

  if (control instanceof FormGroup || control instanceof FormArray) {
    if (!control.errors || !Object.keys(control.errors).length) {
      return false;
    }
  }

  if (control.invalid && (control.dirty || control.touched)) {
    for (const validatorName in control.errors) {
      if (control.errors.hasOwnProperty(validatorName)) {
        const baseControlName = controlPath.split('.').pop() || controlPath;

        for (const message of FormErrorMessage) {
          if (
            message.forControl === baseControlName &&
            message.forValidator === validatorName
          ) {
            return message.text;
          }
        }
      }
    }
  }

  return false;
}