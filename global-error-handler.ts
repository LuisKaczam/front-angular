import { ErrorHandler, Injectable } from '@angular/core';
import { FirebaseError } from 'firebase/app';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor() {}

  handleError(error: any): void {
    if (error instanceof FirebaseError) {
      if (error.message.includes('token-unsubscribe-failed')) {
        error = null;
        window.location.reload();
      }

      if (error.message && (error.message.includes('no active Service Worker') || error.message.includes('Not Found') || error.message.includes('404'))) {
        error = null;
        window.location.reload();
      }
      
    }

    if (error.message && error.message.includes('no active Service Worker') || error.message && error.message.includes('Not Found')) {
      error = null;
      window.location.reload();
    }
  }
}
