import { Component, HostListener } from '@angular/core';
import { TransitionService } from 'src/app/services/transition.service';
import { ScrollService } from 'src/app/services/scroll.service';
import { CircleService } from 'src/app/services/circle.service';
import { LinksService } from 'src/app/services/links.service';
import { MenuService } from 'src/app/services/menu.service';
import {
	PrimaryColor,
	SecondaryColor,
	opositeColor,
} from 'src/app/utils/color';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {
	ServicioCampanias,
	ServicioComunicacion,
	ServicioDisenio,
	ServicioEventos,
} from 'src/app/utils/icons';
import anime from 'animejs/lib/anime.es.js';
import { NavigationService } from 'src/app/services/navigation.service';
import { MAX_VIEWPORT_MOBILE } from 'src/app/utils/other';

@Component({
	selector: 'app-servicios',
	templateUrl: './servicios.component.html',
	styleUrls: ['./servicios.component.scss'],
})
export class ServiciosComponent {
	index!: number;
	lenght = 4;
	nextIndex!: number;
	isTransitioning!: boolean;

	linksColor: PrimaryColor = PrimaryColor.Light;
	scrollSubscription!: Subscription;
	circleSubscription!: Subscription;

	titles!: NodeListOf<HTMLElement>;
	numbers!: NodeListOf<HTMLElement>;
	stayService = true;

	comunicacion = new ServicioComunicacion(this.linksService);
	disenio = new ServicioDisenio();
	campanias = new ServicioCampanias();
	eventos = new ServicioEventos(this.linksService);

	previousTouchX!: number;

	constructor(
		private transService: TransitionService,
		private scrollService: ScrollService,
		private circleService: CircleService,
		private linksService: LinksService,
		private menuService: MenuService,
		private navService: NavigationService,
		private router: Router
	) {}

	ngOnInit() {
		this.index = 0;

		this.linksService.changeLeftColor(this.linksColor);
		this.linksService.changeRightColor(this.linksColor);
		this.menuService.changeWallColor(PrimaryColor.Dark);

		this.circleSubscription = this.circleService.serviceSection$.subscribe(
			nextIndex => {
				this.manualChange(nextIndex);
			}
		);

		this.scrollSubscription =
			this.scrollService.isTransitioningSubject$.subscribe(state => {
				this.isTransitioning = state;
			});

		this.navService.changeSectionNavigate.subscribe(index => {
			if (index != null) {
				console.log("HIJO, 81", index) 
				this.navigate(index);
			}
		});
	}

	ngAfterViewInit() {
		this.titles = document.querySelectorAll<HTMLElement>('.title');
		this.numbers = document.querySelectorAll<HTMLElement>('.number');

		anime
			.timeline({
				loop: true,
				easing: 'easeInOutQuint',
				direction: 'alternate',
				duration: 1500,
				delay: 1000,
				endDelay: 1000,
			})
			.add({
				targets: '.services-desc-h1',
				translateY: '-1.4em',
			});

		this.comunicacion.animation();
		this.disenio.animation();
		this.campanias.animation();
		this.eventos.animation();

		const svgs =
			document.querySelectorAll<HTMLElement>('.services-svg svg');
		svgs.forEach(function (svg) {
			if (window.innerWidth > MAX_VIEWPORT_MOBILE) {
				svg.setAttribute('width', '100%');
				svg.setAttribute('height', '100%');
			} else {
				/* svg.setAttribute('width', '50% !important'); */
				svg.setAttribute('width', '50%');
				svg.style.width = '50%';
				/* svg.setAttribute('height', 'auto'); */
				svg.style.height = 'auto';
			}
		});
	}

	ngOnDestroy() {
		if (this.scrollSubscription) {
			this.scrollSubscription.unsubscribe();
		}
		if (this.circleSubscription) {
			this.circleSubscription.unsubscribe();
		}
		this.navService.setSectionNavigate(null);
	}

