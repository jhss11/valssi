import { Injectable } from '@angular/core';
import { CustomOptionValueModel } from '../models/CustomOptionValueModel';
import { BaseAPI } from '../base-api';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OptionValueService extends BaseAPI<CustomOptionValueModel> {

  constructor(httpClient: HttpClient) { 
    super(
      httpClient,
      environment.endPointOptionValue
    )
  }
}




