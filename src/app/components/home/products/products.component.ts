import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table'; 
import { MatPaginatorModule } from '@angular/material/paginator'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { DeleteComponent } from './delete/delete.component';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService to show error messages
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';

@Component({
  selector: 'app-products',
  imports: [
    ReactiveFormsModule,
    MatTableModule, 
    MatPaginatorModule, 
    MatIconModule, 
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    CommonModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products$: Observable<Product[]>;
  categories$: Observable<Category[]>;
  displayedColumns: string[] = ['name', 'price', 'quantity', 'status', 'category', 'actions'];

  page: number = 1;
  pageSize: number = 10;
  totalCount: number;
  filterForm: FormGroup;


  
  constructor(private dialog: MatDialog, private productService: ProductService, private toastr: ToastrService, private fb: FormBuilder, private categoryService: CategoryService) {
    this.products$ = this.productService.products$;
    this.categories$ = this.categoryService.categorys$;
    this.productService.count$.subscribe(res => this.totalCount = res);
    this.filterForm = this.fb.group({
      name: [''],
      status: [''],
      categoryId: [null],
    });
  }

  ngOnInit() {
    this.categoryService.loadCategorys();
    this.productService.loadProducts(this.page, this.pageSize, this.filterForm.value);  // Fetch products on initialization
    this.filterForm.valueChanges.subscribe(() => {
      this.page = 1; // Reset to the first page when filters change
      this.productService.loadProducts(this.page, this.pageSize, this.filterForm.value);
    });
  }

  // Delete product with confirmation
  deleteProduct(product: Product): void {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: product
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.productService.loadProducts(this.page, this.pageSize, this.filterForm.value);
        this.toastr.success('Deleted Successfully')
      }
    });
  }

  // Edit product (this should open a form dialog to edit)
  editProduct(product: Product): void {
    // Open dialog to edit the product (not implemented yet)
    console.log(product)
    const dialogRef = this.dialog.open(EditComponent, {
      data: product // Pass the product data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.productService.loadProducts(this.page, this.pageSize, this.filterForm.value);
        this.toastr.success('Updated Successfully')
      }
    });
  }

  onPageChange(page: number): void {
    this.page = page;
    this.productService.loadProducts(this.page, this.pageSize, this.filterForm.value);
  }

  openAddProductDialog(): void {
    const dialogRef = this.dialog.open(AddComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.productService.loadProducts(this.page, this.pageSize, this.filterForm.value);
        this.toastr.success('Added Successfully')
      }
    });
  }

    // Method to clear filters
    clearFilters(): void {
      this.filterForm.reset(); // Reset the form to its initial state
      this.page = 1;
      this.productService.loadProducts(this.page, this.pageSize, this.filterForm.value); // Fetch unfiltered products
    }
}
