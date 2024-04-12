import { Component } from '@angular/core';
import { SeoService } from './services/seo.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	constructor(private seoService: SeoService) {
		this.seoService.setMetaTags(
			'Uchu Agencia',
			'Somos una agencia especializada en comunicación y diseño. *El camino para alcanzar tus metas*',
			'agencia, comunicación, diseño, marketing, branding, estrategia, uchu, uchuagencia, relaciones públicas, campañas publicitarias, eventos corporativos'
		)
	}
}
