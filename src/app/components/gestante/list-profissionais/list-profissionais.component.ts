import { Component } from '@angular/core';
import { SidebarService } from '../../sidebar/sidebar.service';
import { GestanteService } from '../gestante.service';
import { Router } from '@angular/router';
import { PushNotificationService } from 'src/app/push-notification.service';
import { EncondingParamsService } from 'src/app/enconding-params.service';

@Component({
  selector: 'app-list-profissionais',
  templateUrl: './list-profissionais.component.html',
  styleUrls: ['./list-profissionais.component.css']
})
export class ListProfissionaisComponent {
  sideNavStatus = false;
  profissionaisArray: any;


  constructor(private sideBarService: SidebarService, private service: GestanteService, private cryptService: EncondingParamsService, private router:Router, private pushNotification: PushNotificationService) {
    this.sideBarService.getSideNavStatus().subscribe(status => {
      this.sideNavStatus = status;
    });
  }

 

  ngOnInit(): void {
      this.noSideBar();
      this.getProfissionais();
  }

  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }
  }

  clickCloseNotification(){
    this.pushNotification._updateIconNotification$.next();
  }

  getProfissionais(){
    this.service.getAllProfissionais().subscribe((response)=>{
      if(response){
        this.profissionaisArray = response;
      }
    })
  }

  infosProfissional(profissionalId:number){
    const encondeId = this.cryptService.encode(String(profissionalId));
    if(encondeId){
      this.router.navigate(['/infos-meu-profissional'], { queryParams: { id: encondeId }}); 
      }
  }

}
