import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JwtToken } from '../models/auth/jwt-token';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  public decodedToken: JwtToken | null = null;
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  decodeToken(): JwtToken | null {
    const token = this.getToken();

    if (token) {
      const helper = new JwtHelperService();
      try {
        const decoded = helper.decodeToken(token) as JwtToken;
        this.decodedToken = decoded;
        return decoded;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }

    return null;
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
    this.decodeToken();
  }

  saveRefreshToken(refreshToken: string): void {
    localStorage.setItem('refreshToken', refreshToken);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const helper = new JwtHelperService();
    return token ? !helper.isTokenExpired(token) : false;
  }

  purgeAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.decodedToken = null;
  }

  hasRole(role: string): boolean {
    const decodedToken = this.decodeToken();
    const roles = decodedToken?.roles;

    if (roles && Array.isArray(roles)) {
      const normalizedRole = role.toLowerCase();
      return roles.some((r) => r.toLowerCase() === normalizedRole);
    }

    return false;
  }
}