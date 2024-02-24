import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private wallColorSubject = new BehaviorSubject<string>('');
  public wallColor$ = this.wallColorSubject.asObservable();

  changeWallColor(color: string): void {
    this.wallColorSubject.next(color);
  }

  private closeMenuSubject = new Subject<void>();

  closeMenu$ = this.closeMenuSubject.asObservable();

  closeMenu() {
    this.closeMenuSubject.next();
  }

  private menuState = new BehaviorSubject<boolean>(false);

  getMenuState() {
    return this.menuState.asObservable();
  }

  setMenuState(state: boolean) {
    this.menuState.next(state);
  }
}
