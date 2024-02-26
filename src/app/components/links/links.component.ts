import { Component } from '@angular/core';
import { LinksService } from './../../services/links.service';
import { PrimaryColor } from 'src/app/utils/color';
import { Contacto } from 'src/app/utils/Contacto';
import { Router } from '@angular/router';

@Component({
	selector: 'app-links',
	templateUrl: './links.component.html',
	styleUrls: ['./links.component.scss'],
})
export class LinksComponent {
	leftColor!: PrimaryColor;
	rightColor!: PrimaryColor;

	showFollow: boolean | null = null;
	showHello = false;

	constructor(
		private linksService: LinksService,
		private router: Router
	) {}

	ngOnInit() {
		this.linksService.leftColor$.subscribe(color => {
			this.leftColor = color;
		});
		this.linksService.rightColor$.subscribe(color => {
			this.rightColor = color;
		});
	}

	toggleFollowPopup() {
		this.showFollow = !this.showFollow;
	}

	helloPopup() {
		this.copyToClipboard();
		this.showHello = true;
		setTimeout(() => {
			this.showHello = false;
		}, 1850);
	}

	copyToClipboard() {
		navigator.clipboard.writeText(Contacto.email);
	}

	goToIGPage() {
		return Contacto.instagram;
	}

	goToLNPage() {
		return Contacto.linkedin;
	}
}
