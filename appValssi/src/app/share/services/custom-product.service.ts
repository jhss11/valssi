import { Injectable } from '@angular/core';
import { BaseAPI } from '../base-api';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { CustomProductModel } from '../models/CustomProductModel';

@Injectable({
  providedIn: 'root'
})
export class CustomProductService extends BaseAPI<CustomProductModel>{

  constructor(httpClient: HttpClient) { 
    super(
      httpClient,
      environment.endPointCustomProduct
    )
  }
}
