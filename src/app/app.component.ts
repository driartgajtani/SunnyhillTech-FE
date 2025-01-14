import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';
import { ProfileService } from './services/profile.service';

@Component({
  selector: 'app-root',
  imports: 
  [
    RouterOutlet,
    RouterModule,
    CommonModule,
    HttpClientModule,
  ],    
  providers: [
    ApiService,
    AuthService,
    ProductService,
    CategoryService,
    ProfileService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sunnyhilltech-front';
}
