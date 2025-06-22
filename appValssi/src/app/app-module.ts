import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { CoreModule } from './core/core-module';
import { ShareModule } from './share/share-module';
import { HomeModule } from './home/home-module';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { ProductModule } from './product/product-module';
//import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpErrorInterceptorService } from './share/http-error-interceptor.service';
import { UserModule } from './user/user-module';
import { ReviewModule } from './review/review-module';
import { OrderModule } from './order/order-module';

@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    CoreModule,
    ShareModule,
    HomeModule,
    ProductModule,
    UserModule,
    ReviewModule,
    OrderModule,
    AppRoutingModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
     provideHttpClient(),
    // provideAnimations() ,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [App]
})
export class AppModule { }
