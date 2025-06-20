import { Injectable } from '@angular/core';
import { BaseAPI } from '../base-api';
import { ProductModel } from '../models/ProductModel';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseAPI<ProductModel>{

  constructor(httpClient: HttpClient) { 
    super(
      httpClient,
      environment.endPointProduct
    )
  }
}
