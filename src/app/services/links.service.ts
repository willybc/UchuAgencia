import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PrimaryColor } from '../utils/color';

@Injectable({
  providedIn: 'root'
})
export class LinksService {
  private leftColorSubject = new BehaviorSubject<PrimaryColor>(PrimaryColor.Dark);
  public leftColor$ = this.leftColorSubject.asObservable();

  private rightColorSubject = new BehaviorSubject<PrimaryColor>(PrimaryColor.Dark);
  public rightColor$ = this.rightColorSubject.asObservable();

  changeLeftColor(color: PrimaryColor): void {
    this.leftColorSubject.next(color);
  }

  changeRightColor(color: PrimaryColor): void {
    this.rightColorSubject.next(color);
  }
}