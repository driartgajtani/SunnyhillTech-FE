import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { Profile } from '../../../models/profile';
import { ProfileService } from '../../../services/profile.service';
import { MatTabsModule } from '@angular/material/tabs'
import { ResetPasswordRequest } from '../../../models/auth/reset-password-request';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    CommonModule,
    MatTabsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profileForm: FormGroup;
  resetPassword: FormGroup;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<ProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data // Inject the data passed by the parent component

  ) {

    data.subscribe(
      (res)=>{
        this.profileForm = this.fb.group({
          id: [res.id, Validators.required],  
          name: [res.name, Validators.required],  
          surname: [res.surname, [Validators.required]],  
          email: [res.email, [Validators.required]],
        });
        this.resetPassword = this.fb.group({
          id: [res.id, Validators.required],  
          currentPassword: ['', Validators.required],  
          newPassword: ['', Validators.required],  
          confirmNewPassword: ['', [Validators.required]],  
        });
      }
    )


    console.log(this.profileForm.value)
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    const updatedProfile: Profile = this.profileForm.value;

    this.profileService.updateProfile(updatedProfile).subscribe({
      next: () => this.dialogRef.close('success'),
      error: () => this.dialogRef.close('error'),
    });
  }

  onSubmitReset(): void {
    console.log('asd')
    
    const updatePasswordModel: ResetPasswordRequest = this.resetPassword.value;

    this.authService.resetPassword(updatePasswordModel).subscribe({
      next: () => this.dialogRef.close('success')
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
