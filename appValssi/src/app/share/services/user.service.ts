import { Injectable } from '@angular/core';
import { BaseAPI } from '../base-api';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/UserModel';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseAPI<UserModel>{

  constructor( httpClient: HttpClient) { 
    super(
      httpClient,
      environment.endPointUser
      )
  }
}