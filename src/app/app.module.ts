import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// COMPONENTES
import { WaveCardComponent } from './components/wave-card/wave-card.component';
import { MenuComponent } from './components/menu/menu.component';
import { LogoComponent } from './components/logo/logo.component';

// PÁGINAS
import { HomeComponent } from './pages/home/home.component';
import { VisionComponent } from './pages/vision/vision.component';
import { ServiciosComponent } from './pages/servicios/servicios.component';
import { HoverLetterComponent } from './components/hover-letter/hover-letter.component';
import { ColorTransitionComponent } from './components/transition/transition.component';
import { LinksComponent } from './components/links/links.component';
import { CircleComponent } from './components/circle/circle.component';
import { ServiciosNavComponent } from './pages/servicios-nav/servicios-nav.component';
import { SafeHtmlPipe } from './utils/safe-html.pipe';
import { ServiciosMobileComponent } from './pages/servicios-mobile/servicios-mobile.component';
import { ConfigService } from './services/config.service';
import { LoaderComponent } from './components/loader/loader.component';
import { NewsletterPopupComponent } from './components/newsletter-popup/newsletter-popup.component';

export function LoadConfiguration(configService: ConfigService) {
  return () => configService.load();
}

@NgModule({
  declarations: [
    AppComponent,
    WaveCardComponent,
    HomeComponent,
    MenuComponent,
    LogoComponent,
    VisionComponent,
    ServiciosComponent,
    HoverLetterComponent,
    ColorTransitionComponent,
    LinksComponent,
    CircleComponent,
    ServiciosNavComponent,
    SafeHtmlPipe,
    ServiciosMobileComponent,
    LoaderComponent,
    NewsletterPopupComponent
  ],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, FormsModule],
  providers: [
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: LoadConfiguration,
      deps: [ConfigService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
