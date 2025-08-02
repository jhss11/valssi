import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  standalone: false,
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio implements OnInit {
  productos: any[] = [];

  ngOnInit(): void {
    this.productos = [
      {
        id: 1,
        name: 'Sofá moderno',
        price: 250000,
        images: ['http://localhost:3000/images/maceta-1.jpg']
      },
      {
        id: 2,
        name: 'Mesa de centro',
        price: 125000,
        images: ['http://localhost:3000/images/soporte-tv-1.jpg']
      },
      {
        id: 3,
        name: 'Lámpara decorativa',
        price: 89000,
        images: ['http://localhost:3000/images/edredon-1.jpg']
      }
    ];
  }
}
