import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs'
import { ProfileService } from '../../../services/profile.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    CommonModule,
    MatTabsModule
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  forgotPasswordForm: FormGroup;

  forgotPassword: boolean = false;
  constructor(private fb: FormBuilder, private authService: AuthService, private profileService: ProfileService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }


  onLogin() {
    if (this.loginForm.valid) {
      console.log('Login successful', this.loginForm.value);
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(() => this.router.navigate(['/home']));
    } else {
      console.log('Form is invalid');
    }
  }

  onReset() {
    if (this.forgotPasswordForm.valid) {
      console.log('Reset successful', this.forgotPasswordForm.value);
      this.authService.forgotPassword(this.forgotPasswordForm.value.email).subscribe(() => this.forgotPassword = false);
    } else {
      console.log('Form is invalid'); 
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.profileService.createUser(this.registerForm.value).subscribe(() => {
        this.registerForm.reset();
      });
    } else {
      console.log('Form is invalid');
    }
  }

  showForgotPassword() {
    this.forgotPassword = !this.forgotPassword;
  }

}
