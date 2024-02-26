import { Component } from '@angular/core';
import { LinksService } from 'src/app/services/links.service';
import { MenuService } from 'src/app/services/menu.service';
import { PrimaryColor, SecondaryColor } from 'src/app/utils/color';
import anime from 'animejs/lib/anime.es.js';

@Component({
	selector: 'app-vision',
	templateUrl: './vision.component.html',
	styleUrls: ['./vision.component.scss'],
})
export class VisionComponent {
	constructor(
		private linksService: LinksService,
		private menuService: MenuService
	) {}

	ngOnInit() {
		this.linksService.changeLeftColor(PrimaryColor.Light);
		this.linksService.changeRightColor(PrimaryColor.Light);
		this.menuService.changeWallColor(SecondaryColor.Blue);
	}

	ngAfterViewInit() {
		if (window.innerWidth > 1023) {
			anime
				.timeline({
					easing: 'easeInOutSine',
				})
				.add({
					targets: '.up',
					translateY: [
						{ value: '-1em', duration: 500 },
						{ value: '-2.5em', duration: 500, delay: 100 },
					],
				})
				.add({
					targets: '.down',
					translateY: '1.2em',
					duration: 500,
				});
		}

		anime({
			targets: '.roller',
			translateY: [
				{ value: '-35%', duration: 1000, delay: 1500 },
				{ value: '-75%', duration: 1000, delay: 1500 },
				{ value: 0, duration: 1000, delay: 1500 },
			],
			duration: 4000,
			easing: 'easeOutElastic(1, .5)',
			loop: true,
		});
	}
}
