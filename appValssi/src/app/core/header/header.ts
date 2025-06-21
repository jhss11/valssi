import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
qtyItems:Number=0
  isAutenticated:boolean=false
  currentUser:any
  constructor() {
    this.currentUser={
      email:'jhasimarias@gmail.com'
    }
    
  }
}
