import { Injectable } from '@angular/core';
import { BaseAPI } from '../base-api';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { PromotionModel } from '../models/PromotionModel';

@Injectable({
  providedIn: 'root'
})
export class PromotionService extends BaseAPI<PromotionModel>{

  constructor( httpClient: HttpClient) { 
    super(
      httpClient,
      environment.endPointPromotion
      )
  }
}
