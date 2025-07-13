import { Injectable } from '@angular/core';
import { BaseAPI } from '../base-api';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { TagModel } from '../models/TagModel';

@Injectable({
  providedIn: 'root'
})
export class PromoTypeService extends BaseAPI<TagModel>{

  constructor( httpClient: HttpClient) { 
    super(
      httpClient,
      environment.endPointPromoType
      )
  }
}
