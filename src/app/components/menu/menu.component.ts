import { Component, ViewEncapsulation, HostListener } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';
import { LinksService } from 'src/app/services/links.service';
import { ScrollService } from 'src/app/services/scroll.service';
import { MenuService } from 'src/app/services/menu.service';
import {
	PrimaryColor,
	SecondaryColor,
	opositeColor,
} from 'src/app/utils/color';
import { MAX_VIEWPORT_MOBILE } from 'src/app/utils/other';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class MenuComponent {
	spanColor!: PrimaryColor;
	lastLeftColor!: PrimaryColor;
	lastRightColor!: PrimaryColor;
	rootURL!: string;
	animationElement!: AnimationElement;
	whatsapp = 'assets/img/whatsapp.svg';
	showMinusVision = false;
	showMinusServices = false;
	colorDark = PrimaryColor.Dark;
	menuOpened!: boolean;
	isTransitioning = false;
	blue = SecondaryColor.Blue;

	showNewsletterPopup: boolean = false;

	constructor(
		private router: Router,
		private location: Location,
		private linksService: LinksService,
		private scrollService: ScrollService,
		private menuService: MenuService
	) {}

	checkResolution() {
		if (window.innerWidth < 768) {
			this.spanColor = PrimaryColor.Dark;
		} else {
			this.spanColor = PrimaryColor.Light;
		}
	}

	ngOnInit() {
		this.router.events.subscribe(event => {
			if (event instanceof NavigationStart) {
				this.rootURL = event.url;
			}
		});
		this.rootURL = this.location.path();

		console.log('antes ejecutar service', this.spanColor);
		this.linksService.rightColor$.subscribe(color => {
			this.spanColor = color;
		});

		this.menuService.getMenuState().subscribe(state => {
			this.menuOpened = state;
			this.isTransitioning = state;
		});

		this.menuService.closeMenu$.subscribe(() => {
			this.toggleMenu();
		});

		/* this.checkResolution(); */
	}

	toggleNewsletterPopup() {
		this.showNewsletterPopup = !this.showNewsletterPopup;
	  }

	goTo(page: string, color: string) {
		this.router.navigate([page]);
		this.menuService.changeWallColor(color);
		this.toggleMenu();
	}

	toggleMinusVision() {
		this.showMinusVision = !this.showMinusVision;
	}

	toggleMinusServices() {
		this.showMinusServices = !this.showMinusServices;
	}

	elementByURL(
		leftCard: HTMLElement,
		rightCard: HTMLElement,
		icon: HTMLElement,
		leftContent: HTMLElement,
		rightContent: HTMLElement
	): AnimationElement {
		if (this.rootURL == '/vision' || this.rootURL == '/servicios') {
			return new FullScreen(
				leftCard,
				rightCard,
				icon,
				leftContent,
				rightContent,
				this.linksService,
				this.menuService
			);
		} else {
			return new Home(
				leftCard,
				rightCard,
				icon,
				leftContent,
				rightContent,
				this.linksService
			);
		}
	}

	toggleMenu() {
		const leftCard = document.getElementById('left-card') as HTMLElement;
		const rightCard = document.getElementById('right-card') as HTMLElement;
		const icon = document.getElementById('menu-btn-icon') as HTMLElement;
		const leftContent = document.getElementById(
			'left-card-content'
		) as HTMLElement;
		const rightContent = document.getElementById(
			'right-card-content'
		) as HTMLElement;

		this.animationElement = this.elementByURL(
			leftCard,
			rightCard,
			icon,
			leftContent,
			rightContent
		);

		setTimeout(() => {
			this.isTransitioning = false;
		}, 1800);

		if (!this.menuOpened) {
			this.scrollService.notifyIsTransitioning();

			if (this.rootURL == '/vision' || this.rootURL == '/servicios') {
				this.lastLeftColor = this.spanColor;
				this.lastRightColor = this.spanColor;
			} else {
				this.lastLeftColor = opositeColor(this.spanColor);
				this.lastRightColor = this.spanColor;
			}

			this.menuService.setMenuState(true);
			this.animationElement.animationIn();
		} else {
			setTimeout(() => {
				this.scrollService.notifyIsNotTransitioning();
			}, 2000);

			this.animationElement.animationOut(
				this.lastLeftColor,
				this.lastRightColor
			);

			this.menuService.setMenuState(false);
		}
	}

	handleScroll = () => {};

	getServicesRoute() {
		return window.innerWidth > MAX_VIEWPORT_MOBILE
			? '/servicios'
			: '/servicios/mobile';
	}
}

abstract class AnimationElement {
	constructor(
		public leftCard: HTMLElement,
		public rightCard: HTMLElement,
		public icon: HTMLElement,
		public leftContent: HTMLElement,
		public rightContent: HTMLElement,
		public linksService: LinksService
	) {}

	animationIn(): void {
		this.leftCard.classList.add('animateEnter');
		this.rightCard.classList.add('animateEnter');
		this.leftContent.classList.add('animateOpacity');
		this.rightContent.classList.add('animateOpacity');
		this.leftCard.style.pointerEvents = 'all';
		this.rightCard.style.pointerEvents = 'all';
		this.icon.classList.toggle('open');

		this.leftCard.addEventListener('animationend', () => {
			if (this.leftCard.classList.contains('animateEnter')) {
				this.linksService.changeLeftColor(PrimaryColor.Dark);
				this.leftContent.style.opacity = '1';
				this.leftContent.style.zIndex = '1';
			}
		});

		this.rightCard.addEventListener('animationend', () => {
			if (this.rightCard.classList.contains('animateEnter')) {
				this.linksService.changeRightColor(PrimaryColor.Light);
				this.rightContent.style.opacity = '1';
				this.rightContent.style.zIndex = '1';
			}
		});
	}

