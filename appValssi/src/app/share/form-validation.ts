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
    forControl: 'description',
    forValidator: 'required',
    text: 'La descripción es requerida',
  },
  {
    forControl: 'description',
    forValidator: 'minWords',
    text: 'La descripción debe contener mínimo 2 palabras',
  },
  {
    forControl: 'price',
    forValidator: 'min',
    text: 'El precio debe ser mayor a 1',
  },
  {
    forControl: 'tags',
    forValidator: 'required',
    text: 'Es requerido que seleccione una etiqueta',
  },
  {
    forControl: 'categoryId',
    forValidator: 'required',
    text: 'Es requerido que seleccione una categoría',
  },
  {
    forControl: 'price',
    forValidator: 'required',
    text: 'El precio es obligatorio',
  },
   {
    forControl: 'stock',
    forValidator: 'min',
    text: 'La cantidad en stock debe ser mayor a 1',
  },
  {
    forControl: 'stock',
    forValidator: 'required',
    text: 'La cantidad en stock es obligatoria',
  },
  {
  forControl: 'stock',
  forValidator: 'pattern',
  text: 'El stock debe ser un número entero',
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
    forControl: 'comment',
    forValidator: 'required',
    text: 'Escriba su comentario.',
  },
  {
    forControl: 'rating',
    forValidator: 'required',
    text: 'Seleccione estrellas',
  },
  // {
  //   forControl: 'categoryId',
  //   forValidator: 'required',
  //   text: 'Debe seleccionar una categoría',
  // },
  // {
  //   forControl: 'productId',
  //   forValidator: 'required',
  //   text: 'Debe seleccionar un producto',
  // },
  {
    forControl: 'applyTo',
    forValidator: 'required',
    text: 'Debe indicar si aplica a producto o categoría',
  },

{
    forControl: 'paymentType',
    forValidator: 'required',
    text: 'Debe seleccionar un método de pago',
  },

  // TARJETA
  {
    forControl: 'cardNumber',
    forValidator: 'required',
    text: 'El número de tarjeta es obligatorio',
  },
  {
    forControl: 'cardNumber',
    forValidator: 'pattern',
    text: 'El número de tarjeta debe tener 16 dígitos',
  },
  {
    forControl: 'expiryDate',
    forValidator: 'required',
    text: 'La fecha de expiración es obligatoria',
  },
  {
    forControl: 'expiryDate',
    forValidator: 'pattern',
    text: 'La fecha de expiración debe tener el formato MM/AA',
  },
  {
    forControl: 'expiryDate',
    forValidator: 'expired',
    text: 'La fecha de expiración es anterior a la fecha actual '
  },
  {
    forControl: 'cvv',
    forValidator: 'required',
    text: 'El CVV es obligatorio',
  },
  {
    forControl: 'cvv',
    forValidator: 'pattern',
    text: 'El CVV debe tener 3 o 4 dígitos',
  },
  {
    forControl: 'cardHolder',
    forValidator: 'required',
    text: 'El nombre del titular es obligatorio',
  },

  // EFECTIVO
  {
    forControl: 'cashAmount',
    forValidator: 'required',
    text: 'Debe ingresar el monto recibido en efectivo',
  },
  {
    forControl: 'cashAmount',
    forValidator: 'min',
    text: 'El monto recibido debe ser igual o mayor al total del pedido',
  },
  {
    forControl: 'cashAmount',
    forValidator: 'pattern',
    text: 'El monto recibido debe ser un número válido',
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
