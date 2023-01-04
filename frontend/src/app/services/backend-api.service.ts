import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Image } from '../models/image';

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {

  constructor(private readonly http: HttpClient) { }

  convertSketchToImage(formData: FormData): Observable<Image> {
    return this.http.post<Image>('http://localhost:5000/api/model/convert', formData);
  }

  colorizeImage(): Observable<Image> {
    return this.http.get<Image>('http://localhost:5000/api/model/colorize');
  }
}
