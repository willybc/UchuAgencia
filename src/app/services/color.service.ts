import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { PrimaryColor } from 'src/app/utils/color';

@Injectable({
	providedIn: 'root',
})
export class ColorService {
	private colors: Map<number, PrimaryColor> = new Map<number, PrimaryColor>();

	constructor() {}

	setColor(index: number, color: PrimaryColor) {
		this.colors.set(index, color);
	}

	getColor(index: number): PrimaryColor | undefined {
		return this.colors.get(index);
	}
}
