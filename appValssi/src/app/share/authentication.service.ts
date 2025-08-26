import { Injectable, computed, effect, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { CartService } from './cart.service';
import { UserModel } from './models/UserModel';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiUrl = environment.apiURL;
  private tokenKey = 'currentUser';

  // Signals
  tokenUser = signal<string | null>(localStorage.getItem(this.tokenKey));
  authenticated = computed(() => !!this.tokenUser());
  usuario = signal<UserModel | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private cartService: CartService
  ) {
    if (this.tokenUser()) {
      this.getUserProfile().subscribe();
    }
  }

  get isAuthenticatedSignal() {
    return this.authenticated;
  }

  get currentUserSignal() {
    return this.usuario;
  }

  get getToken(): string | null {
    return this.tokenUser();
  }

  // Crear usuario
  createUser(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, usuario);
  }

  // Listar roles
  listaRoles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/rol`);
  }

  // Login
  //tap es para efectos secundarios (obtener el dato, pero que no lo cambian ni lo transforman para el siguiente paso)
  loginUser(credentials: any): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/users/login`, credentials)
      .pipe(
        tap((response) => {
          console.log(response);
          const token = String(response.token);
          localStorage.setItem(this.tokenKey, token);
          this.tokenUser.set(token);

          //Registrar usuario
          this.getUserProfile().subscribe();
        })
      );
  }

  // Obtener perfil desde backend del usuario
  getUserProfile(): Observable<UserModel | null> {
    return this.http.get<UserModel>(`${this.apiUrl}/users/profile`).pipe(
      tap((user) => this.usuario.set(user)),
      catchError(() => {
        this.logout();
        return of(null);
      })
    );
  }

  // Logout
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem("orderId");

    this.tokenUser.set(null);
    this.usuario.set(null);
    this.cartService.deleteCart();
    this.router.navigate(['/login']);
  }
}
