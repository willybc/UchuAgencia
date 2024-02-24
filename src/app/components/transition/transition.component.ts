import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { TransitionService } from 'src/app/services/transition.service';
import { ScrollService } from 'src/app/services/scroll.service';
import anime from 'animejs/lib/anime.es.js';

@Component({
  selector: 'app-transition',
  templateUrl: './transition.component.html',
  styleUrls: ['./transition.component.scss'],
})
export class ColorTransitionComponent {
  constructor(
    private transService: TransitionService,
    private scrollService: ScrollService,
    private router: Router,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.transService.setTransition().subscribe((e) => {
      this.colorTransitionAnimation(
        e.color,
        e.particles,
        e.posX,
        e.posY,
        e.page
      );
    });
  }

  colorTransitionAnimation(
    nextColor: string,
    particlesColor: string,
    posX: number,
    posY: number,
    page: string | null
  ) {
    const c = document.getElementById('color_transition') as HTMLCanvasElement;
    const ctx = c.getContext('2d')!;
    const bgColor = 'transparent';
    let cH = window.innerHeight;
    let cW = window.innerWidth;
    let animations: any = [];

    c.style.transition = 'none';
    c.style.opacity = '1';

    resizeCanvas();

    let targetR = Math.sqrt(
      Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2)
    );
    let rippleSize = Math.min(200, cW * 0.4);
    let minCoverDuration = 700;

    const pageFill = new Circle({
      x: posX,
      y: posY,
      r: 0,
      fill: nextColor,
    });
    const fillAnimation = anime({
      targets: pageFill,
      r: targetR,
      duration: Math.max(targetR / 2, minCoverDuration),
      easing: 'easeOutQuart',
      complete: function () {
        removeAnimation(fillAnimation);
        handleCompleted();
      },
    });

    const ripple = new Circle({
      x: posX,
      y: posY,
      r: 0,
      fill: particlesColor,
      stroke: {
        width: 3,
        color: particlesColor,
      },
      opacity: 1,
    });
    const rippleAnimation = anime({
      targets: ripple,
      r: rippleSize,
      opacity: 0,
      easing: 'easeOutExpo',
      duration: 1500,
      complete: removeAnimation,
    });

    const particles = [];
    for (let i = 0; i < 32; i++) {
      let particle = new Circle({
        x: posX,
        y: posY,
        fill: particlesColor,
        r: anime.random(24, 48),
      });
      particles.push(particle);
    }
    const particlesAnimation = anime({
      targets: particles,
      x: function (particle: Circle) {
        return particle.x + anime.random(rippleSize, -rippleSize);
      },
      y: function (particle: Circle) {
        return particle.y + anime.random(rippleSize * 1.15, -rippleSize * 1.15);
      },
      r: 0,
      easing: 'easeOutExpo',
      duration: anime.random(1000, 1300),
      complete: removeAnimation,
    });

    animations.push(fillAnimation, rippleAnimation, particlesAnimation);

    Circle.prototype.draw = function () {
      ctx.globalAlpha = this.opacity || 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
      if (this.stroke) {
        ctx.strokeStyle = this.stroke.color;
        ctx.lineWidth = this.stroke.width;
        ctx.stroke();
      }
      if (this.fill) {
        ctx.fillStyle = this.fill;
        ctx.fill();
      }
      ctx.closePath();
      ctx.globalAlpha = 1;
    };

    anime({
      duration: Infinity,
      update: function () {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, cW, cH);
        animations.forEach(function (anim: any) {
          anim.animatables.forEach(function (animatable: any) {
            animatable.target.draw();
          });
        });
      },
    });

    function removeAnimation(animation: any) {
      let index = animations.indexOf(animation);
      if (index > -1) animations.splice(index, 1);
    }

    const handleCompleted = () => {
      animations = [];
      this.zone.run(() => {
        this.router.navigate([page]);
      });
      if (page == '/servicios') {
        this.scrollService.notifyIsNotTransitioning();
      }
      c.style.transition = 'opacity 0.3s ease';
      c.style.opacity = '0';
    };

    function resizeCanvas() {
      cW = window.innerWidth;
      cH = window.innerHeight;
      c.width = cW * devicePixelRatio;
      c.height = cH * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }
  }
}

interface CircleOptions {
  x: number;
  y: number;
  r: number;
  fill: string;
  stroke?: {
    width: number;
    color: string;
  };
  opacity?: number;
}

class Circle {
  constructor(opts: CircleOptions) {
    // Asignación directa de propiedades en el constructor
    this.x = opts.x;
    this.y = opts.y;
    this.r = opts.r;
    this.fill = opts.fill;

    // Verificamos si stroke está presente antes de asignar
    if (opts.stroke) {
      this.stroke = {
        width: opts.stroke.width,
        color: opts.stroke.color,
      };
    }

    // Verificamos si opacity está presente antes de asignar
    if (opts.opacity !== undefined) {
      this.opacity = opts.opacity;
    }
  }

  x!: number;
  y!: number;
  r!: number;
  fill!: string;
  stroke?: {
    width: number;
    color: string;
  };
  opacity?: number;

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = this.opacity || 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    if (this.stroke) {
      ctx.strokeStyle = this.stroke.color;
      ctx.lineWidth = this.stroke.width;
      ctx.stroke();
    }
    if (this.fill) {
      ctx.fillStyle = this.fill;
      ctx.fill();
    }
    ctx.closePath();
    ctx.globalAlpha = 1;
  }
}
