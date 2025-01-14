import { Routes } from '@angular/router';
import { CategoryComponent } from './components/home/category/category.component';
import { DashboardComponent } from './components/home/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/home/products/products.component';
import { LoginComponent } from './components/user/login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
        path: 'home', component: HomeComponent, children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'products', component: ProductsComponent },
            { path: 'categories', component: CategoryComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ], canActivate: [AuthGuard]
    }

];
