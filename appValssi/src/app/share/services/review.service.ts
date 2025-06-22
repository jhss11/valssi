import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReviewModel } from '../models/ReviewModel';
import { environment } from '../../../environments/environment.development';
import { BaseAPI } from '../base-api';

@Injectable({
  providedIn: 'root'
})
export class ReviewService extends BaseAPI<ReviewModel>{

 constructor(httpClient: HttpClient) { 
    super(
      httpClient,
      environment.endPointReview
    )
  }
}
