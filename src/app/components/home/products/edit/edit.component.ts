import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { ProductService } from '../../../../services/product.service';
import { Product } from '../../../../models/product';
import { CategoryService } from '../../../../services/category.service';
import { Category } from '../../../../models/category';

@Component({
  selector: 'app-edit',
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
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit{
  productForm: FormGroup;
  category$: Observable<Category[]>;


  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditComponent>,
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public data: Product // Inject the data passed by the parent component
  ) {
    this.productForm = this.fb.group({
      id: ['', Validators.required],  
      name: ['', Validators.required],  
      price: [0, [Validators.required]],  
      quantity: ['', [Validators.required, Validators.min(1)]], 
      status: ['', Validators.required],  
      categoryId: ['', Validators.required], 
      category: [{id: 0, description: ''}], 
    });
    this.productForm.patchValue(this.data);
    this.category$ = this.categoryService.categorys$;
  }

  ngOnInit() {
    this.categoryService.loadCategorys();  // Fetch products on initialization
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    const updatedProduct: Product = this.productForm.value;

    this.productService.updateProduct(updatedProduct).subscribe({
      next: () => this.dialogRef.close('success'),
      error: () => this.dialogRef.close('error'),
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
