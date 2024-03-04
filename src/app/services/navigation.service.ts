import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class NavigationService {
	private sectionNavigate = new BehaviorSubject<number | null>(null);
	private padresectionNavigate = new BehaviorSubject<number | null>(null);

	setSectionNavigate(index: number | null) {
		this.sectionNavigate.next(index);
	}

	setPadreSectionNavigate(index: number | null) {
		this.padresectionNavigate.next(index);
	}

	changeSectionNavigate = this.sectionNavigate.asObservable();
	changePadreSectionNavigate = this.padresectionNavigate.asObservable();
}
