import { Component, effect, EventEmitter, inject, Input, Output } from '@angular/core';
import { ICategory, IProduct } from '../../../interfaces';  // Cambié a IProduct
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../pagination/pagination.component';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-product-list',  // Cambié el selector
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',  // Cambié la ruta al template
  styleUrls: ['./product-list.component.scss']   // Cambié la ruta al estilo
})
export class ProductListComponent {
  @Input() title: string = '';
  @Input() categoryList: ICategory[] = [];
  @Input() products: IProduct[] = [];   // Cambié el nombre y tipo
  @Output() callModalAction = new EventEmitter<IProduct>();
  @Output() callDeleteAction = new EventEmitter<IProduct>();

  public authService: AuthService = inject(AuthService);
  public areActionsAvailable: boolean = false;
  public route: ActivatedRoute = inject(ActivatedRoute);
  public productService: ProductService = inject(ProductService);
  public categoryService: CategoryService = inject(CategoryService);

  ngOnInit(): void {
    this.authService.getUserAuthorities();
    this.route.data.subscribe(data => {
      this.areActionsAvailable = this.authService.areActionsAvailable(data['authorities'] ? data['authorities'] : []);
    });
    
  }
  constructor() {
    this.categoryService.getAll();
    this.productService.getAll();
    effect(() => {
      this.categoryList = this.categoryService.categories$();
    });
  }
  getCategoryName(categoryId: string | undefined): string {
    if (!categoryId || !this.categoryList) return '';
    const category = this.categoryList.find((cat: any) => cat.id === categoryId);
    return category ? category.name ?? '' : '';
  }

}
