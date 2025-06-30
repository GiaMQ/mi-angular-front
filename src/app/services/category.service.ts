import { inject, Injectable, signal, Signal } from '@angular/core';
import { BaseService } from './base-service';
import { ISearch, ICategory, IResponse } from '../interfaces';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends BaseService<ICategory> {
  protected override source: string = 'api/categories';

  public categoryListSignal = signal<ICategory[]>([]);
  get categories$() {
    return this.categoryListSignal;
  }

  public search: ISearch = {
    page: 1,
    size: 5
  }

  public totalItems: any = [];
  private alertService: AlertService = inject(AlertService);
getAll() {
  this.findAllWithParams({ page: this.search.page, size: this.search.size }).subscribe({
    next: (response: any) => {
       const categoriesArray = Array.isArray(response) ? response : [response];
      this.categoryListSignal.set(categoriesArray); 
    },
    error: (err: any) => {
      console.error('Error al obtener categorías:', err);
    }
  });
}
  

  save(category: ICategory) {
    this.add(category).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred adding the category', 'center', 'top', ['error-snackbar']);
        console.error('Error al guardar categoría:', err);
      }
    });
  }

  update(category: ICategory) {
    console.log('Llamando update con:', `${this.source}/${category.id}`, category);  ///Aqui llegue
  return this.http.put(`${this.source}/${category.id}`, category).subscribe({
    
    next: (response: any) => {
      this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
      this.getAll();
    },
    error: (err) => {
      this.alertService.displayAlert('error', 'Error al actualizar la categoría', 'center', 'top', ['error-snackbar']);
      console.error('Error al actualizar categoría:', err);
    }
  });
}


deleteCategoryTextResponse(id: string) {
  return this.http.delete(`${this.source}/${id}`, { responseType: 'text' });
}


  delete(category: ICategory) {
  this.deleteCategoryTextResponse(`${category.id}`).subscribe({
    next: (responseText: string) => {
      this.alertService.displayAlert('success', responseText, 'center', 'top', ['success-snackbar']);
      this.getAll();
    },
    error: (err) => {
      this.alertService.displayAlert('error', 'An error occurred deleting the category', 'center', 'top', ['error-snackbar']);
      console.error('Error al eliminar categoría:', err);
    }
  });
}

}
