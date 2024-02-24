import { Component, OnDestroy } from '@angular/core';
import { TransitionService } from 'src/app/services/transition.service';
import { PrimaryColor, SecondaryColor } from 'src/app/utils/color';
import gsap from 'gsap';
import { MAX_VIEWPORT_MOBILE } from 'src/app/utils/other';

@Component({
  selector: 'app-hover-letter',
  templateUrl: './hover-letter.component.html',
  styleUrls: ['./hover-letter.component.scss'],
})
export class HoverLetterComponent implements OnDestroy {
  shadeColor!: string;
  light = PrimaryColor.Light;
  blue = SecondaryColor.Blue;
  dark = PrimaryColor.Dark;
  yellow = SecondaryColor.Yellow;

  constructor(private transService: TransitionService) {}

  ngAfterViewInit() {
    if (window.innerWidth > MAX_VIEWPORT_MOBILE) {
      this.hoverLetterAnimation();
    }
  }

  ngOnDestroy() {
    document.body.removeEventListener('mousemove', this.handleMouseMove);
  }

  hoverLetterAnimation() {
    document.body.addEventListener('mousemove', this.handleMouseMove);
  }

  handleMouseMove = (evt: MouseEvent) => {
    const mouseX = evt.clientX;
    const mouseY = evt.clientY;

    gsap.to('.shape', {
      x: mouseX,
      y: mouseY,
      stagger: -0.07,
    });

    var windowWidth = window.innerWidth;
    if (mouseX > windowWidth / 2) {
      this.shadeColor = 'var(--yellow)';
    } else {
      this.shadeColor = 'var(--blue)';
    }
  };

  changePage(
    which: string | null,
    color: PrimaryColor,
    particles: SecondaryColor,
    event: MouseEvent
  ) {
    if (which == null) {
      if (window.innerWidth > MAX_VIEWPORT_MOBILE) {
        which = '/servicios';
      } else {
        which = '/servicios/mobile';
      }
    }

    this.transService.setProperties(
      color,
      particles,
      event.clientX,
      event.clientY,
      which
    );
  }
}
