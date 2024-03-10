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
		if (window.innerWidth < 852) {
			if(this.rootURL === '/vision' || this.rootURL === '/servicios/mobile') {
				this.linksService.leftColor$.subscribe(color => {
					this.logoColor = PrimaryColor.Light;
				});
			}
			else {
				if(this.rootURL === '/') {
					this.linksService.leftColor$.subscribe(color => {
						this.logoColor = PrimaryColor.Dark;
					});
				}else {
					this.linksService.rightColor$.subscribe(color => {
						this.logoColor = color;
					});
				}

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
		*/

		if(this.rootURL === '/vision' || this.rootURL === '/servicios/mobile' || this.rootURL === '/servicios') {
			this.linksService.changeLeftColor(PrimaryColor.Dark);
		} 


		/* this.linksService.changeRightColor(PrimaryColor.Dark); */
		/* window.location.href = '/'; */
		this.router.navigate(['/']);

		if (this.menuOpened) {
			this.menuService.closeMenu();
		}
	}
}
