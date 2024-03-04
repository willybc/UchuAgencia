import { Component, HostListener, ElementRef } from '@angular/core';
import { LinksService } from 'src/app/services/links.service';
import { PrimaryColor, SecondaryColor } from 'src/app/utils/color';
import anime from 'animejs/lib/anime.es.js';
import { NavigationService } from 'src/app/services/navigation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ColorService } from 'src/app/services/color.service';

@Component({
	selector: 'app-servicios-mobile',
	templateUrl: './servicios-mobile.component.html',
	styleUrls: ['./servicios-mobile.component.scss'],
})
export class ServiciosMobileComponent {
	index!: number;
	lenght = 4;
	nextIndex!: number;
	translate!: number;
	linksColor: PrimaryColor = PrimaryColor.Light;
	logoColor = '#FFFAF3';

	constructor(
		private route: ActivatedRoute,
		private linksService: LinksService,
		private navService: NavigationService,
		private router: Router,
		private elementRef: ElementRef,
		private colorService: ColorService
	) {}

	ngOnInit() {
		this.index = 0;
		this.translate = 0;

		const color = this.colorService.getColor(this.index);
		if (color) {
			this.linksColor = color;
		}

		this.linksService.changeLeftColor(PrimaryColor.Light);
		this.linksService.changeRightColor(PrimaryColor.Light);

		this.linksService.leftColor$.subscribe(color => {
			this.logoColor = color;
		});

		this.navService.changePadreSectionNavigate.subscribe(index => {
			if (index != null) {
				console.log('volvio al PADRE', index + 1);
				this.navigate(index + 1);
			}
		});
	}

	ngAfterViewInit() {

		this.linksService.leftColor$.subscribe(color => {
			if(this.index === 0 || this.index === 2 || this.index === 4){
				this.linksColor = PrimaryColor.Light;
			}else{
				this.linksColor = PrimaryColor.Dark;
			}
		});

		this.linksService.changeLeftColor(this.linksColor);
		this.linksService.changeRightColor(this.linksColor);
		console.log('color', this.linksColor);
	}

