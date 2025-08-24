import { Component, inject, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../share/services/user.service';
import { NotificationService } from '../../share/notification-service';
import { getFormValidationErrorMessage } from '../../share/form-validation';
import { AuthenticationService } from '../../share/authentication.service';

@Component({
  selector: 'app-update-password',
  standalone: false,
  templateUrl: './update-password.html',
  styleUrls: ['./update-password.css']
})
export class UpdatePassword implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  passwordForm!: FormGroup;
  hideCurrent = true;
  hideNew = true;
  hideConfirm = true;

    //se pega esto en el ts y ya teniendo curretUser se usa para
  //ingresar a lo que trae el token (id, email, rol, username)
  authService = inject(AuthenticationService);
  isAuntenticated = this.authService.isAuthenticatedSignal;
  
  currentUser = this.authService.currentUserSignal;
  user = this.currentUser();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private noti: NotificationService,
    private dialogRef: MatDialogRef<UpdatePassword>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required, Validators.minLength(6)]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!_@#$%^&*(),.?":{}|<>]).+$/
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.matchPasswords }
    );
  }

  private matchPasswords(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass && confirm && pass !== confirm ? { passwordsMismatch: true } : null;
  }

  submit(): void {
    this.passwordForm.markAllAsTouched();

    if (this.passwordForm.invalid) {
      this.noti.error('Error', 'Revise los campos del formulario', 2000);
      return;
    }

    const { currentPassword, password, id = this.currentUser()?.id } = this.passwordForm.value;
    this.userService.updatePassword(currentPassword, password, id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.noti.success('Éxito', 'Contraseña actualizada', 2000);
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.noti.error('Error', err.error?.message || 'Contraseña actual incorrecta, intente de nuevo.', 2000);
        }
      });
  }

  errorHandling(controlName: string): string | false {
    return getFormValidationErrorMessage(this.passwordForm, controlName);
  }

  close(): void {
    this.dialogRef.close(false);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}