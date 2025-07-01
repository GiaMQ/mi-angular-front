import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ProductListComponent } from '../../components/products/product-list/product-list.component';
import { ProductFormComponent } from '../../components/products/product-form/product-form.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ProductService } from '../../services/product.service';
import { ModalService } from '../../services/modal.service';
import { FormBuilder, Validators } from '@angular/forms';
import { IProduct } from '../../interfaces';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    ProductListComponent,
    PaginationComponent,
    ModalComponent,
    LoaderComponent,
    ProductFormComponent
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  public productService: ProductService = inject(ProductService);
  public modalService: ModalService = inject(ModalService);
  @ViewChild('addProductModal') public addProductModal: any;
  public fb: FormBuilder = inject(FormBuilder);

  productForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, Validators.required],
    stockQuantity: [0, Validators.required],
    categoryId: ['', Validators.required]
  });

  public authService: AuthService = inject(AuthService);
  public areActionsAvailable: boolean = false;
  public route: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.authService.getUserAuthorities();
    this.route.data.subscribe(data => {
      this.areActionsAvailable = this.authService.areActionsAvailable(data['authorities'] ?? []);
    });
  }

  constructor() {
    this.productService.search.page = 1;
    this.productService.getAll();
  }

  saveProduct(product: IProduct) {
    this.productService.save(product);
    this.modalService.closeAll();
  }

  callEdition(product: IProduct) {
  this.productForm.patchValue({
    id: product.id !== undefined && product.id !== null ? product.id.toString() : '',
    name: product.name ?? '',
    description: product.description ?? '',
    price: product.price ?? 0,
    stockQuantity: product.stockQuantity ?? 0,
    categoryId: product.category?.id ?? ''  
  });
  this.modalService.displayModal('md', this.addProductModal);
}

  updateProduct(product: IProduct) {
    this.productService.update(product);
    this.modalService.closeAll();
  }
}