	navigate(index: number) {
		this.index = index;

		setTimeout(() => {
			const sectionId = `section-${this.index}`;
			const targetSection = document.getElementById(sectionId);
			if (targetSection) {
				targetSection.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				});
			}
		}, 100);

		this.setColor(this.index);
	}

	yDown!: number | null;
	@HostListener('window:touchstart', ['$event'])
	onTouchStart(e: TouchEvent) {
		const firstTouch = e.touches[0];
		this.yDown = firstTouch.clientY;
	}

	@HostListener('window:touchmove', ['$event'])
	onTouchMove(e: TouchEvent) {
		if (this.yDown) {
			const yUp = e.touches[0].clientY;
			const yDiff = this.yDown! - yUp;

			if (yDiff > 0) {
				if (this.index + 1 < this.lenght) {
					this.nextIndex = this.index + 1;
				} else {
					return;
				}
				this.translate -= 100;
			} else if (yDiff < 0) {
				if (this.index - 1 >= 0) {
					this.nextIndex = this.index - 1;
				} else {
					return;
				}
				this.translate += 100;
			}

			this.yDown = null;

			anime({
				targets: '#service-mobile',
				translateY: this.translate + 'vh',
				duration: 1000,
				easing: 'easeInOutSine',
			});

			this.index = this.nextIndex;
			this.setColor(this.index);
		}
	}

	isEven(i: number) {
		return i == 0 || i == 2 || i == 4;
	}

	setColor(i: number) {
		if (this.isEven(i)) {
			this.linksColor = PrimaryColor.Light;
			this.logoColor = '#030202';
		} else {
			this.linksColor = PrimaryColor.Dark;
			this.logoColor = '#FFFAF3';
		}

		this.linksService.changeLeftColor(this.linksColor);
		this.linksService.changeRightColor(this.linksColor);
	}

	serviceColor(i: number) {
		const colors = [
			SecondaryColor.Yellow,
			SecondaryColor.Orange,
			SecondaryColor.Rose,
			SecondaryColor.Green,
		];
		return colors[i];
	}

	goToService(i: number) {
		// const services = [
		//   this.comunicacion,
		//   this.disenio,
		//   this.campanias,
		//   this.eventos,
		// ];

		// this.transService.setProperties(
		//   opositeColor(services[i].primary),
		//   services[i].secondary,
		//   window.innerWidth / 2,
		//   window.innerHeight / 2,
		//   'servicios'
		// );

		this.navService.setSectionNavigate(i);
		this.router.navigate(['/servicios']);
	}

	servicesContent = [
		{
			title: 'Data Comunicación',
			backgroundIcons: `
      <path
        d="M225.874 612.756C224.553 609.961 222.902 607.208 220.388 605.476C218.105 603.901 215.319 603.305 212.591 602.894C201.777 601.262 190.691 601.986 179.935 604.086C173.502 605.349 167.111 607.122 161.266 610.188C158.236 611.777 155.264 613.82 153.497 616.814C152.406 618.688 151.832 620.83 151.473 622.987C149.907 632.495 152.363 642.357 156.872 650.772C159.127 654.972 161.985 658.988 165.977 661.457C170.73 664.395 176.56 664.849 182.118 664.523C188.451 664.154 194.741 662.876 200.758 660.734C201.418 660.507 202.093 660.251 202.783 660.336C203.386 660.407 203.931 660.734 204.448 661.06C208.771 663.756 212.907 666.736 216.841 670L216.87 669.191C217.2 664.707 217.918 659.925 218.651 656.221C218.809 655.398 218.981 654.561 219.34 653.809C219.943 652.546 221.035 651.623 222.026 650.644C226.793 645.919 229.464 639.193 229.924 632.41C230.383 625.627 228.732 618.815 225.86 612.713L225.874 612.756ZM193.577 651.992C180.452 659.357 165.173 651.425 163.421 636.78C163.119 634.198 167.212 634.226 167.513 636.78C168.906 648.459 181.299 654.234 191.51 648.502C193.807 647.21 195.861 650.715 193.577 651.992ZM218.55 621.128C216.913 617.723 214.156 615.055 210.566 613.721C208.11 612.813 209.187 608.91 211.657 609.819C216.224 611.507 219.972 614.7 222.083 619.085C223.217 621.426 219.685 623.47 218.55 621.128Z"
        fill="#FFF9F3"
      />
      <path
        d="M116.347 18.0509C113.348 12.7025 109.719 7.50099 104.56 4.43879C99.8614 1.64926 94.3242 0.873222 88.9339 0.453743C67.5195 -1.2032 45.9374 1.79607 25.1941 7.52196C12.7985 10.9407 0.549782 15.3872 -10.4406 22.2876C-16.1455 25.8742 -21.6616 30.3416 -24.6609 36.5289C-26.5276 40.3881 -27.3456 44.7297 -27.7231 49.0294C-29.422 68.0947 -23.1508 87.2859 -13.1043 103.289C-8.09149 111.28 -1.88319 118.81 6.27567 123.13C16.0076 128.269 27.5013 128.311 38.3238 126.864C50.6775 125.207 62.8004 121.788 74.2522 116.691C75.5106 116.125 76.811 115.538 78.1533 115.622C79.3488 115.685 80.4605 116.251 81.5092 116.817C90.3602 121.515 98.8966 126.843 107.076 132.757L107.034 131.163C107.034 122.228 107.748 112.664 108.628 105.219C108.817 103.562 109.027 101.884 109.614 100.353C110.621 97.7728 112.613 95.7803 114.396 93.7039C123.038 83.6574 127.295 69.9404 127.19 56.4332C127.086 42.926 122.891 29.6704 116.368 18.0299L116.347 18.0509ZM63.6184 103.541C50.3419 109.434 34.0032 115.706 20.8316 106.183C7.91161 96.85 -0.834517 76.5262 -4.69372 61.6137C-5.65852 57.8804 0.10931 56.3073 1.07411 60.0197C4.11533 71.7651 10.1768 83.5944 17.1192 93.578C28.4032 109.791 45.2033 105.219 60.5982 98.402C64.0798 96.85 67.1211 102.01 63.6184 103.562V103.541Z"
        fill="#FFF9F3"
      />
      <path
        d="M101.573 800.042C97.9868 801.468 96.4557 795.679 99.9794 794.274C110.991 789.891 119.108 780.62 122.338 769.273C122.988 766.966 125.505 766.714 127.015 767.763C126.973 754.801 123.596 741.923 118.164 730.262C115.332 724.2 111.788 718.265 106.439 714.51C101.552 711.091 95.5958 709.812 89.765 708.931C66.6098 705.408 42.9093 706.96 19.8799 711.532C6.12101 714.259 -7.55402 718.097 -20.0545 724.746C-26.5354 728.185 -32.8905 732.59 -36.6658 739.113C-39.0149 743.161 -40.2314 747.817 -40.9865 752.473C-44.3423 773.069 -39.0778 794.421 -29.4298 812.647C-24.6058 821.729 -18.4814 830.433 -9.94503 835.782C0.227329 842.158 12.7068 843.122 24.599 842.409C38.1482 841.612 51.6135 838.844 64.4705 834.208C65.8757 833.705 67.3439 833.16 68.8121 833.349C70.1125 833.516 71.2661 834.229 72.3777 834.922C81.6272 840.752 90.4992 847.212 98.8887 854.281L98.9726 852.54C99.6857 842.829 101.217 832.489 102.769 824.456C103.104 822.673 103.461 820.869 104.237 819.233C105.537 816.506 107.866 814.514 109.963 812.396C119.653 802.685 125.232 789.073 126.616 775.146C122.086 786.577 113.151 795.428 101.552 800.042H101.573ZM6.56145 742.825C-19.8657 744.86 -16.5728 776.404 -8.79149 793.309C-7.19747 796.791 -12.3361 799.811 -13.9511 796.33C-19.8238 783.556 -24.1025 768.644 -18.2507 755.053C-13.7833 744.65 -4.74351 737.707 6.56145 736.847C10.3997 736.554 10.3787 742.531 6.56145 742.825ZM19.9848 791.862C13.5458 791.862 8.32325 786.64 8.32325 780.201C8.32325 773.762 13.5458 768.539 19.9848 768.539C26.4238 768.539 31.6463 773.762 31.6463 780.201C31.6463 786.64 26.4238 791.862 19.9848 791.862ZM58.6817 781.774C52.2427 781.774 47.0202 776.551 47.0202 770.112C47.0202 763.673 52.2427 758.451 58.6817 758.451C65.1207 758.451 70.3432 763.673 70.3432 770.112C70.3432 776.551 65.1207 781.774 58.6817 781.774ZM85.7171 760.024C85.7171 753.585 90.9396 748.362 97.3786 748.362C103.818 748.362 109.04 753.585 109.04 760.024C109.04 766.463 103.818 771.685 97.3786 771.685C90.9396 771.685 85.7171 766.463 85.7171 760.024Z"
        fill="#FFF9F3"
      />
      <path
        d="M457.573 152.042C453.987 153.468 452.456 147.679 455.979 146.274C466.991 141.891 475.108 132.62 478.338 121.273C478.988 118.966 481.505 118.714 483.015 119.763C482.973 106.801 479.596 93.9232 474.164 82.2616C471.332 76.2002 467.788 70.2646 462.439 66.5102C457.552 63.0915 451.596 61.8121 445.765 60.9312C422.61 57.4075 398.909 58.9596 375.88 63.5319C362.121 66.2586 348.446 70.0968 335.946 76.7455C329.465 80.1853 323.109 84.5898 319.334 91.1127C316.985 95.1606 315.769 99.8169 315.014 104.473C311.658 125.069 316.922 146.421 326.57 164.647C331.394 173.729 337.519 182.433 346.055 187.782C356.227 194.158 368.707 195.122 380.599 194.409C394.148 193.612 407.613 190.844 420.47 186.208C421.876 185.705 423.344 185.16 424.812 185.349C426.112 185.516 427.266 186.229 428.378 186.922C437.627 192.752 446.499 199.212 454.889 206.281L454.973 204.54C455.686 194.829 457.217 184.489 458.769 176.456C459.104 174.673 459.461 172.869 460.237 171.233C461.537 168.506 463.866 166.514 465.963 164.396C475.653 154.685 481.232 141.073 482.616 127.146C478.086 138.577 469.151 147.428 457.552 152.042H457.573ZM362.561 94.8251C336.134 96.8595 339.427 128.404 347.209 145.309C348.803 148.791 343.664 151.811 342.049 148.33C336.176 135.556 331.898 120.644 337.749 107.053C342.217 96.6498 351.256 89.7074 362.561 88.8475C366.4 88.5538 366.379 94.5314 362.561 94.8251ZM375.985 143.862C369.546 143.862 364.323 138.64 364.323 132.201C364.323 125.762 369.546 120.539 375.985 120.539C382.424 120.539 387.646 125.762 387.646 132.201C387.646 138.64 382.424 143.862 375.985 143.862ZM414.682 133.774C408.243 133.774 403.02 128.551 403.02 122.112C403.02 115.673 408.243 110.451 414.682 110.451C421.121 110.451 426.343 115.673 426.343 122.112C426.343 128.551 421.121 133.774 414.682 133.774ZM441.717 112.024C441.717 105.585 446.94 100.362 453.379 100.362C459.818 100.362 465.04 105.585 465.04 112.024C465.04 118.463 459.818 123.685 453.379 123.685C446.94 123.685 441.717 118.463 441.717 112.024Z"
        fill="#FFF9F3"
      />
      <path
        d="M494.559 655.322C490.972 656.748 489.441 650.96 492.965 649.554C503.976 645.171 512.093 635.9 515.323 624.553C515.973 622.246 518.49 621.995 520 623.043C519.958 610.081 516.581 597.203 511.149 585.542C508.318 579.48 504.773 573.545 499.425 569.791C494.538 566.372 488.581 565.092 482.75 564.211C459.595 560.688 435.895 562.24 412.865 566.812C399.106 569.539 385.431 573.377 372.931 580.026C366.45 583.466 360.095 587.87 356.32 594.393C353.97 598.441 352.754 603.097 351.999 607.753C348.643 628.35 353.908 649.701 363.556 667.928C368.38 677.009 374.504 685.713 383.04 691.062C393.213 697.438 405.692 698.403 417.584 697.69C431.134 696.893 444.599 694.124 457.456 689.489C458.861 688.985 460.329 688.44 461.797 688.629C463.098 688.797 464.251 689.51 465.363 690.202C474.613 696.033 483.485 702.493 491.874 709.561L491.958 707.82C492.671 698.109 494.202 687.769 495.754 679.736C496.09 677.953 496.446 676.149 497.222 674.513C498.523 671.787 500.851 669.794 502.948 667.676C512.638 657.965 518.217 644.353 519.602 630.426C515.071 641.857 506.136 650.708 494.538 655.322H494.559ZM399.547 598.105C373.12 600.14 376.413 631.685 384.194 648.59C385.788 652.071 380.649 655.091 379.034 651.61C373.162 638.837 368.883 623.924 374.735 610.333C379.202 599.93 388.242 592.988 399.547 592.128C403.385 591.834 403.364 597.812 399.547 598.105ZM412.97 647.142C406.531 647.142 401.309 641.92 401.309 635.481C401.309 629.042 406.531 623.819 412.97 623.819C419.409 623.819 424.632 629.042 424.632 635.481C424.632 641.92 419.409 647.142 412.97 647.142ZM451.667 637.054C445.228 637.054 440.006 631.831 440.006 625.392C440.006 618.953 445.228 613.731 451.667 613.731C458.106 613.731 463.329 618.953 463.329 625.392C463.329 631.831 458.106 637.054 451.667 637.054ZM478.702 615.304C478.702 608.865 483.925 603.642 490.364 603.642C496.803 603.642 502.025 608.865 502.025 615.304C502.025 621.743 496.803 626.965 490.364 626.965C483.925 626.965 478.702 621.743 478.702 615.304Z"
        fill="#FFF9F3"
      />
      <path
        d="M240.489 129.859C239.059 126.77 237.247 123.751 234.528 121.832C232.036 120.086 229.003 119.441 226.04 118.987C214.259 117.189 202.198 117.975 190.486 120.313C183.48 121.709 176.526 123.664 170.164 127.032C166.87 128.795 163.628 131.029 161.711 134.344C160.509 136.404 159.899 138.777 159.515 141.151C157.807 151.639 160.491 162.529 165.406 171.796C167.864 176.421 170.983 180.854 175.323 183.576C180.499 186.822 186.843 187.311 192.891 186.944C199.793 186.525 206.642 185.129 213.178 182.773C213.893 182.511 214.642 182.25 215.391 182.337C216.054 182.424 216.646 182.773 217.204 183.14C221.91 186.107 226.424 189.405 230.694 193L230.729 192.11C231.095 187.171 231.879 181.901 232.663 177.799C232.837 176.892 233.012 175.967 233.413 175.147C234.075 173.751 235.26 172.738 236.323 171.656C241.517 166.456 244.427 159.021 244.915 151.535C245.421 144.048 243.626 136.543 240.489 129.807V129.859ZM189.44 154.135C188.098 154.135 187.018 153.053 187.018 151.709C187.018 150.365 188.098 149.283 189.44 149.283C190.782 149.283 191.863 150.365 191.863 151.709C191.863 153.053 190.782 154.135 189.44 154.135ZM207.148 149.475C205.806 149.475 204.725 148.393 204.725 147.049C204.725 145.706 205.806 144.624 207.148 144.624C208.49 144.624 209.57 145.706 209.57 147.049C209.57 148.393 208.49 149.475 207.148 149.475ZM223.043 145.723C221.701 145.723 220.62 144.641 220.62 143.297C220.62 141.953 221.701 140.871 223.043 140.871C224.385 140.871 225.465 141.953 225.465 143.297C225.465 144.641 224.385 145.723 223.043 145.723Z"
        fill="#FFF9F3"
      />`,
		},
		{
			title: 'Diseño gráfico y audiovisual',
			backgroundIcons: `
      <path
        d="M403.557 0.40638C377.795 -2.7087 353.483 12.0983 347.784 44.3706C342.084 76.6429 369.339 89.7263 369.339 89.7263L367.038 108.853L385.049 111.2C387.246 96.0395 389.443 80.8794 391.619 65.6986C391.702 65.2002 391.909 64.7433 392.158 64.3279C390.396 63.8088 388.8 62.9158 387.598 61.4621C384.862 58.1808 385.153 52.9683 387.785 49.5832C390.396 46.1981 394.873 44.5991 399.122 44.8275C402.231 44.9936 405.381 46.0943 407.516 48.3579C408.884 49.7909 409.754 51.7222 409.899 53.6743C410.625 55.6265 410.252 58.0978 408.967 59.8214C407.163 62.272 404.137 63.518 401.194 64.2241C400.946 64.2864 400.676 64.3279 400.427 64.3695C401.07 65.4909 401.277 66.8823 401.07 68.2945L394.686 112.425L414.459 115L416.987 94.0874C416.987 94.0874 446.128 95.3542 451.289 57.454C456.802 17.0409 429.257 3.45917 403.516 0.344081L403.557 0.40638Z"
        fill="#050000"
      />
      <g clip-path="url(#clip0_415_390)">
        <path
          d="M79.9726 41.5191L89.7782 51.2697C90.6372 52.125 91.9419 52.3106 93.0278 51.77C96.399 50.0917 100.609 50.6525 103.421 53.4563C106.233 56.26 106.796 60.4395 105.119 63.7959C104.576 64.8771 104.766 66.1761 105.625 67.0313L120.524 81.849C122.558 83.8741 125.966 81.8691 125.167 79.1178L113.534 39.0219C113.247 38.0255 112.42 37.2711 111.395 37.0694L87.031 32.305C86.1194 32.1275 85.1793 32.4099 84.527 33.0634L79.9726 37.5978C78.8867 38.679 78.8867 40.4379 79.9726 41.5191Z"
          fill="#030202"
        />
        <path
          d="M67.6148 18.8955L54.8994 31.5554C53.7015 32.748 53.7015 34.6817 54.8994 35.8743L63.1652 44.104C64.3631 45.2967 66.3052 45.2967 67.503 44.104L80.2184 31.4442C81.4163 30.2515 81.4163 28.3179 80.2184 27.1253L71.9526 18.8955C70.7547 17.7029 68.8126 17.7029 67.6148 18.8955Z"
          fill="#030202"
        />
        <path
          d="M161.274 59.0036C158.977 56.7162 155.253 56.7162 152.952 59.0036C150.735 61.2103 150.658 64.7362 152.717 67.0398L132.806 86.8638L131.136 85.2017C130.01 84.0802 128.186 84.0802 127.06 85.2017L121.497 90.7407C120.37 91.8622 120.37 93.6776 121.497 94.7991L123.166 96.4612L102.773 116.765C100.463 114.716 96.918 114.793 94.7016 116.999C92.4042 119.287 92.4042 122.994 94.7016 125.281C96.999 127.569 100.723 127.569 103.02 125.281C104.888 123.422 105.237 120.626 104.074 118.415L124.645 97.9336L125.573 98.8575C126.699 99.979 128.523 99.979 129.649 98.8575L135.212 93.3185C136.339 92.197 136.339 90.3816 135.212 89.2601L134.285 88.3363L154.378 68.3307C156.598 69.4925 159.406 69.1416 161.27 67.2818C163.568 64.9944 163.568 61.283 161.27 58.9956L161.274 59.0036Z"
          fill="#030202"
        />
        <path
          d="M117.716 83.6207L103.036 68.9887C102.237 68.1939 101.05 67.9115 99.9846 68.2787C96.8322 69.3558 93.1976 68.6417 90.6855 66.1405C88.1652 63.6313 87.4521 60.0126 88.538 56.8699C88.9067 55.8049 88.6271 54.6269 87.8289 53.8282L77.8572 43.8879C76.6983 42.7301 74.8142 42.7301 73.6554 43.8879L69.3077 48.2166C68.6067 48.9145 68.3028 49.911 68.4932 50.8792L73.238 74.927C73.4528 76.0162 74.2591 76.8917 75.3288 77.1983L114.794 88.5505C117.744 89.3977 119.892 85.779 117.72 83.6167L117.716 83.6207Z"
          fill="#030202"
        />
      </g>
      <path
        d="M206.355 554.14L210.165 545.68L202.225 542.02C199.055 548.64 195.885 555.27 192.715 561.89C192.595 562.14 192.415 562.35 192.205 562.52C192.945 563.01 193.555 563.66 193.905 564.49C194.695 566.39 193.805 568.75 192.115 569.92C190.425 571.09 188.135 571.19 186.205 570.48C184.795 569.96 183.505 569 182.845 567.65C182.425 566.8 182.305 565.78 182.505 564.86C182.455 563.86 182.975 562.78 183.815 562.17C184.995 561.3 186.565 561.17 188.025 561.26C188.145 561.26 188.265 561.29 188.385 561.3C188.245 560.72 188.325 560.07 188.605 559.49C191.705 553 194.815 546.52 197.915 540.03L189.185 536L185.025 545.25C185.025 545.25 171.785 540.48 163.965 557.15C155.625 574.93 166.365 585.13 177.775 590.27C189.185 595.41 202.515 592.09 209.765 578.08C217.015 564.07 206.345 554.13 206.345 554.13L206.355 554.14Z"
        fill="#050000"
      />
      <path
        d="M18.931 649.713C-2.20102 659.426 -9.31817 674.011 -15.7142 696.391C-22.1416 718.772 -14.8677 745.459 4.25771 758.692C11.8452 763.941 20.8121 766.896 29.8732 768.562C40.1256 770.416 50.7543 770.636 60.8814 768.279C80.1008 763.784 96.812 749.608 104.368 731.314C111.924 713.051 110.137 691.142 99.7278 674.357C91.4193 660.966 77.9374 650.971 62.7939 646.633C46.5217 641.981 30.7511 643.427 15.8583 651.505"
        fill="#050000"
      />
      <path
        d="M380.178 690.632C374.354 693.407 372.393 697.575 370.63 703.969C368.859 710.363 370.863 717.988 376.134 721.769C378.225 723.269 380.696 724.113 383.193 724.589C386.019 725.119 388.948 725.182 391.739 724.508C397.036 723.224 401.641 719.174 403.723 713.947C405.806 708.729 405.313 702.469 402.445 697.673C400.155 693.848 396.439 690.992 392.266 689.752C387.782 688.423 383.435 688.836 379.331 691.144"
        fill="#050000"
      />
      <path
        d="M504.426 599.978C500.771 592.397 492.034 586.23 485.984 580.587C480.103 575.097 473.117 566.439 465.7 563.179C464.242 561.903 462.23 561.119 460.111 560.949C457.931 555.306 455.075 549.616 449.808 546.371C442.837 542.081 433.547 544.464 426.361 547.017C418.883 549.677 411.912 553.522 404.603 556.597C398.353 559.242 390.691 562.149 383.812 560.442C375.904 558.474 374.399 549.954 373.493 542.973C373.432 542.45 373.278 541.942 373.063 541.481L381.155 538.175L372.142 516L350 525.027L359.013 547.202L366.353 544.203C367.259 551.031 368.641 558.458 373.969 563.271C380.004 568.715 388.511 568.9 396.034 567.131C403.758 565.317 410.944 561.703 418.084 558.351C425.009 555.106 432.595 551.538 440.38 551.323C447.474 551.123 450.806 557.12 453.094 562.995C451.988 563.902 451.052 565.117 450.407 566.685C446.783 575.466 443.359 584.324 440.226 593.289C437.77 600.286 433.178 609.128 433.393 616.648C433.9 635.378 463.244 625.798 473.393 623.583C484.357 621.2 513.055 617.94 504.395 599.948L504.426 599.978ZM470.23 606.406C465.885 607.375 461.524 608.252 457.132 609.005C455.827 609.236 454.522 609.436 453.217 609.651C453.462 608.913 453.693 608.159 453.938 607.421C455.274 603.361 456.656 599.317 458.1 595.288C459.651 590.967 461.263 586.661 462.937 582.386C466.806 585.738 470.46 590.029 473.624 592.981C476.464 595.626 479.29 598.317 482.069 601.024C482.637 601.578 483.405 602.208 484.203 602.885C483.389 603.115 482.576 603.361 481.762 603.577C477.938 604.592 474.1 605.545 470.23 606.406ZM490.038 601.255C490.837 600.393 491.988 600.624 490.038 601.255V601.255Z"
        fill="#050000"
      />
      <defs>
        <clipPath id="clip0_415_390">
          <rect
            width="109"
            height="109"
            fill="white"
            transform="translate(54 18)"
          />
        </clipPath>
      </defs>
      `,
		},
		{
			title: 'Campañas Publicitarias',
			backgroundIcons: `
      <path
        d="M408.715 644.247C418.963 627.395 425.524 611.226 426.803 601.142C426.905 600.33 426.265 599.618 425.446 599.618C387.42 599.543 352.007 589.201 342.189 586.081C341.591 585.889 340.939 586.137 340.615 586.673L326.222 610.349C325.9 610.881 325.972 611.557 326.404 612.004C330.543 616.292 340.701 627.213 351.986 642.056C352.324 642.501 352.357 643.109 352.067 643.589L351.691 644.207C350.379 646.365 347.387 646.949 345.019 645.509L313.12 626.118C310.753 624.678 309.895 621.755 311.207 619.597L319.365 606.177C319.755 605.535 320.592 605.329 321.237 605.722C321.879 606.112 322.72 605.909 323.109 605.267L334.7 586.199C335.089 585.558 334.887 584.717 334.245 584.327L321.102 576.336C320.44 575.935 319.55 576.162 318.54 576.821C318.094 577.11 317.524 577.133 317.068 576.857L313.245 574.536C310.219 572.697 299.855 589.751 302.884 591.579L306.707 593.901C307.163 594.177 307.406 594.692 307.351 595.227C307.228 596.434 307.436 597.333 308.098 597.734L314.137 601.405C314.779 601.795 314.985 602.632 314.592 603.277L306.434 616.697C303.662 621.254 305.481 627.433 310.477 630.472L342.376 649.863C346.662 652.467 351.908 651.929 355.065 648.857C355.667 648.268 356.645 648.33 357.136 649.012C363.825 658.267 370.638 668.698 376.632 679.805C377.015 680.516 377.929 680.746 378.592 680.292C386.975 674.576 398.388 661.235 408.716 644.253L408.715 644.247Z"
        fill="#FFF9F3"
      />
      <path
        d="M437.801 599.264C436.583 598.521 434.985 598.506 433.095 599.131C432.533 599.317 432.15 599.85 432.165 600.444C432.386 609.904 425.478 628.193 413.828 647.354C401.736 667.239 388.138 682.148 379.68 685.646C379.712 685.715 379.754 685.792 379.786 685.861C380.021 688.237 380.792 689.938 382.162 690.772C388.754 694.783 406.562 677.543 421.923 652.275C437.284 627.013 444.393 603.274 437.801 599.264Z"
        fill="#FFF9F3"
      />
      <path
        d="M158.14 76.1559C146.694 58.9942 134.27 45.6275 125.281 39.9569C124.557 39.5013 123.6 39.7933 123.238 40.5695C106.402 76.5721 80.9902 105.559 73.7059 113.484C73.2601 113.967 73.2079 114.694 73.572 115.238L89.6555 139.345C90.0175 139.885 90.6899 140.116 91.3039 139.904C97.1904 137.877 112.016 133.079 131.052 128.947C131.623 128.824 132.214 129.062 132.541 129.549L132.96 130.178C134.427 132.375 133.661 135.469 131.252 137.076L98.8176 158.733C96.4094 160.34 93.2621 159.86 91.7958 157.663L82.6796 143.998C82.2436 143.345 82.4179 142.461 83.0744 142.023C83.7267 141.587 83.9052 140.701 83.4693 140.048L70.5156 120.634C70.0796 119.981 69.1938 119.801 68.5416 120.237L55.1764 129.159C54.5045 129.609 54.3265 130.553 54.5063 131.801C54.5832 132.352 54.3539 132.903 53.8914 133.213L50.0064 135.809C46.9306 137.864 58.5168 155.225 61.5842 153.163L65.4692 150.567C65.9317 150.257 66.5271 150.254 67.0095 150.542C68.0986 151.193 69.0417 151.393 69.7136 150.943L75.8542 146.843C76.5064 146.407 77.3902 146.582 77.8282 147.239L86.9444 160.904C90.0393 165.546 96.6945 166.554 101.777 163.163L134.212 141.506C138.568 138.596 140.371 133.387 138.852 129.036C138.561 128.205 139.05 127.306 139.913 127.142C151.63 124.896 164.516 123.051 177.68 122.281C178.523 122.232 179.143 121.467 179.006 120.639C177.287 110.167 169.681 93.4531 158.147 76.1582L158.14 76.1559Z"
        fill="#FFF9F3"
      />
      <path
        d="M128.351 28.7051C127.11 29.5312 126.391 31.0386 126.15 33.106C126.078 33.7211 126.415 34.3199 126.984 34.5675C136.043 38.5409 150.323 53.1732 163.339 72.6852C176.845 92.9355 184.973 112.413 184.558 121.976C184.637 121.976 184.729 121.97 184.808 121.97C187.162 122.798 189.115 122.819 190.508 121.89C197.214 117.416 188.734 92.9179 171.569 67.1894C154.41 41.4633 135.056 24.2309 128.351 28.7051Z"
        fill="#FFF9F3"
      />
      <path
        d="M143.748 728.004C149.227 715.902 154.931 703.27 154.999 689.7C155.051 678.693 151.303 666.991 142.705 659.78C123.82 643.934 96.3627 654.237 78.2617 666.035C68.1902 672.594 59.0665 680.743 51.5279 690.152C45.3507 697.858 33.513 711.333 40.526 721.645C46.9445 731.088 60.2468 726.501 68.0351 721.827C78.0635 715.815 86.1793 707.267 93.063 697.867C99.9468 688.467 105.452 678.189 110.544 667.764C115.928 656.731 121.192 643.647 117.669 631.206C114.447 619.826 104.16 612.328 92.8649 610.495C79.2094 608.28 65.7693 613.336 53.4406 618.74C41.2583 624.074 29.3346 630.868 19.0391 639.381C14.5935 643.056 10.4236 647.409 7.62362 652.509C5.2716 656.792 2.17003 664.558 4.73743 669.31C10.5787 680.083 25.8281 674.054 33.3838 669.267C42.7919 663.307 50.2701 654.541 55.5427 644.733C66.9324 623.535 71.2832 594.206 58.3514 572.721C52.5273 563.052 43.3605 555.242 32.3414 552.488C18.7634 549.091 3.91037 552.262 -9.60727 554.555C-16.7667 555.772 -23.8745 557.196 -30.9563 558.795C-38.0383 560.393 -35.0401 571.375 -27.9582 569.767C-16.4738 567.17 -4.8774 565.007 6.79654 563.504C16.9369 562.2 27.9044 561.115 37.0626 566.64C54.259 577.004 57.0332 599.453 53.3458 617.602C49.8393 634.829 40.8448 652.43 24.9751 661.048C23.2779 661.969 21.5376 662.838 19.6766 663.377C18.8151 663.629 15.5929 663.481 15.1449 663.785L14.6366 663.611L15.2569 665.132C15.6877 664.306 15.6274 662.56 15.9203 661.604C16.6699 659.198 17.9535 656.965 19.4699 654.967C25.1561 647.435 33.8835 642.144 41.8442 637.435C51.2523 631.875 61.2634 627.106 71.6881 623.865C80.9497 620.99 91.831 619.504 100.309 625.386C117.255 637.149 100.541 663.455 93.3387 676.321C85.042 691.134 73.5921 708.318 57.1366 714.773C55.7495 715.311 50.7612 716.98 49.7273 715.146C48.2713 712.566 54.552 705.025 55.896 703.088C61.1859 695.46 67.6216 688.632 74.7121 682.698C88.4193 671.23 111.647 657.391 130.015 665.114C139.018 668.902 143.308 678.459 143.67 687.832C144.153 699.995 138.889 711.498 133.986 722.305C130.988 728.916 140.715 734.711 143.73 728.048L143.748 728.004Z"
        fill="#FFF9F3"
      />
      <path
        d="M413.243 155.891C385.739 142.462 365.743 115.261 363.046 84.5396C361.631 68.4875 364.45 51.9916 371.472 37.4529C377.505 24.9725 389.225 7.07409 405.402 8.89016C420.023 10.5347 431.329 27.0509 436.644 39.4203C442.332 52.6675 443.949 67.4887 442.605 81.765C441.928 88.9688 440.372 96.1221 438.079 102.993C435.785 109.864 432.259 117.754 424.691 119.287C414.637 121.335 414.132 111.236 415.941 104.133C417.891 96.4551 420.7 88.202 426.792 82.7942C438.23 72.6342 457.377 75.2675 468.199 84.9936C481.324 96.788 484.567 115.594 482.678 132.373C482.052 138.003 490.872 137.952 491.499 132.373C493.53 114.232 489.549 94.4473 476.605 80.8873C465.36 69.103 446.748 64.1492 431.339 70.011C423.195 73.1084 416.89 79.0712 412.899 86.7794C408.908 94.4876 404.998 105.324 406.271 114.414C407.443 122.788 414.182 128.357 422.589 128.297C431.258 128.236 438.17 122.576 442.312 115.322C450.981 100.117 453.124 79.6463 451.365 62.5248C449.607 45.4033 443.171 27.9185 431.127 14.7924C425.176 8.29488 417.537 2.23122 408.696 0.495867C399.481 -1.31012 390.509 1.98909 383.264 7.59873C367.997 19.4133 358.974 39.5313 355.579 58.1158C347.748 100.894 369.603 144.369 408.797 163.508C413.879 165.99 418.355 158.393 413.253 155.901L413.243 155.891Z"
        fill="#FFF9F3"
      />
      <path
        d="M274.323 206.934C263.96 201.858 256.425 191.574 255.409 179.96C254.875 173.892 255.938 167.655 258.584 162.159C260.857 157.441 265.273 150.674 271.369 151.361C276.878 151.983 281.138 158.227 283.141 162.903C285.285 167.911 285.894 173.514 285.387 178.911C285.132 181.635 284.546 184.339 283.682 186.936C282.818 189.534 281.489 192.517 278.637 193.096C274.849 193.871 274.658 190.053 275.34 187.367C276.075 184.465 277.133 181.345 279.429 179.3C283.739 175.459 290.954 176.455 295.031 180.132C299.977 184.591 301.199 191.7 300.487 198.043C300.251 200.172 303.575 200.153 303.811 198.043C304.576 191.185 303.076 183.706 298.199 178.579C293.962 174.124 286.948 172.252 281.142 174.468C278.074 175.639 275.698 177.893 274.194 180.807C272.69 183.721 271.217 187.817 271.696 191.254C272.138 194.42 274.677 196.525 277.845 196.502C281.112 196.48 283.716 194.34 285.277 191.597C288.544 185.849 289.351 178.11 288.688 171.637C288.026 165.165 285.601 158.555 281.062 153.592C278.82 151.136 275.941 148.844 272.61 148.187C269.138 147.505 265.757 148.752 263.027 150.873C257.274 155.339 253.874 162.945 252.595 169.971C249.644 186.143 257.879 202.579 272.648 209.814C274.563 210.752 276.25 207.88 274.327 206.938L274.323 206.934Z"
        fill="#FFF9F3"
      />
      `,
		},
		{
			title: 'Producción de Eventos',
			backgroundIcons: `
      <path
        d="M99.9382 60.2021C89.113 66.8194 75.9083 68.902 63.2734 67.6591C56.9727 67.0545 50.1692 65.2742 46.4491 60.1349C41.1873 52.8122 45.008 41.8282 52.1801 36.3529C54.4926 34.6062 57.0397 33.2962 59.7543 32.2549L55.364 29.3997C72.2552 21.506 91.1574 17.979 109.724 19.2554C113.143 19.4906 116.997 20.1624 118.84 23.0175C120.047 24.865 120.114 27.2499 119.913 29.4333C118.84 42.0969 110.696 53.5848 99.8712 60.2021L99.9382 60.2021Z"
        fill="#050000"
      />
      <path
        d="M320.373 531.105C313.459 524.653 315.653 512.953 320.673 504.896C324.761 498.344 330.445 492.828 336.994 488.75C342.844 480.459 350.689 473.238 358.533 466.686C364.118 462.006 369.935 457.392 376.716 454.852C383.497 452.311 391.541 452.11 397.691 455.988C405.569 460.969 408.394 471.7 406.366 480.827C404.306 489.953 398.289 497.675 391.608 504.161C378.411 516.931 362.09 526.191 344.805 532.309C336.728 535.184 326.689 536.989 320.407 531.139L320.373 531.105Z"
        fill="#050000"
      />
      <path
        d="M162.274 222.996C156.045 222.895 149.317 220.795 146.02 215.443C141.823 208.634 144.787 199.59 149.251 192.985C155.946 183.094 165.938 175.541 177.196 171.815C179.228 171.137 181.493 170.595 183.491 171.408C184.357 171.747 185.057 172.357 185.656 173.068C188.587 173.508 191.385 174.592 193.65 176.591C200.545 182.654 200.145 193.967 196.015 202.232C189.753 214.799 176.13 223.2 162.274 222.996Z"
        fill="#050000"
      />
      <path
        d="M-10.432 637.334L-10.667 637.099C-8.55138 627.527 1.48962 621 11.3291 621C21.1686 621 30.37 626.556 36.8177 633.92C43.2655 641.317 47.3289 650.454 50.855 659.592C52.937 664.98 54.8848 670.838 53.5751 676.461C51.4595 685.531 41.5864 690.82 32.2842 691.79C9.14628 694.267 -13.958 674.452 -14.9655 651.257C-15.1334 647.475 -14.7304 643.526 -12.8163 640.246C-12.1446 639.108 -11.3387 638.137 -10.432 637.3L-10.432 637.334Z"
        fill="#050000"
      />
      <path
        d="M433.606 646.996C427.265 646.897 420.414 644.837 417.057 639.588C412.783 632.911 415.802 624.04 420.346 617.562C427.163 607.862 437.337 600.453 448.8 596.799C450.868 596.134 453.174 595.603 455.209 596.4C456.091 596.732 456.803 597.33 457.414 598.028C460.398 598.46 463.247 599.523 465.553 601.483C472.573 607.43 472.166 618.526 467.961 626.632C461.585 638.957 447.714 647.196 433.606 646.996Z"
        fill="#050000"
      />
      <path
        d="M471.462 351.775C464.011 357.606 454.043 360.69 445.002 358.042C440.432 356.702 436.06 353.618 434.537 349.06C432.517 342.961 436.027 336.459 440.034 331.466C440.763 330.561 441.492 329.723 442.253 328.852L430 327.947C437.186 320.909 444.803 314.307 452.817 308.241C458.679 303.784 465.004 299.494 472.224 298.288C479.443 297.081 487.789 299.662 491.266 306.197C495.041 313.302 491.995 322.049 488.385 329.254C484.113 337.733 478.88 345.944 471.429 351.775L471.462 351.775Z"
        fill="#050000"
      />
      <path
        d="M10.0057 352.06C6.49755 350.682 3.69769 347.827 1.74119 344.635C-0.687569 340.637 -1.73327 336 -1.56461 331.397L-13 332.607C-5.91612 321.553 3.25918 311.809 13.885 304.048C18.5738 300.621 24.0385 297.497 29.8068 298.068C37.869 298.908 43.6035 307.207 43.9746 315.27C44.3456 323.334 40.6013 331.028 36.1823 337.848C30.3128 346.886 20.0243 355.991 9.97199 352.06L10.0057 352.06Z"
        fill="#050000"
      />
      <path
        d="M378.938 6.49691C382.965 7.50327 385.413 11.6004 384.403 15.6426L381.489 27.3021C380.479 31.3443 376.391 33.808 372.365 32.8016C368.338 31.7953 365.889 27.6981 366.9 23.6559L369.814 11.9964C370.824 7.95426 374.912 5.49054 378.938 6.49691Z"
        fill="#030202"
      />
      <path
        d="M436.005 20.7586C440.032 21.765 442.48 25.8621 441.47 29.9043L438.556 41.5638C437.546 45.606 433.458 48.0697 429.431 47.0633C425.404 46.057 422.956 41.9598 423.966 37.9177L426.88 26.2582C427.89 22.216 431.978 19.7523 436.005 20.7586Z"
        fill="#030202"
      />
      <path
        d="M454.572 39.373L447.567 37.6224C446.163 37.2717 445.961 38.5185 445.961 38.5185L444.809 43.1272C442.932 50.6373 435.344 55.2112 427.862 53.3414C420.38 51.4716 415.835 43.8654 417.712 36.3552L418.887 31.6546C418.887 31.6546 419.241 30.5436 418.025 30.2395L390.413 23.3389C389.166 23.0273 388.905 24.2187 388.905 24.2187L387.743 28.8656C385.866 36.3758 378.277 40.9496 370.796 39.0799C363.314 37.2101 358.769 29.6038 360.646 22.0936L361.823 17.3854C361.823 17.3854 362.137 16.2725 361.008 15.9904L353.797 14.1883C351.517 13.6184 349.188 15.0251 348.616 17.3142L327.12 103.67C326.548 105.959 327.949 108.298 330.229 108.868L430.828 134.009C433.108 134.579 435.444 133.174 436.016 130.885L457.673 44.5688C458.245 42.2798 456.852 39.9429 454.572 39.373ZM430.586 118.198C429.665 121.884 425.906 124.149 422.234 123.231L342.883 103.401C339.211 102.483 336.959 98.7156 337.881 95.0294L348.822 51.2507C349.743 47.5645 353.501 45.2992 357.174 46.2169L436.529 66.0487C440.201 66.9664 442.452 70.7337 441.531 74.4199L430.59 118.199L430.586 118.198Z"
        fill="#030202"
      />
      <path
        d="M92.7039 527.156C96.5307 525.549 100.946 527.362 102.559 531.203L107.214 542.283C108.827 546.125 107.031 550.547 103.204 552.154C99.3775 553.762 94.9624 551.949 93.3488 548.107L88.6945 537.027C87.081 533.186 88.8771 528.764 92.7039 527.156Z"
        fill="#030202"
      />
      <path
        d="M146.934 504.376C150.761 502.769 155.176 504.582 156.79 508.423L161.444 519.503C163.058 523.345 161.262 527.767 157.435 529.374C153.608 530.981 149.193 529.169 147.579 525.327L142.925 514.247C141.311 510.406 143.108 505.984 146.934 504.376Z"
        fill="#030202"
      />
      <path
        d="M172.954 508.153L166.297 510.949C164.964 511.509 165.549 512.628 165.549 512.628L167.389 517.008C170.387 524.145 167.052 532.355 159.942 535.341C152.832 538.328 144.635 534.962 141.637 527.825L139.761 523.358C139.761 523.358 139.379 522.256 138.223 522.742L111.983 533.764C110.798 534.262 111.303 535.372 111.303 535.372L113.158 539.788C116.155 546.925 112.821 555.134 105.711 558.121C98.6009 561.108 90.4043 557.742 87.4064 550.605L85.527 546.131C85.527 546.131 85.1119 545.051 84.0392 545.502L77.1865 548.38C75.0194 549.29 73.9982 551.812 74.9119 553.987L109.452 636.002C110.366 638.178 112.889 639.211 115.056 638.3L210.657 598.143C212.824 597.233 213.852 594.708 212.939 592.533L178.551 510.454C177.637 508.278 175.121 507.242 172.954 508.153ZM200.988 585.63C202.46 589.133 200.808 593.199 197.318 594.665L121.909 626.34C118.42 627.806 114.36 626.139 112.889 622.636L95.4128 581.033C93.9413 577.53 95.5928 573.464 99.0826 571.998L174.495 540.321C177.985 538.855 182.045 540.522 183.516 544.025L200.992 585.628L200.988 585.63Z"
        fill="#030202"
      />
      `,
		},
	];
}
