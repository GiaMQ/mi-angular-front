import { inject, Injectable, signal, Signal } from '@angular/core';
import { BaseService } from './base-service';
import { ISearch, IProduct, IResponse, ICategory } from '../interfaces';  // Cambiar ICategory por IProduct
import { AlertService } from './alert.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseService<IProduct> {  // Cambiar CategoryService a ProductService e ICategory a IProduct
  protected override source: string = 'api/products';  // Cambiar endpoint

  public productListSignal = signal<IProduct[]>([]);  // Cambiar nombre de la señal
  get products$() {
    return this.productListSignal;
  }

  public search: ISearch = {
    page: 1,
    size: 5
  }

  public totalItems: any = [];
  private alertService: AlertService = inject(AlertService);

  getAll() {
  const productRequest = this.http.get<IProduct[]>('api/products');
  const categoryRequest = this.http.get<ICategory[]>('api/categories');

  forkJoin([productRequest, categoryRequest]).subscribe({
    next: ([products, categories]) => {
      console.log('Categoria recibidos:', categories); 
      console.log('Productos recibidos:', products); 
      const enrichedProducts = products.map(product => {
        const category = categories.find(cat => cat.id === product.categoryId); 
        return {
          ...product,
          category: category ? {
            id: category.id,
            name: category.name,
            description: category.description
          } : undefined
        };
      });

      this.productListSignal.set(enrichedProducts);
    },
    error: (err: any) => {
      console.error('Error al obtener productos o categorías:', err);
    }
  });
}

  save(product: IProduct) {
    this.add(product).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred adding the product', 'center', 'top', ['error-snackbar']);
        console.error('Error al guardar producto:', err);
      }
    });
  }

  update(product: IProduct) {
   
    return this.http.put(`${this.source}/${product.id}`, product).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err) => {
        this.alertService.displayAlert('error', 'Error al actualizar el producto', 'center', 'top', ['error-snackbar']);
        console.error('Error al actualizar producto:', err);
      }
    });
  }

  deleteProductTextResponse(id: string) {
    return this.http.delete(`${this.source}/${id}`, { responseType: 'text' });
  }

  delete(product: IProduct) {
    this.deleteProductTextResponse(`${product.id}`).subscribe({
      next: (responseText: string) => {
        this.alertService.displayAlert('success', responseText, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err) => {
        this.alertService.displayAlert('error', 'An error occurred deleting the product', 'center', 'top', ['error-snackbar']);
        console.error('Error al eliminar producto:', err);
      }
    });
  }
}
