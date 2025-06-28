import { Component } from "@angular/core";

@Component({
   selector:"app-category",
   templateUrl :"./category.component.html" ,
   styleUrls: ["./category.component.html"],
   standalone: false
})
export class categoryComponent 
    {
    id: string ="99";
    name: string ="prueba";
    description: string = "aqui vamos";
}
