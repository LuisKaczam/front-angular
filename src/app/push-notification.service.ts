import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { getMessaging, getToken } from 'firebase/messaging';
import { Observable, Subject, tap } from 'rxjs';
import { PwaObject } from './entities/PwaObject';

@Injectable()
export class PushNotificationService {
  private baseUrl = 'https://sisgestante-deploy-tb0m.onrender.com';
  private  vpaidKey ='BKeh0REEDpBSbAoiWhwlbojA0VF-Y3Fs8B1QkOALGqr6IsUYZ4UCuZhTs9PnQdSD01e_FwgpN99ufPjrLVxlBlM';
  _notification$ = new Subject<void>();
  _updateIconNotification$ = new Subject<void>();

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
                  });
                } 
              });
            }
          });
        } 
      });
    }
  }
  

  receiveNotification(){
    this.fireMsg.messages.pipe(
      tap(() => {
        this._notification$.next();
      })
    ).subscribe((payload)=>{
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
    const notificationUrl = { token };
    const pinToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + pinToken,
    });


    return this.http.post(`${this.baseUrl}/auth/notification-url/${id}`, notificationUrl, { headers: headers });
  }

  updateUrlNotification(id: number, token: string): Observable<any> {
    const pinToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + pinToken,
    });

    const notification = { token };


    return this.http.put(`${this.baseUrl}/auth/update-notification-url/${id}`, notification, { headers: headers });
  }
}
