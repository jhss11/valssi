import { Injectable } from '@angular/core';
import { OrderModel } from '../models/OrderModel';
import { BaseAPI } from '../base-api';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseAPI<OrderModel>{

  constructor(httpClient: HttpClient) { 
    super(
      httpClient,
      environment.endPointOrder
    )
    
  }
  
}
