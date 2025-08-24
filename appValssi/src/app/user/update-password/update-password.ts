import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../share/services/user.service';
import { NotificationService } from '../../share/notification-service';
import { getFormValidationErrorMessage } from '../../share/form-validation';

@Component({
  selector: 'app-update-password',
  standalone: false,
  templateUrl: './update-password.html',
  styleUrl: './update-password.css'
})
export class UpdatePassword {
passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private noti: NotificationService,
    private dialogRef: MatDialogRef<UpdatePassword>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  submit() {
    if (this.passwordForm.invalid) return;

    const { currentPassword, newPassword } = this.passwordForm.value;
    this.userService.updatePassword(currentPassword, newPassword)
      .subscribe({
        next: () => {
          this.noti.success('Éxito', 'Contraseña actualizada');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.noti.error('Error', err.error?.message || 'No se pudo actualizar');
        }
      });
  }

   /**
     * Gestión de errores del formulario
     */
    public errorHandling(controlPath: string): string | false {
      return getFormValidationErrorMessage(this.passwordForm, controlPath);
    }

  cancel() {
    this.dialogRef.close(false);
  }
}
