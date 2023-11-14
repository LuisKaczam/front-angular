import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PwaObject } from './entities/PwaObject';
import { Observable } from 'rxjs';
import { getMessaging, getToken } from 'firebase/messaging';
import { SwPush } from '@angular/service-worker';
import { environment } from 'src/environments/environment';

@Injectable()
export class PushNotificationService {
  private token!: string;
  private baseUrl = 'https://sisgestante-deploy.onrender.com';
  private  vpaidKey ='BKeh0REEDpBSbAoiWhwlbojA0VF-Y3Fs8B1QkOALGqr6IsUYZ4UCuZhTs9PnQdSD01e_FwgpN99ufPjrLVxlBlM'

  constructor(private fireMsg: AngularFireMessaging, private http: HttpClient) {}

  notificationSub() {
    const id = Number(localStorage.getItem('idUser'));
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          const messaging = getMessaging();
          getToken(messaging, { vapidKey: this.vpaidKey }).then(token => {
            if (token) {
              this.getPwaObject(id).subscribe((userToken) => {
                const existingTokens = userToken.map((item:PwaObject) => item.token);
  
                if (!existingTokens.includes(token)) {
                  this.newUrlNotification(token).subscribe(() => {
                    console.log('Token cadastrado:', token);
                  });
                } else {
                  console.log('Token já cadastrado:', token);
                }
              });
            } else {
              console.log('Sem token');
            }
          });
        } else if (permission === 'denied') {
          console.log('Permissão para notificações foi negada.');
        } else if (permission === 'default') {
          console.log('A caixa de diálogo de permissão foi fechada sem escolha.');
        }
      });
    }
  }
  

  receiveNotification(){
    this.fireMsg.messages.subscribe((payload)=>{
      this.showNotification(payload);
    })
  }

  showNotification(payload: any) {
    const data = payload['notification'];
    const title = payload['title'];
    const options = {
      body: data['body'],
      icon: data['icon'],  
      image: data['image'],
      vibrate: [300, 100, 300]
    };
    const userNotify: Notification = new Notification(title, options);
  
    userNotify.onclick = (event) => {
      event.preventDefault();
      window.location.href = 'https://sisgestante-d38c4.web.app/';
    };
  }
  

  getPwaObject(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http.get<PwaObject[]>(
      `${this.baseUrl}/auth/${id}/pwa-notifications`,
      { headers: headers }
    );
  }

  newUrlNotification(token: any): Observable<any> {
    const id = localStorage.getItem('idUser');
    console.log('id ', id);
    const notificationUrl = { token };
    const pinToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + pinToken,
    });

    console.log('New URL Notification:', notificationUrl);

    return this.http.post(`${this.baseUrl}/auth/notification-url/${id}`, notificationUrl, { headers: headers });
  }

  updateUrlNotification(id: number, token: string): Observable<any> {
    const pinToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + pinToken,
    });

    const notification = { token };

    console.log('Update URL Notification:', notification);

    return this.http.put(`${this.baseUrl}/auth/update-notification-url/${id}`, notification, { headers: headers });
  }
}
