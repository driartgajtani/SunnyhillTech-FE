import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../../services/category.service';
import { Category } from '../../../../models/category';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA  } from '@angular/material/dialog';

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
export class EditComponent {
  categoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditComponent>,
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public data: Category // Inject the data passed by the parent component
  ) {
    this.categoryForm = this.fb.group({
      id: ['', Validators.required],  
      description: ['', [Validators.required, Validators.min(1)]]
    });
    this.categoryForm.patchValue(this.data);

  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }
    const updatedCategory: Category = this.categoryForm.value;

    this.categoryService.updateCategory(updatedCategory).subscribe({
      next: () => this.dialogRef.close('success'),
      error: () => this.dialogRef.close('error'),
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  
}
