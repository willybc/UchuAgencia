import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
@Component({
	selector: 'app-newsletter-popup',
	templateUrl: './newsletter-popup.component.html',
	styleUrls: ['./newsletter-popup.component.scss'],
})
export class NewsletterPopupComponent {
	email: string = '';
	@Output() closePopupEvent = new EventEmitter<void>();
	@Input() isOpen: boolean;

	constructor() {
		this.isOpen = false;
	}
	
	ngOnInit(): void {}

	closePopup() {
		this.closePopupEvent.emit();
	}

	subscribe() {
		// Aquí puedes implementar la lógica para suscribir al usuario
		/* console.log('Correo electrónico:', this.email); */
		this.closePopup();
	}
}
