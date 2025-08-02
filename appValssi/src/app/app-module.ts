import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { CoreModule } from './core/core-module';
import { ShareModule } from './share/share-module';
import { HomeModule } from './home/home-module';
import { ProductModule } from './product/product-module';
//import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpErrorInterceptorService } from './share/http-error-interceptor.service';
import { UserModule } from './user/user-module';
import { ReviewModule } from './review/review-module';
import { OrderModule } from './order/order-module';
import { PromotionModule } from './promotion/promotion-module';


import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient } from '@angular/common/http';

// i18n imports
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Función para el loader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    App,
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
    PromotionModule,

    // Módulo de traducción configurado
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'es', // opcional
    }),
    AppRoutingModule,

  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    //  <-- no usar si ya usás HttpClientModule
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [App]
})
export class AppModule {}