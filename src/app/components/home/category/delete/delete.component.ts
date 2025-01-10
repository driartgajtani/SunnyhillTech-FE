import { Component, Inject } from '@angular/core';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService } from '../../../../services/category.service';
import { tap } from 'rxjs/operators';
import { Category } from '../../../../models/category';

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
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public data: Category // Inject the data passed by the parent component
  ) {
    console.log(data);
  }

  onSubmit(): void {
    this.categoryService.deleteCategory(this.data.id).pipe(
      tap((res) => {
        this.dialogRef.close('success');
      })
    ).subscribe()
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
