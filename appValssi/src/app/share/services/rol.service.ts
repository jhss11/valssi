import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { BaseAPI } from '../base-api';
import { RoleModel } from '../models/RoleModel';

@Injectable({
  providedIn: 'root'
})
export class RolService extends BaseAPI<RoleModel> {

    constructor(httpClient: HttpClient) { 
        super(
          httpClient,
          environment.endPointRol);
      }
}