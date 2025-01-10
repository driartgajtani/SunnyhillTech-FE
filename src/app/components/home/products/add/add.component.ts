import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';


import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../../../models/product';
import { ProductService } from '../../../../services/product.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Category } from '../../../../models/category';
import { CategoryService } from '../../../../services/category.service';

@Component({
  selector: 'app-add',
  imports: [    
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent implements OnInit {
  productForm: FormGroup;
  category$: Observable<Category[]>;

  constructor(
    public dialogRef: MatDialogRef<AddComponent>,
    private productService: ProductService,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],  
      price: [0, [Validators.required]],  
      quantity: ['', [Validators.required, Validators.min(1)]], 
      status: ['', Validators.required],  
      categoryId: ['', Validators.required], 
      category: [{id: 0, description: ''}], 
    });
    this.category$ = this.categoryService.categorys$;
  }

  ngOnInit() {
    this.categoryService.loadCategorys();  // Fetch products on initialization
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;  
    }
    const productData: Product = this.productForm.value;

    this.productService.addProduct(productData).pipe(
      tap((res) => {
        this.dialogRef.close('success');
      })
    ).subscribe()
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
