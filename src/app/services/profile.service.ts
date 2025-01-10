import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Profile } from '../models/profile';
import { UserRegisterRequestVM } from '../models/userRegisterRequestVM';
import { ApiService } from './api.service';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService to show error messages

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    controllerName: string = "profile"
    private profileSubject = new BehaviorSubject<Profile>(null);
    public profile$: Observable<Profile> = this.profileSubject.asObservable();

    constructor(private apiService: ApiService, private toastr: ToastrService) { }

    loadProfile(id: number): void {
        this.apiService
          .get<Profile>(`${this.controllerName}/${id}`)
          .pipe(
            tap((data) => this.profileSubject.next(data)),
            catchError((error) => {
              console.error('Error loading products', error);
              return [];
            })
          ).subscribe()
    }

    updateProfile(profile: Profile): Observable<Profile> {
        return this.apiService.put(`${this.controllerName}/${profile.id}`, profile).pipe(
        tap((updatedProfile: Profile) => {
            this.profileSubject.next(updatedProfile);
        }));
    }

          // Add a new product
    createUser(profile: UserRegisterRequestVM): Observable<Profile> {
        return this.apiService.post(this.controllerName, profile).pipe(
            tap((profile: Profile) => {
                this.toastr.success('Registered successfully')
            })
        );
    }
    
}

