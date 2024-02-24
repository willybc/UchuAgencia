import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransitionService {
  private activateTransition = new Subject<{
    color: string;
    particles: string;
    posX: number;
    posY: number;
    page: string | null;
  }>();

  // Método para emitir eventos
  setProperties(
    color: string,
    particles: string,
    posX: number,
    posY: number,
    page: string | null
  ) {
    this.activateTransition.next({ color, particles, posX, posY, page });
  }

  // Método para suscribirse a eventos
  setTransition() {
    return this.activateTransition.asObservable();
  }
}
