import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../../sidebar/sidebar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PushNotificationService } from 'src/app/push-notification.service';
import { EncondingParamsService } from 'src/app/enconding-params.service';

@Component({
  selector: 'app-recem-nascido',
  templateUrl: '../before-birth/recem-nascido.component.html',
  styleUrls: ['../before-birth/recem-nascido.component.css']
})
export class RecemNascidoComponent implements OnInit {
  sideNavStatus = false;
  isRegisterBebe = false;
  gestanteId: number = 0;

  constructor(private sideBarService: SidebarService, private cryptService: EncondingParamsService,  private pushNotification: PushNotificationService, private route: ActivatedRoute, private router: Router) {
    this.sideBarService.getSideNavStatus().subscribe(status => {
      this.sideNavStatus = status;
    });
    this.route.queryParams.subscribe((params) => {
      const encodedValue = params['id'];
      if (encodedValue) {
        this.gestanteId = parseInt(this.cryptService.decode(encodedValue));

        if (this.gestanteId === 0) {
          window.history.back();
        }
      }
    });
  }

  ngOnInit(): void {
      this.noSideBar();
  }

  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }

    this.route.queryParams.subscribe(params => {
      this.gestanteId = parseInt(params['id']);
    })
  }

  navigateToNewBaby(){
    const encondeId = this.cryptService.encode(String(this.gestanteId));
    if(encondeId){
      this.route.queryParams.subscribe(params => {
        this.gestanteId = parseInt(params['id']);
        this.router.navigate(['/add-baby'], { queryParams: { id: encondeId } });
       });
    }
    
  }

  clickCloseNotification(){
    this.pushNotification._updateIconNotification$.next();
  }

  
}
