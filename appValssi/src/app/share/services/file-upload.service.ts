import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private baseUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

upload(file: File, previousImage: string | null | undefined): Observable<any> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('previousFileName', previousImage || '');
  return this.http.post<any>(`${this.baseUrl}/file/upload`, formData);
}

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}file/files`);
  }
}
