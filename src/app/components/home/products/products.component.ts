import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table'; 
import { MatPaginatorModule } from '@angular/material/paginator'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';



import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { DeleteComponent } from './delete/delete.component';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService to show error messages

@Component({
  selector: 'app-products',
  imports: [
    MatTableModule, 
    MatPaginatorModule, 
    MatIconModule, 
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products$: Observable<Product[]>;
  displayedColumns: string[] = ['name', 'price', 'quantity', 'status', 'actions'];

  page: number = 1;
  pageSize: number = 10;
  totalCount: number;
  
  constructor(private dialog: MatDialog, private productService: ProductService, private toastr: ToastrService) {
    this.products$ = this.productService.products$;
    this.productService.count$.subscribe(res => this.totalCount = res);
  }

  ngOnInit() {
    this.productService.loadProducts(this.page, this.pageSize);  // Fetch products on initialization
  }

  // Delete product with confirmation
  deleteProduct(product: Product): void {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: product
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.productService.loadProducts(this.page, this.pageSize);
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
        this.productService.loadProducts(this.page, this.pageSize);
        this.toastr.success('Updated Successfully')
      }
    });
  }

  onPageChange(page: number): void {
    this.page = page;
    this.productService.loadProducts(this.page, this.pageSize);
  }

  openAddProductDialog(): void {
    const dialogRef = this.dialog.open(AddComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.productService.loadProducts(this.page, this.pageSize);
        this.toastr.success('Added Successfully')
      }
    });
  }
}
