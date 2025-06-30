import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CategoryListComponent } from '../../components/category/category-list/category-list.component';
import { CategoryFormComponent } from '../../components/category/category-form/category-form.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { CategoryService } from '../../services/category.service';
import { ModalService } from '../../services/modal.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ICategory } from '../../interfaces';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CategoryListComponent,
    PaginationComponent,
    ModalComponent,
    LoaderComponent,
    CategoryFormComponent
  ],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'] 
})
export class CategoriesComponent {
   public teamList: ICategory[] = []
  public categoryService: CategoryService = inject(CategoryService);
  public modalService: ModalService = inject(ModalService);
  @ViewChild('addCategoryModal') public addCategoriesModal: any;
  public fb: FormBuilder = inject(FormBuilder);
  
  

  categoryForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description:['', Validators.required]
  });

  public authService: AuthService = inject(AuthService);
  public areActionsAvailable: boolean = false;
  public route: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.authService.getUserAuthorities();
    this.route.data.subscribe( data => {
      this.areActionsAvailable = this.authService.areActionsAvailable(data['authorities'] ? data['authorities'] : []);
    });
  }
  constructor() {
    this.categoryService.search.page = 1;
    this.categoryService.getAll();
  }

  saveCategory(category: ICategory) {
    this.categoryService.save(category);
    this.modalService.closeAll();
  }

  callEdition(category: ICategory) {
    this.categoryForm.controls['id'].setValue(category.id ? category.id : '');
    this.categoryForm.controls['name'].setValue(category.name ? category.name : '');
    this.categoryForm.controls['description'].setValue(category.description ? category.description : '');
    this.modalService.displayModal('md', this.addCategoriesModal);
  }

  updateCategory(category: ICategory) {
    this.categoryService.update(category);
    this.modalService.closeAll();
  }
}
