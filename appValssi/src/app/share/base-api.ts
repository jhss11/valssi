import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
export interface BaseEntity {
  id?: number;
}
@Injectable({
  providedIn: 'root',
})
export class BaseAPI<T extends BaseEntity> {
  // URL del API, definida en enviroments->enviroment.ts
  urlAPI: string = environment.apiURL;

  constructor(
    private http: HttpClient,
    @Inject(String) private endpoint: string
  ) {}
 
  get(): Observable<T[]> {
    return this.http.get<T[]>(`${this.urlAPI}/${this.endpoint}`);
  }
  
updatePaymentMethod(body: { id: number; paymentMethod: 'CARD' | 'CASH' }): Observable<any> {
  return this.http.put(`${this.urlAPI}/${this.endpoint}/`, body);
}

updateEstado(body: { id: number; isDeleted:boolean }): Observable<any> {
  return this.http.put(`${this.urlAPI}/${this.endpoint}/`, body);
}

/**
   * Actualiza la contraseña del usuario logueado
   */
updatePassword(currentPassword: string, password: string, id: number) {
  const token = localStorage.getItem('token'); // tu JWT
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.put(
    `${this.urlAPI}/${environment.endPointUser}/password`, 
   
    { currentPassword, password, id }, 
    { headers }
  );
}

checkEmail(email: string) {
  return this.http.post<boolean>(`${environment.apiURL}/users/check-email`, { email });
}


  getMethod(
    action: string,
    options: { [param: string]: unknown } = {}
  ): Observable<T | T[]> {
    return this.http.get<T[]>(
      `${this.urlAPI}/${this.endpoint}/${action}`,
      options
    );
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.urlAPI}/${this.endpoint}/${id}`);
  }

  create(item: T): Observable<T> {
    return this.http.post<T>(`${this.urlAPI}/${this.endpoint}`, item);
  }

  update(item: T): Observable<T> {
    return this.http.put<T>(`${this.urlAPI}/${this.endpoint}/${item.id}`, item);
  }

  delete(item: T) {
    return this.http.delete<T>(`${this.urlAPI}/${this.endpoint}/${item.id}`);
  }
}
