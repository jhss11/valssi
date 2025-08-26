import { Component, inject } from '@angular/core';
import { getFormValidationErrorMessage } from '../../share/form-validation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../share/notification-service';
import { AuthenticationService } from '../../share/authentication.service';
import { OrderService } from '../../share/services/order.service';
import { CartService } from '../../share/cart.service';
import { ItemCartModel } from '../../share/models/ItemCartModel';
import { OrderModel } from '../../share/models/OrderModel';

@Component({
  selector: 'app-user-login',
  standalone: false,
  templateUrl: './user-login.html',
  styleUrl: './user-login.css',
})
export class UserLogin {
  hide = true;
  formulario!: FormGroup;
  makeSubmit: boolean = false;
  infoUsuario: any;

  private cartService = inject(CartService);

  constructor(
    public fb: FormBuilder,
    private orderService: OrderService,
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
      emaillogin: [null, [Validators.required]],
      passwordlogin: [null, [Validators.required]],
    });
  }

  onReset() {
    this.formulario.reset();
  }

  submitForm() {
  this.formulario.markAllAsTouched();
  this.makeSubmit = true;

  if (this.formulario.invalid) {
    return;
  }

  const credentials = {
    email: this.formulario.value.emaillogin,
    password: this.formulario.value.passwordlogin,
  };

  this.authService.loginUser(credentials).subscribe({
    next: (response: any) => {
      if (response.success && response.token) {
        localStorage.setItem('token', response.token);

        this.notificacion.success(
          'Inicio de sesión',
          'Bienvenido',
          1000,
          '/inicio'
        );

        // Obtener perfil del usuario
        this.authService.getUserProfile().subscribe({
          next: (user) => {
            this.infoUsuario = user;
            console.log('Usuario autenticado:', this.infoUsuario);

            // Obtener carrito del backend
            this.orderService
              .getMethod(`cart?userId=${user?.id}`)
              .subscribe({
                next: (order: any) => {
                  if (order) {
                    // 👉 Guardar id del carrito en localStorage
                    localStorage.setItem('orderId', order.id);

                    if (order.items) {
                      order.items.forEach((item: any) => {
                        if (item.customProduct) {
                          // Producto personalizado → mapear al modelo ItemCartModel
                          this.cartService.addToCart(
                            item.customProduct.baseProduct,
                            item.quantity,
                            {
                              totalPrice: item.customProduct.totalPrice,
                              selectedOptions:
                                item.customProduct.customProducts.map(
                                  (c: any) => ({
                                    optionValueId: c.optionValue.id,
                                    name: c.optionValue.option.name,
                                    value: c.optionValue.value,
                                    price: c.optionValue.price,
                                  })
                                ),
                            }
                          );
                        } else if (item.product) {
                          // Producto normal
                          this.cartService.addToCart(item.product, item.quantity);
                        }
                      });
                    }
                  } else {
                    console.log("Usuario no tiene carrito activo aún.");
                  }
                },
                error: (err) => {
                  console.error('Error cargando carrito:', err);
                },
              });
          },
          error: (err) => {
            console.error('Error obteniendo perfil:', err);
          },
        });
      }
    },
    error: (error) => {
      console.log('Error inicio de sesión ', error);
      let message =
        'Credenciales incorrectas. Verifique su email y contraseña';
      if (error.status === 401) {
        message = 'Error al iniciar sesión. Por favor, intente de nuevo';
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
