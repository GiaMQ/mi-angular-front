import { Component, EventEmitter, Input, Output, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ICategory, IProduct } from '../../../interfaces';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {
  public fb: FormBuilder = inject(FormBuilder);
  public categoryService = inject(CategoryService);
  public categoryList: ICategory[] = [];

  @Input() productForm!: FormGroup;

  @Output() callSaveMethod = new EventEmitter<IProduct>();
  @Output() callUpdateMethod = new EventEmitter<IProduct>();

    constructor() {
    // Cargar categorías y actualizar la lista reactiva
    this.categoryService.getAll();
    effect(() => {
      this.categoryList = this.categoryService.categories$();
    });
  }

  onSave() {
    const product: IProduct = {
      name: this.productForm.controls['name'].value,
      description: this.productForm.controls['description'].value,
      price: this.productForm.controls['price'].value,
      stockQuantity: this.productForm.controls['stockQuantity'].value,
       category: {
        id: this.productForm.controls['categoryId'].value
      }
    };

    this.callSaveMethod.emit(product);
  }

  onUpdate() {
    
    const idValue = this.productForm.controls['id'].value;
    const product: IProduct = {
      id: idValue ? idValue.toString() : undefined,
      name: this.productForm.controls['name'].value,
      description: this.productForm.controls['description'].value,
      price: this.productForm.controls['price'].value,
      stockQuantity: this.productForm.controls['stockQuantity'].value,
      category: {
        id: this.productForm.controls['categoryId'].value
      }
    
    };

    this.callUpdateMethod.emit(product);
  }
}
