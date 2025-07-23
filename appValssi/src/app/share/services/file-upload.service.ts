import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
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




  // ✅ Devuelve solo el resultado final, no HttpEvent
  // upload(file: File, previousImage: string | null | undefined): Observable<{ fileName: string }> {
  //   const formData: FormData = new FormData();

  //   formData.append('file', file);
  //   formData.append('previousFileName', previousImage || '');

  //   // El backend debería devolver un objeto { fileName: string }
  //   return this.http.post<{ fileName: string }>(`${this.baseUrl}/file/upload`, formData);
  // }

  // // ✅ Devuelve array de nombres de archivos
  // uploadMultiple(files: File[], previousImages: (string | null | undefined)[] = []): Observable<string[]> {
  //   const uploads = files.map((file, index) => {
  //     const prev = previousImages[index] || '';
  //     return this.upload(file, prev); // cada uno devuelve { fileName: string }
  //   });

  //   return forkJoin(uploads).pipe(
  //     map(results => results.map(r => r.fileName)) // ← solo los fileNames
  //   );
  // }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}file/files`);
  }
}
