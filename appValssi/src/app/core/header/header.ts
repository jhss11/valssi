import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(private translate: TranslateService) {
    this.currentUser={
      email:'jhasimarias@gmail.com'
    }
    

    
  }
  switchLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
}
