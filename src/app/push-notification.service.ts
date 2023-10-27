import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { ProfissionalService } from './components/profissional/profissional.service';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  public readonly publicKey = "BDWnqVsBJoh7YTWFK5_0kCOH2ht7xqPNcR65SMTqCG5gUPD0kJPTXKWfNUAP_p_9n2k-LynEAsUXYFIhcMMMNHI";
  private subscriptionDetails:any


  constructor(private swPush: SwPush, private service: ProfissionalService) { }

  notificationSub() {
   
    const publicKey = this.publicKey;

    this.swPush.requestSubscription({
      serverPublicKey: publicKey,
    }).then(subscription => {
        this.subscriptionDetails = JSON.parse(JSON.stringify(subscription));
      if(this.subscriptionDetails){
        localStorage.setItem("notificationUrl", JSON.stringify(this.subscriptionDetails));
        console.log(this.subscriptionDetails);
        const userId = Number(localStorage.getItem("userId"));
        if (userId) {
        this.updateUrl(userId)
        }
      }
 
    });
  }

  updateUrl(id:number){
    const userId = localStorage.getItem("userId");
    if (userId) {
      this.service.getPwaObject().subscribe((response) => {
        if (response == null) {
          this.service.updateUrlNotification(parseInt(userId), this.subscriptionDetails.endpoint, this.subscriptionDetails.expirationTime, this.subscriptionDetails.keys)
            .subscribe(() => {
              console.log("Usuário permitiu");
            });
        }
      });
    } 
  }
}
