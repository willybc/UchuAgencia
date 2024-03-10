import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class IndexService {
	private indexSubject = new BehaviorSubject<number>(0);
	public index$ = this.indexSubject.asObservable();

	public indexSubjectService = new BehaviorSubject<number>(0);
	public indexService$ = this.indexSubjectService.asObservable();

	setIndex(index: number): void {
		this.indexSubject.next(index);
	}

	getIndex(): number {
		return this.indexSubject.value;
	}

	setIndexService(index: number): void {
		this.indexSubjectService.next(index);
	}

	getIndexService(): number {
		return this.indexSubjectService.value;
	}
}
