import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { PrimaryColor } from 'src/app/utils/color';

@Injectable({
	providedIn: 'root',
})
export class CircleService {
	// CIRCLES
	private changeCircle = new BehaviorSubject<{
		filled: PrimaryColor;
		m: number;
	}>({
		filled: PrimaryColor.Light,
		m: 0,
	});

	setProperties(filled: PrimaryColor, m: number) {
		this.changeCircle.next({ filled, m });
	}

	changeCircle$ = this.changeCircle.asObservable();

	// SECTIONS
	private serviceSection = new Subject<number>();

	setServiceSection(index: number) {
		this.serviceSection.next(index);
	}

	serviceSection$ = this.serviceSection.asObservable();
}
