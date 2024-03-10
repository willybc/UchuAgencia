import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { VisionComponent } from './pages/vision/vision.component';
import { ServiciosComponent } from './pages/servicios/servicios.component';
import { ServiciosNavComponent } from './pages/servicios-nav/servicios-nav.component';
import { ServiciosMobileComponent } from './pages/servicios-mobile/servicios-mobile.component';
import { LoaderComponent } from './components/loader/loader.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'vision', component: VisionComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'servicios/nav', component: ServiciosNavComponent },
  { path: 'servicios/mobile', component: ServiciosMobileComponent },
  { path: 'loader', component: LoaderComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
