import { Component } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { ProfissionalService } from './components/profissional/profissional.service';
import { PushNotificationService } from './push-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Sisgestante';
  
  constructor(private pushService: PushNotificationService) {
    this.pushService.notificationSub();
  }


}
