import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtService } from './jwt.service';
import { AuthResponse } from '../models/auth/auth-response';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  constructor(private apiService: ApiService, private jwtService: JwtService, private router: Router) {
    this.isAuthenticatedSubject.next(this.jwtService.isAuthenticated());
  }

  login(email: string, password: string): Observable<any> {
    return this.apiService.post<AuthResponse, { email: string, password: string }>('auth/login', { email, password }).pipe(
      tap((res) => this.handleAuthSuccess(res)),
      catchError((error) => throwError(error))
    );
  }

  private handleAuthSuccess(res: AuthResponse): void {
    if (res && res.token) {
      this.jwtService.saveToken(res.token);
      this.isAuthenticatedSubject.next(true);
    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }

  logout(): void {
    this.jwtService.purgeAuth();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.jwtService.isAuthenticated();
  }

  getToken(): string | null {
    return this.jwtService.getToken();
  }

  saveToken(token: string): void {
    this.jwtService.saveToken(token);
  }

  hasRole(role: string): boolean {
    return this.jwtService.hasRole(role);
  }

}
