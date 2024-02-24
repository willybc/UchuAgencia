import { Component } from '@angular/core';
import { LinksService } from 'src/app/services/links.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TransitionService } from 'src/app/services/transition.service';
import { PrimaryColor, SecondaryColor, opositeColor } from 'src/app/utils/color';
import {
  ServicioCampanias,
  ServicioComunicacion,
  ServicioDisenio,
  ServicioEventos,
} from 'src/app/utils/icons';

@Component({
  selector: 'app-servicios-nav',
  templateUrl: './servicios-nav.component.html',
  styleUrls: ['./servicios-nav.component.scss'],
})
export class ServiciosNavComponent {
  comunicacion = new ServicioComunicacion(this.linksService);
  disenio = new ServicioDisenio();
  campanias = new ServicioCampanias();
  eventos = new ServicioEventos(this.linksService);

  constructor(
    private linksService: LinksService,
    private transService: TransitionService,
    private navService: NavigationService
  ) {}

  ngOnInit() {
    this.comunicacion.animation();
    this.disenio.animation();
    this.campanias.animation();
    this.eventos.animation();

    this.linksService.changeLeftColor(PrimaryColor.Light);
    this.linksService.changeRightColor(PrimaryColor.Dark);
  }

  goToService(i: number) {
    const services = [
      this.comunicacion,
      this.disenio,
      this.campanias,
      this.eventos,
    ];

    this.transService.setProperties(
      opositeColor(services[i].primary),
      services[i].secondary,
      window.innerWidth / 2,
      window.innerHeight / 2,
      'servicios'
    );
    this.navService.setSectionNavigate(i);
  }
}
