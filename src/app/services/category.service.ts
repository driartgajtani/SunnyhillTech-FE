import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Category } from '../models/category';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    controllerName: string = "Category"
    private categorysSubject = new BehaviorSubject<Category[]>([]);
    public categorys$: Observable<Category[]> = this.categorysSubject.asObservable();

    constructor(private apiService: ApiService) { }

    loadCategorys(): void {
        this.apiService
          .get<Category[]>(this.controllerName)
          .pipe(
            tap((data) => this.categorysSubject.next(data)),
            catchError((error) => {
              console.error('Error loading Categorys', error);
              return [];
            })
          ).subscribe()
      }
    
      // Add a new Category
      addCategory(Category: Category): Observable<Category> {
        return this.apiService.post(this.controllerName, Category).pipe(
          tap((newCategory: Category) => {
            const currentCategorys = this.categorysSubject.getValue();
            this.categorysSubject.next([...currentCategorys, newCategory]);
          })
        );
      }
    
      // Delete a Category
      deleteCategory(CategoryId: number): Observable<void> {
        return this.apiService.delete<void>(`${this.controllerName}/${CategoryId}`).pipe(
          tap(() => {
            const updatedCategorys = this.categorysSubject
              .getValue()
              .filter((Category: Category) => Category.id !== CategoryId);
            this.categorysSubject.next(updatedCategorys);
          })
        );
      }
    
      // Update an existing Category
      updateCategory(Category: Category): Observable<Category> {
        return this.apiService.put(`${this.controllerName}/${Category.id}`, Category).pipe(
          tap((updatedCategory: Category) => {
            const currentCategorys = this.categorysSubject.getValue();
            const index = currentCategorys.findIndex((p) => p.id === updatedCategory.id);
            currentCategorys[index] = updatedCategory;
            this.categorysSubject.next([...currentCategorys]);
          })
        );
      }
    }

