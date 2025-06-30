import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ICategory } from '../../../interfaces';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent {
  public fb: FormBuilder = inject(FormBuilder);

  @Input() categoryForm!: FormGroup;

  @Output() callSaveMethod = new EventEmitter<ICategory>();
  @Output() callUpdateMethod = new EventEmitter<ICategory>();

  onSave() {
    const category: ICategory = {
      name: this.categoryForm.controls['name'].value,
      description: this.categoryForm.controls['description'].value
    };

    this.callSaveMethod.emit(category);
  }

  onUpdate() {
  const idValue = this.categoryForm.controls['id'].value;
  const category: ICategory = {
    id: idValue ? idValue.toString() : undefined,
    name: this.categoryForm.controls['name'].value,
    description: this.categoryForm.controls['description'].value
  };

  this.callUpdateMethod.emit(category);

  }
}

