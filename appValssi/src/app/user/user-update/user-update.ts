import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { UserService } from '../../share/services/user.service';
import { NotificationService } from '../../share/notification-service';
import { getFormValidationErrorMessage } from '../../share/form-validation';
import { TranslateService } from '@ngx-translate/core';
import { RoleModel } from '../../share/models/RoleModel';
import { RolService } from '../../share/services/rol.service';
import { AuthenticationService } from '../../share/authentication.service';

@Component({
  selector: 'app-user-update',
  standalone: false,
  templateUrl: './user-update.html',
  styleUrls: ['./user-update.css'],
})
export class UserUpdate implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  idUser!: number; // siempre será obligatorio
  roles: RoleModel[] = [];
  userForm!: FormGroup;

  //se pega esto en el ts y ya teniendo curretUser se usa para
  //ingresar a lo que trae el token (id, email, rol, username)
  authService = inject(AuthenticationService);
  isAuntenticated = this.authService.isAuthenticatedSignal;
  
  currentUser = this.authService.currentUserSignal;
  user = this.currentUser();


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private noti: NotificationService,
    private rolService: RolService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.idUser = +params['id']; 
      if (this.idUser) {
        this.loadUserData();
      } else {
        this.noti.error('Error', 'No se proporcionó un ID válido');
        this.router.navigate(['/user']);
      }
    });
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      id: [null],
      username: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      role: ['USER', Validators.required],
    });

    this.getRoles();
  }

  private loadUserData(): void {
    this.userService
      .getById(this.idUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.patchFormValues(data);
          console.log('info de usuario ', data);
        },
        error: () => {
          this.noti.error('Error', 'No se encontró el usuario');
          this.router.navigate(['/user']);
        },
      });
  }

  private patchFormValues(data: any): void {
    this.userForm.patchValue({
      id: data.id,
      username: data.username,
      email: data.email,
      role: data.role,
    });
  }

  submitUser(): void {
  this.userForm.markAllAsTouched();
  if (this.userForm.invalid) {
    this.noti.error('Formulario inválido', 'Revise los campos requeridos.');
    return;
  }

  const payload = this.userForm.value;

  //  Validar si el email ya existe en otro usuario
  this.userService.checkEmail(payload.email)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (correoEnUso: boolean) => {
        if (correoEnUso && payload.email !== this.currentUser()?.email) {
          // Si el correo está en uso y no es el mismo del usuario que estamos editando
          this.noti.error(
            'Error',
            'El correo ya está en uso por otro usuario',
            3000
          );
          return; // Detener actualización
        }

       
        this.userService.update(payload)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (data) =>
              this.noti.success(
                'Usuario actualizado',
                `Nombre: ${data.username}`,
                2500,
                
              ),
            error: (err) =>
              this.noti.error(
                'Error',
                err.message ?? 'No se pudo actualizar el usuario'
              ),
          });
      },
      error: (err) => {
        console.error(err);
        this.noti.error(
          'Error',
          'No se pudo validar el correo',
          3000
        );
      }
    });
}

  errorHandling(controlPath: string) {
    return getFormValidationErrorMessage(this.userForm, controlPath);
  }

  onReset(): void {
    this.userForm.reset({ role: 'USER' });
  }

  onBack(): void {
    this.router.navigate(['/inicio']);
  }

  getRoles() {
    this.rolService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((respuesta: RoleModel[]) => {
     
        this.roles = respuesta;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
