import { Component, HostListener } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';
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
	rootURL!: string;

	constructor(
		private linksService: LinksService,
		private router: Router,
		private location: Location,
		private menuService: MenuService
	) {
		this.rootURL = this.location.path();
		this.checkResolution();
	}

	checkResolution() {
		if (window.innerWidth < 768) {
			if(this.rootURL === '/vision' || this.rootURL === '/servicios/mobile') {
				this.linksService.leftColor$.subscribe(color => {
					this.logoColor = PrimaryColor.Light;
				});
			}
			else {
				this.linksService.rightColor$.subscribe(color => {
					this.logoColor = color;
					/* console.log("entre a checkResolution", this.logoColor) */
				});

			}
		} else {
			if(this.rootURL === '/vision' || this.rootURL === '/servicios/mobile') {
				this.linksService.leftColor$.subscribe(color => {
					this.logoColor = PrimaryColor.Light;
				});
			}
			else {
				this.linksService.leftColor$.subscribe(color => {
					this.logoColor = PrimaryColor.Dark;
				});
			}
		}
	}

	/* @HostListener('window:resize', ['$event'])
	onResize() {
		this.checkResolution();
	} */

	ngOnInit() {
		this.router.events.subscribe(event => {
			if (event instanceof NavigationStart) {
				this.rootURL = event.url;
			}
		});
		this.rootURL = this.location.path();

		this.linksService.leftColor$.subscribe(color => {
			this.logoColor = color;
		});

		this.menuService.getMenuState().subscribe(state => {
			this.menuOpened = state;
		});
	}

	goToHome() {
		/* this.linksService.rightColor$.subscribe(color => {
			this.logoColor = color;
		});

		this.linksService.leftColor$.subscribe(color => {
			this.logoColor = color;
		});

		this.linksService.changeLeftColor(PrimaryColor.Light); */


		/* this.linksService.changeRightColor(PrimaryColor.Dark); */
		/* window.location.href = '/'; */
		this.router.navigate(['/']);

		if (this.menuOpened) {
			this.menuService.closeMenu();
		}
	}
}
