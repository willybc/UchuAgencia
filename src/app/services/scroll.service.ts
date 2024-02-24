import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private isTransitioningSubject = new BehaviorSubject<boolean>(false);

  isTransitioningSubject$ = this.isTransitioningSubject.asObservable();

  notifyIsNotTransitioning() {
    this.isTransitioningSubject.next(false);
  }

  notifyIsTransitioning() {
    this.isTransitioningSubject.next(true);
  }
}