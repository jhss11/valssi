import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})


export class App {
  protected title = 'appValssi';
  
   constructor(private translate: TranslateService) {
    translate.setDefaultLang('es');

    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      translate.use(savedLang);
    } else {
      translate.use('es');
    }
  }
}
