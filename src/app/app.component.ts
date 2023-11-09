import { AfterContentInit, Component, OnInit } from '@angular/core';
import { PushNotificationService } from './push-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterContentInit {
  title = 'Sisgestante';

  constructor(private pushService: PushNotificationService) {
  }

  ngAfterContentInit(): void {
  this.getPush();
  this.pushService.receiveNotification();
    
  }

  getPush(){
    const userId = Number(localStorage.getItem('idUser'));
    if(userId !== 0){
      this.pushService.notificationSub();
    }

  }


  
}