	animationOut(lastLeftColor: PrimaryColor, lastRightColor: PrimaryColor) {
		this.leftCard.style.pointerEvents = 'none';
		this.rightCard.style.pointerEvents = 'none';
		this.linksService.changeLeftColor(lastLeftColor);
		this.linksService.changeRightColor(lastRightColor);
		this.animationOutSpecific();
	}

	abstract animationOutSpecific(): void;
}

class Home extends AnimationElement {
	constructor(
		leftCard: HTMLElement,
		rightCard: HTMLElement,
		icon: HTMLElement,
		leftContent: HTMLElement,
		rightContent: HTMLElement,
		linksService: LinksService
	) {
		super(
			leftCard,
			rightCard,
			icon,
			leftContent,
			rightContent,
			linksService
		);
	}

	animationOutSpecific(): void {
		this.icon.classList.toggle('open');

		const leftMenuCard = document.createElement('div');
		leftMenuCard.classList.add('cardmenu-left');
		leftMenuCard.classList.add('animateEnter');
		this.leftCard.appendChild(leftMenuCard);

		const rightMenuCard = document.createElement('div');
		rightMenuCard.classList.add('cardmenu-right');
		rightMenuCard.classList.add('animateEnter');
		this.rightCard.appendChild(rightMenuCard);

		leftMenuCard.addEventListener('animationend', () => {
			if (leftMenuCard.classList.contains('animateEnter')) {
				this.leftCard.classList.remove('animateEnter');
				this.leftContent.classList.remove('animateOpacity');
				this.leftContent.style.opacity = '0';
				leftMenuCard.classList.add('animateOpacity');
				leftMenuCard.style.opacity = '0';
			}
		});

		rightMenuCard.addEventListener('animationend', () => {
			if (rightMenuCard.classList.contains('animateEnter')) {
				this.rightCard.classList.remove('animateEnter');
				this.rightContent.classList.remove('animateOpacity');
				this.rightContent.style.opacity = '0';
				rightMenuCard.classList.add('animateOpacity');
				rightMenuCard.style.opacity = '0';
			}
		});

		leftMenuCard.addEventListener('transitionend', () => {
			if (leftMenuCard.classList.contains('animateOpacity')) {
				this.leftCard.removeChild(leftMenuCard);
			}
		});

		rightMenuCard.addEventListener('transitionend', () => {
			if (rightMenuCard.classList.contains('animateOpacity')) {
				this.rightCard.removeChild(rightMenuCard);
			}
		});
	}
}

class FullScreen extends AnimationElement {
	constructor(
		leftCard: HTMLElement,
		rightCard: HTMLElement,
		icon: HTMLElement,
		leftContent: HTMLElement,
		rightContent: HTMLElement,
		linksService: LinksService,
		public menuService: MenuService
	) {
		super(
			leftCard,
			rightCard,
			icon,
			leftContent,
			rightContent,
			linksService
		);
		menuService.wallColor$.subscribe(color => {
			this.wallColor = color;
		});
	}

	wallColor!: string;

	animationOutSpecific(): void {
		this.icon.classList.toggle('open');

		const leftMenuCard = document.createElement('div');
		leftMenuCard.classList.add('fullscreen');
		leftMenuCard.style.right = '50%';
		leftMenuCard.style.backgroundColor = this.wallColor;
		leftMenuCard.classList.add('animateEnter');
		this.leftCard.appendChild(leftMenuCard);

		const rightMenuCard = document.createElement('div');
		rightMenuCard.classList.add('fullscreen');
		rightMenuCard.style.left = '50%';
		rightMenuCard.style.backgroundColor = this.wallColor;
		rightMenuCard.classList.add('animateEnter');
		this.rightCard.appendChild(rightMenuCard);

		leftMenuCard.addEventListener('animationend', () => {
			if (leftMenuCard.classList.contains('animateEnter')) {
				this.leftCard.classList.remove('animateEnter');
				this.leftContent.classList.remove('animateOpacity');
				this.leftContent.style.opacity = '0';
				leftMenuCard.classList.add('animateOpacity');
				leftMenuCard.style.opacity = '0';
			}
		});

		rightMenuCard.addEventListener('animationend', () => {
			if (rightMenuCard.classList.contains('animateEnter')) {
				this.rightCard.classList.remove('animateEnter');
				this.rightContent.classList.remove('animateOpacity');
				this.rightContent.style.opacity = '0';
				rightMenuCard.classList.add('animateOpacity');
				rightMenuCard.style.opacity = '0';
			}
		});

		leftMenuCard.addEventListener('transitionend', () => {
			if (leftMenuCard.classList.contains('animateOpacity')) {
				this.leftCard.removeChild(leftMenuCard);
			}
		});

		rightMenuCard.addEventListener('transitionend', () => {
			if (rightMenuCard.classList.contains('animateOpacity')) {
				this.rightCard.removeChild(rightMenuCard);
			}
		});
	}
}
