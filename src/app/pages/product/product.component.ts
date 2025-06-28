import { Component } from "@angular/core";


@Component({
   selector:"app-product",
   templateUrl :"./product.component.html" ,
   styleUrls: ["./product.component.html"],
   standalone: false
})
export class productComponent 
    {
        id: number =4;
		name: string ="Laptop Pro";
		description: string ="Portátil 16\" con i7 y 16GB RAM";
		price: number = 1000;
		stockQuantity: number = 50
}
