import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { FilterProduct } from '../models/filterproducts';
import { PagedResult } from '../models/helpers/pagedresult';
import { Product } from '../models/product';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    controllerName: string = "product"
    private productsSubject = new BehaviorSubject<Product[]>([]);
    private totalCountSubject = new BehaviorSubject<number>(0);
    public products$: Observable<Product[]> = this.productsSubject.asObservable();
    public count$: Observable<number> = this.totalCountSubject.asObservable();

    constructor(private apiService: ApiService) { }

    loadProducts(page:number, pageSize: number, sortColumn: string = "Name", sortDirection: string = "desc", filterObject: FilterProduct): void {
        this.apiService
          .post<PagedResult, FilterProduct>(`${this.controllerName}/${page}/${pageSize}/${sortColumn}/${sortDirection}`, filterObject)
          .pipe(
            tap((data: PagedResult) => {
                this.productsSubject.next(data.items)
                this.totalCountSubject.next(data.totalCount);
            }),
            catchError((error) => {
              console.error('Error loading products', error);
              return [];
            })
          ).subscribe()
    }
    
      // Add a new product
      addProduct(product: Product): Observable<Product> {
        return this.apiService.post(this.controllerName, product).pipe(
          tap((newProduct: Product) => {
            const currentProducts = this.productsSubject.getValue();
            this.productsSubject.next([...currentProducts, newProduct]);
          })
        );
      }
    
      // Delete a product
      deleteProduct(productId: number): Observable<void> {
        return this.apiService.delete<void>(`${this.controllerName}/${productId}`).pipe(
          tap(() => {
            const updatedProducts = this.productsSubject
              .getValue()
              .filter((product: Product) => product.id !== productId);
            this.productsSubject.next(updatedProducts);
          })
        );
      }
    
      // Update an existing product
      updateProduct(product: Product): Observable<Product> {
        return this.apiService.put(`${this.controllerName}/${product.id}`, product).pipe(
          tap((updatedProduct: Product) => {
            const currentProducts = this.productsSubject.getValue();
            const index = currentProducts.findIndex((p) => p.id === updatedProduct.id);
            currentProducts[index] = updatedProduct;
            this.productsSubject.next([...currentProducts]);
          })
        );
      }
    }

