import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../sidebar/sidebar.service';
import { GestanteService } from '../gestante.service';
import { Router } from '@angular/router';
import { PushNotificationService } from 'src/app/push-notification.service';
import { EncondingParamsService } from 'src/app/enconding-params.service';

@Component({
  selector: 'app-list-babies',
  templateUrl: './list-babies.component.html',
  styleUrls: ['./list-babies.component.css']
})
export class ListBabiesComponent implements OnInit{
  sideNavStatus = false;
  babiesArray: any;


  constructor(private sideBarService: SidebarService, private cryptService: EncondingParamsService, private pushNotification: PushNotificationService, private service: GestanteService, private router:Router) {
    this.sideBarService.getSideNavStatus().subscribe(status => {
      this.sideNavStatus = status;
    });
  }

  ngOnInit(): void {
      this.noSideBar();
      this.getBabies()
  }

  clickCloseNotification(){
    this.pushNotification._updateIconNotification$.next();
  }

  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }
  }

  getBabies(){
    this.service.listBebes().subscribe((response)=>{
      if(response){
        this.babiesArray = response;
      }
    })
  }

  infosBaby(babyId:number){
    const encondeId = this.cryptService.encode(String(babyId));
    if(encondeId){
      this.router.navigate(['/infos-meu-bebe'], { queryParams: { id: encondeId }}); 
    }
   
  }

}
