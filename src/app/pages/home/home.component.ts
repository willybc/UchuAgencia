import { Component, HostListener } from '@angular/core';
import { LinksService } from 'src/app/services/links.service';
import { PrimaryColor } from 'src/app/utils/color';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
	onMobile: boolean = false;

	constructor(private linksService: LinksService) {
		this.onMobile = window.innerWidth < 768;
	}

	ngOnInit() {
		this.actualizarColores()
	}

	actualizarColores() {
		if (this.onMobile) {
		  this.linksService.changeRightColor(PrimaryColor.Dark);
		} else {
		  this.linksService.changeLeftColor(PrimaryColor.Dark);
		  this.linksService.changeRightColor(PrimaryColor.Light);
		}
	  }

	@HostListener('window:resize', ['$event'])
	onResize() {
		this.onMobile = window.innerWidth < 768;
		this.actualizarColores();
	}
}
