import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../../services/category.service';
import { Category } from '../../../../models/category';
import { tap } from 'rxjs/operators';

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
export class AddComponent {
  categoryForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddComponent>,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      description: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      return;  
    }
    const categoryData: Category = this.categoryForm.value;

    this.categoryService.addCategory(categoryData).pipe(
      tap((res) => {
        this.dialogRef.close('success');
      })
    ).subscribe()
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
