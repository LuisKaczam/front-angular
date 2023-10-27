import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  closeModalEvent: EventEmitter<void> = new EventEmitter<void>();
  pdfEvent: EventEmitter<void> = new EventEmitter<void>();
  constructor() { }
}