	@HostListener('window:wheel', ['$event'])
	onWheel(e: WheelEvent) {
		if (!this.isTransitioning) {
			if (e.deltaY > 0) {
				if (this.index + 1 <= this.lenght) {
					this.nextIndex = this.index + 1;
				} else {
					return;
				}
			} else if (e.deltaY < 0) {
				if (this.index - 1 >= 0) {
					this.nextIndex = this.index - 1;
				} else {
					return;
				}
			}

			this.handlePostEvent();
		}
	}

	xDown!: number | null;
	yDown!: number | null;
	@HostListener('window:touchstart', ['$event'])
	onTouchStart(e: TouchEvent) {
		const firstTouch = e.touches[0];
		this.xDown = firstTouch.clientX;
		this.yDown = firstTouch.clientY;
	}

	@HostListener('window:touchmove', ['$event'])
	onTouchMove(e: TouchEvent) {
		if (!this.isTransitioning && (this.xDown || this.yDown)) {
			const xUp = e.touches[0].clientX;
			const xDiff = this.xDown! - xUp;
			const yUp = e.touches[0].clientY;
			const yDiff = this.yDown! - yUp;

			if (Math.abs(xDiff) > Math.abs(yDiff)) {
				if (xDiff > 0) {
					if (this.index + 1 <= this.lenght) {
						this.nextIndex = this.index + 1;
					} else {
						return;
					}
				} else {
					if (this.index - 1 >= 0) {
						this.nextIndex = this.index - 1;
					} else {
						return;
					}
				}
			} else {
				if (yDiff > 0) {
					if (this.index + 1 <= this.lenght) {
						this.nextIndex = this.index + 1;
					} else {
						return;
					}
				} else {
					if (this.index - 1 >= 0) {
						this.nextIndex = this.index - 1;
					} else {
						return;
					}
				}
			}

			this.xDown = null;
			this.yDown = null;

			this.handlePostEvent();
		}
	}

	handlePostEvent() {
		this.setProperties(this.nextIndex);

		if (this.nextIndex >= 0 && this.nextIndex < this.lenght) {
			this.circleService.setProperties(this.linksColor, this.nextIndex);
			this.changeSection();
		} else if (
			this.nextIndex == this.lenght &&
			window.innerWidth > MAX_VIEWPORT_MOBILE
		) {
			this.menuService.changeWallColor(PrimaryColor.Dark);
			this.transService.setProperties(
				PrimaryColor.Dark,
				SecondaryColor.Yellow,
				window.innerWidth / 2,
				window.innerHeight / 2,
				'/servicios/nav'
			);
		}
	}

	manualChange(index: number) {
		if (this.index != index) {
			this.setProperties(index);

			this.nextIndex = index;
			this.circleService.setProperties(this.linksColor, index);
			this.changeSection(index);
		}
	}

	setProperties(colorIndex: number) {
		this.animateMainInfo(this.titles[this.index], this.numbers[this.index]);
		this.stayService = false;
		this.scrollService.notifyIsTransitioning();
		this.setColor(colorIndex);
	}

	setColor(i: number) {
		if (i == 0 || i == 2) {
			this.linksColor = PrimaryColor.Light;
		} else {
			this.linksColor = PrimaryColor.Dark;
		}
	}

	changeSection(i: number = this.nextIndex) {
		this.linksService.changeLeftColor(this.linksColor);
		this.linksService.changeRightColor(this.linksColor);
		this.menuService.changeWallColor(this.backgroundColor());
		this.index = i;
		const currentTitle = this.titles[i];
		const currentNumber = this.numbers[i];

		setTimeout(() => {
			this.stayService = true;
		}, 850);

		anime({
			targets: currentTitle,
			translateX: [40, 0],
			opacity: [0, 1],
			easing: 'easeOutExpo',
			duration: 850,
			delay: 850,
		});
		anime({
			targets: currentNumber,
			translateY: [30, 0],
			opacity: [0, 1],
			easing: 'easeOutExpo',
			duration: 850,
			delay: 850,
		});
	}

