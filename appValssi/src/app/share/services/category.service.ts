import { Injectable } from '@angular/core';
import { BaseAPI } from '../base-api';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { CategoryModel } from '../models/CategoryModel';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseAPI<CategoryModel>{

  constructor( httpClient: HttpClient) { 
    super(
      httpClient,
      environment.endPointCategory
      )
  }
}
