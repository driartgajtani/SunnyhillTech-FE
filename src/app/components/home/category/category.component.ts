import { Component, OnInit } from '@angular/core';
import { Category } from '../../../models/category';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from '../../../services/category.service';
import { MatTableModule } from '@angular/material/table'; 
import { MatPaginatorModule } from '@angular/material/paginator'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DeleteComponent } from './delete/delete.component';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService to show error messages
import { ProfileService } from '../../../services/profile.service';
import { Profile } from '../../../models/profile';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
  imports: [
    MatTableModule, 
    MatPaginatorModule, 
    MatIconModule, 
    MatDialogModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  category$: Observable<Category[]>;
  displayedColumns: string[] = ['id', 'description', 'actions'];
  user: Profile;

  constructor(private dialog: MatDialog, private categoryService: CategoryService, private toastr: ToastrService, private profileService: ProfileService) {
    this.category$ = this.categoryService.categorys$;
    this.profileService.profile$.subscribe((res: Profile) => {
      this.user = res
    });
  }

  ngOnInit() {
    this.categoryService.loadCategorys();  // Fetch categories on initialization
  }

  


  deleteCategory(category: Category): void {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: category
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.categoryService.loadCategorys();
        this.toastr.success('Deleted Successfully')
      }
    });
  }

  editCategory(category: Category): void {
    const dialogRef = this.dialog.open(EditComponent, {
      data: category // Pass the category data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.categoryService.loadCategorys();
        this.toastr.success('Updated Successfully')
      }
    });
  }

  openAddCategoryDialog(): void {
    const dialogRef = this.dialog.open(AddComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.categoryService.loadCategorys();
        this.toastr.success('Added Successfully')
      }
    });
  }
}