	animateMainInfo(currentTitle: HTMLElement, currentNumber: HTMLElement) {
		anime({
			targets: currentTitle,
			translateX: [0, -30],
			opacity: [1, 0],
			easing: 'easeInExpo',
			duration: 850,
		});
		anime({
			targets: currentNumber,
			translateY: [0, -30],
			opacity: [1, 0],
			easing: 'easeInExpo',
			duration: 850,
		});
	}

	navigate(index: number) {
		this.setColor(index);
		this.circleService.setProperties(this.linksColor, index);
		this.linksService.changeLeftColor(this.linksColor);
		this.linksService.changeRightColor(this.linksColor);
		this.menuService.changeWallColor(this.backgroundColor());
		this.index = index;
		this.scrollService.notifyIsNotTransitioning();
	}

	goBack(index: number) {
		this.router.navigate(['/servicios/mobile'], { queryParams: { index: index } });
	}

	goBackToParentSection(index: number) {
		this.navService.setPadreSectionNavigate(index);
		this.router.navigate(['/servicios/mobile']);
	  }

	  goBackService(index: number) {
		this.navService.setPadreSectionNavigate(index)
		this.router.navigate(['/servicios/mobile']);
	  }

	isCurrentIndex(i: number) {
		return i == this.index;
	}

	isAnimationCurrentIndex(i: number) {
		return i == this.index && this.stayService;
	}

	backgroundColor() {
		return opositeColor(this.linksColor);
	}

	markers() {
		return Array.from({ length: 4 }, (_, index) => index);
	}

	markerColor() {
		if (this.index == 1 || this.index == 3) {
			return '#B4AFAB';
		} else {
			return '#504B49';
		}
	}

	servicesContent = [
		{
			title: 'Data Comunicación',
			listElements: [
				'Comunicación Institucional',
				'Comunicación Corporativa',
				'Relaciones Públicas',
				'Estrategias de Contenidos y MKT',
			],
			descElements: [
				{
					descBold: 'Análisis',
					desc: 'del estado de tu negocio',
				},
				{
					descBold: 'Control y medición',
					desc: 'de resultado',
				},
			],
			icon: this.comunicacion.icon,
		},
		{
			title: 'Diseño gráfico y audiovisual',
			listElements: [
				'Identidad visual',
				'Identidad corporativa',
				'Marca. Branding',
				'Editorial',
			],
			descElements: [
				{
					descBold: 'Desarrollos creativos',
					desc: 'e innovadores',
				},
				{
					descBold: 'Conversión',
					desc: 'de marca',
				},
			],
			icon: this.disenio.icon,
		},
		{
			title: 'Campañas Publicitarias',
			listElements: [
				'Soluciones integrales on-line',
				'Asesoramiento y planificación para nuevas oportunidades de negocio',
				'Reportes de rendimiento de campañas',
			],
			descElements: [
				{
					descBold: 'Estrategias creativas',
					desc: 'de marketing',
				},
				{
					descBold: 'Posicionamiento',
					desc: 'de marca',
				},
			],
			icon: this.campanias.icon,
		},
		{
			title: 'Producción de Eventos',
			listElements: [
				'Eventos corporativos',
				' Eventos masivos y/o privados',
				'Relaciones Públicas',
			],
			descElements: [
				{
					descBold: 'Visibilización',
					desc: 'de marca',
				},
				{
					descBold: 'Crecimiento',
					desc: 'de tu negocio',
				},
			],
			icon: this.eventos.icon,
		},
	];

	serviceColor(i: number) {
		const colors = [
			SecondaryColor.Yellow,
			SecondaryColor.Orange,
			SecondaryColor.Rose,
			SecondaryColor.Green,
		];
		return colors[i];
	}
}
