import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LinksService } from 'src/app/services/links.service';
import { MenuService } from 'src/app/services/menu.service';
import { PrimaryColor } from 'src/app/utils/color';
@Component({
	selector: 'app-logo',
	templateUrl: './logo.component.html',
	styleUrls: ['./logo.component.scss'],
})
export class LogoComponent {
	logoColor!: PrimaryColor;
	menuOpened!: boolean;

	constructor(
		private linksService: LinksService,
		private router: Router,
		private menuService: MenuService
	) {}

	ngOnInit() {
		this.linksService.leftColor$.subscribe(color => {
			this.logoColor = color;
		});

		this.menuService.getMenuState().subscribe(state => {
			this.menuOpened = state;
		});
	}

	goToHome() {
		this.linksService.changeLeftColor(PrimaryColor.Dark);
		this.linksService.changeRightColor(PrimaryColor.Light);
		this.router.navigate(['/']);
		if (this.menuOpened) {
			this.menuService.closeMenu();
		}
	}
}
