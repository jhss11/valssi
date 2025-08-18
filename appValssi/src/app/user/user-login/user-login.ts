import { Component } from '@angular/core';
import { getFormValidationErrorMessage } from '../../share/form-validation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../share/notification-service';
import { AuthenticationService } from '../../share/authentication.service';

@Component({
  selector: 'app-user-login',
  standalone: false,
  templateUrl: './user-login.html',
  styleUrl: './user-login.css'
})
export class UserLogin {
  hide = true;
  formulario!: FormGroup;
  makeSubmit: boolean = false;
  infoUsuario: any;

  constructor(
    public fb: FormBuilder,
    private notificacion: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService
  ) {
    this.reactiveForm();
  }

  ngOnInit(): void {}

  // Definir el formulario con sus reglas de validación
  reactiveForm() {
    this.formulario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onReset() {
    this.formulario.reset();
  }

  submitForm() {
    this.makeSubmit = true;

    if (this.formulario.invalid) {
      return;
    }

    const credentials = this.formulario.value;

    this.authService.loginUser(credentials).subscribe({
      next: (response: any) => {
        // Aquí el back devuelve { success, message, token }
        if (response.success && response.token) {
          // Guardar el token en localStorage
          localStorage.setItem('token', response.token);

          // Notificación
          this.notificacion.success(
            'Inicio de sesión',
            'Bienvenido',
            2000,
            '/inicio' // redirección
          );

          // Cargar perfil del usuario
          this.authService.getUserProfile().subscribe({
            next: (user) => {
              this.infoUsuario = user;
              console.log('Usuario autenticado:', this.infoUsuario);
            },
            error: (err) => {
              console.error('Error obteniendo perfil:', err);
            },
          });
        }
      },
      error: (error) => {
        console.log('Error inicio de sesión ', error);
        let message = 'Error al iniciar sesión. Por favor, intente de nuevo';
        if (error.status === 401) {
          message = 'Credenciales incorrectas. Verifique su email y contraseña';
        }
        this.notificacion.error('Error de autenticación', message);
      },
    });
  }

  /**
   * Gestión de errores del formulario
   */
  public errorHandling(controlPath: string): string | false {
    return getFormValidationErrorMessage(this.formulario, controlPath);
  }
}
