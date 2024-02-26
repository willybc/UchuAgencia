import { Component, HostListener } from '@angular/core';
import * as paper from 'paper';
import { MAX_VIEWPORT_MOBILE } from 'src/app/utils/other';

@Component({
	selector: 'app-wave-card',
	templateUrl: './wave-card.component.html',
	styleUrls: ['./wave-card.component.scss'],
})
export class WaveCardComponent {
	isFollowingMouse!: boolean;
	isMouseInside!: boolean;
	onFrameWaveCardAnimation!: any;
	onMouseMoveWaveCardAnimation!: any;

	ngAfterViewInit() {
		if (window.innerWidth > MAX_VIEWPORT_MOBILE) {
			this.isFollowingMouse = true;
			this.isMouseInside = false;
			this.waveCardAnimation();
		}
	}

	ngOnDestroy() {
		// Detener la animación y limpiar recursos
		this.isFollowingMouse = false;

		// Eliminar Paper.js project y limpiar eventos
		if (paper.project) {
			paper.project.clear();
		}

		// Eliminar los eventos de mousemove y onframe
		if (paper.view) {
			paper.view.off('frame', this.onFrameWaveCardAnimation);
			paper.view.off('mousemove', this.onMouseMoveWaveCardAnimation);
		}
	}

	// @HostListener('window:resize', ['$event'])
	// onResize(): void {
	//   paper.project.clear();
	//   this.waveCardAnimation();
	// }

	@HostListener('document:mouseleave', ['$event'])
	onMouseLeave() {
		this.isFollowingMouse = false;
	}

	waveCardAnimation() {
		const canvas = document.getElementById(
			'wave-card-canvas'
		) as HTMLCanvasElement;

		paper.setup(canvas);

		const width = paper.view.size.width;
		const middle = width / 2;
		const height = paper.view.size.height;

		var white = new paper.Path.Rectangle({
			point: [0, 0],
			size: [middle, height],
			fillColor: '#FFFAF3',
		});

		var black = new paper.Path.Rectangle({
			point: [middle, 0],
			size: [width, height],
			fillColor: '#050000',
		});

		var path = new paper.Path({
			fillColor: '#FFFAF3',
			strokeColor: '#FFFAF3',
			strokeWidth: 2,
		});

		path.add([middle, 0]);
		const point = new paper.Point(middle + 1, height / 2);
		path.add(point);
		path.add([middle, height]);
		path.smooth({ type: 'continuous' });

		const targetPos = new paper.Point(middle, height / 2);
		const speed = 10;

		// ------- ONFRAME -------

		this.onFrameWaveCardAnimation = () => {
			if (!this.isFollowingMouse) {
				const distance = targetPos.subtract(path.segments[1].point);
				if (distance.length > 1) {
					path.segments[1].point.x += distance.x / speed;
				} else {
					this.isFollowingMouse = true;
				}
				reanimate();
			}
		};

		// ------- MOUSEMOVE -------

		this.onMouseMoveWaveCardAnimation = (event: any) => {
			const mousePos = event.point;
			var isLeft;
			if (!this.isMouseInside && mousePos.x < width && mousePos.x > 0) {
				this.isMouseInside = true;
				isLeft = mousePos.x < middle;
			}

			const isWaveInside =
				path.segments[1].point.x < width &&
				path.segments[1].point.x > 0;

			if (this.isFollowingMouse && this.isMouseInside) {
				this.isMouseInside = true;

				if (isWaveInside) {
					if (isLeft) {
						path.segments[1].point.x -=
							(mousePos.x - path.segments[1].point.x) / 10;
					} else {
						path.segments[1].point.x +=
							(mousePos.x - path.segments[1].point.x) / 10;
					}
				} else {
					this.isFollowingMouse = false;
					this.isMouseInside = false;
				}
				reanimate();
			}
		};

		// ------- REANIMATE -------

		function reanimate() {
			white.bounds.size = new paper.Size(middle, height);
			const union = white.unite(path);
			const intersection = white.intersect(path);
			paper.project.activeLayer.removeChildren();
			paper.project.activeLayer.addChild(black);
			if (intersection) {
				const result = union.subtract(intersection);
				paper.project.activeLayer.addChild(result);
			}
		}

		// ------- MOUSELEAVE -------

		canvas.addEventListener('mouseleave', () => {
			this.isFollowingMouse = false;
		});

		paper.view.onMouseMove = this.onMouseMoveWaveCardAnimation;
		paper.view.onFrame = this.onFrameWaveCardAnimation;
	}
}
