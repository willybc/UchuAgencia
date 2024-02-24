import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private sectionNavigate = new BehaviorSubject<number | null>(null);

  setSectionNavigate(index: number | null) {
    this.sectionNavigate.next(index);
  }

  changeSectionNavigate = this.sectionNavigate.asObservable();
}
