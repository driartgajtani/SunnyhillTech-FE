import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService to show error messages
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private toastr: ToastrService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const token = this.authService.getToken();
      if (token) {
          req = req.clone({
              setHeaders: {
                  Authorization: `Bearer ${token}`
              }
          });
      }

        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              // Unauthorized error, you can redirect or show a login prompt
              this.toastr.error(error.error, 'Error');
            } else if (error.status === 500) {
              // Internal Server Error
              this.toastr.error('Something went wrong! Please try again later.', 'Error');
            }else if (error.status === 403) {
              // Internal Server Error
              this.toastr.error('Not Authorized.', 'Error');
            } else {
              // Generic error handling
              this.toastr.error(error.message || 'An error occurred!', 'Error');
            }
                return throwError(error);
            })
        );
    
      }
}