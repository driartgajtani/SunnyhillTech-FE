import { Component, Inject } from '@angular/core';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { tap } from 'rxjs/operators';
import { ProductService } from '../../../../services/product.service';
import { Product } from '../../../../models/product';

@Component({
  selector: 'app-delete',
  imports: [
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css'
})
export class DeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteComponent>,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: Product // Inject the data passed by the parent component
  ) {
    console.log(data);
  }

  onSubmit(): void {
    this.productService.deleteProduct(this.data.id).pipe(
      tap((res) => {
        this.dialogRef.close('success');
      })
    ).subscribe()
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
