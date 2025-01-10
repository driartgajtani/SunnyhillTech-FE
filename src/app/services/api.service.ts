import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  getById<HttpResponseModel>(path: string, id: number): Observable<HttpResponseModel> {
    const url = `${environment.apiUrl}/${path}/${id}`;
    return this.http.get<HttpResponseModel>(url);
  }

  get<HttpResponseModel>(path: string): Observable<HttpResponseModel> {
    const url = `${environment.apiUrl}/${path}`;
    return this.http.get<HttpResponseModel>(url);
  }

  put<HttpResponseModel, RequestModel>(path: string, data: RequestModel): Observable<HttpResponseModel> {
    const url = `${environment.apiUrl}/${path}`;
    return this.http.put<HttpResponseModel>(url, data);
  }

  post<HttpResponseModel, RequestModel>(path: string, data: RequestModel): Observable<HttpResponseModel> {
    const url = `${environment.apiUrl}/${path}`;
    console.log(url);
    return this.http.post<HttpResponseModel>(url, data);
  }

  delete<HttpResponseModel>(path: string): Observable<HttpResponseModel> {
    const url = `${environment.apiUrl}/${path}`;
    return this.http.delete<HttpResponseModel>(url);
  }
}
