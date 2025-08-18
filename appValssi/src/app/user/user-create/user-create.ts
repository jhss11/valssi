import { Component, OnDestroy } from '@angular/core';
import { NotificationService } from '../../share/notification-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { getFormValidationErrorMessage } from '../../share/form-validation';
import { passwordsMatchValidator } from '../../share/validators/password-match-validator';
import { RolService } from '../../share/services/rol.service';
import { RoleModel } from '../../share/models/RoleModel';
import { UserService } from '../../share/services/user.service';
import { AuthenticationService } from '../../share/authentication.service';

@Component({
  selector: 'app-user-create',
  standalone: false,
  templateUrl: './user-create.html',
  styleUrls: ['./user-create.css'],
})
export class UserCreate implements OnDestroy {
  hide = true;
  roles: RoleModel[] = [];
  formCreate!: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private rolService: RolService,
    private authenticationS : AuthenticationService,
    private userService: UserService,
    private notificacion: NotificationService
  ) {
    this.reactiveForm();
  }

  reactiveForm() {
    this.formCreate = this.fb.group(
      {
        username: ['', [Validators.required]], // 👈 coincide con Prisma
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmpassword: ['', [Validators.required]],
        role: ['', [Validators.required]],
      },
      { validators: passwordsMatchValidator }
    );
    this.getRoles();
    console.log('roles ', this.roles);
  }

  ngOnInit(): void {}

  submitForm() {
    this.formCreate.markAllAsTouched();

    if (this.formCreate.invalid) {
      return;
    }
    console.log(this.formCreate.value);
    // Construimos payload sin confirmpassword
    const { username, email, password, role } = this.formCreate.value;

    this.authenticationS
      .createUser({ username, email, password, role })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.notificacion.success(
            'Éxito',
            'Usuario creado correctamente',
            3000
          );
          this.router.navigate(['/usuario/login']);
        },
        error: (err) => {
          console.error(err);
          this.notificacion.error(
            'Error',
            'No se pudo crear el usuariooo',
            3000
          );
        },
      });
  }

  onReset() {
    this.formCreate.reset();
  }

  getRoles() {
    this.rolService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((respuesta: RoleModel[]) => {
        console.log('NO SIRVE ', respuesta);
        this.roles = respuesta;
      });
  }

  /**
   * Gestión de errores del formulario
   */
  public errorHandling(controlPath: string): string | false {
    return getFormValidationErrorMessage(this.formCreate, controlPath);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
