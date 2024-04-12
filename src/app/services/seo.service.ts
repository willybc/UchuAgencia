import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
	providedIn: 'root',
})
export class SeoService {
	constructor(
		private metaService: Meta,
		private titleService: Title
	) {}

	setMetaTags(title: string, description: string, keywords: string): void {
		this.titleService.setTitle(title);
		this.metaService.addTags([
			{ name: 'description', content: description },
			{ name: 'keywords', content: keywords },
		]);
	}
}
