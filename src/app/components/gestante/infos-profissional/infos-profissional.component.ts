import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from '../../sidebar/sidebar.service';
import { GestanteService } from '../gestante.service';
import { PushNotificationService } from 'src/app/push-notification.service';
import { EncondingParamsService } from 'src/app/enconding-params.service';

@Component({
  selector: 'app-infos-profissional',
  templateUrl: './infos-profissional.component.html',
  styleUrls: ['./infos-profissional.component.css']
})
export class InfosProfissionalComponent {
  sideNavStatus = false;
  profissional:any; 
  currentStep = 1;
  consultas:any;
  profissionalId!:number;
  postVideos: any[] = [];
  postArticles: any[] = [];
  


  constructor(private router: Router, private sideBarService: SidebarService, private cryptService: EncondingParamsService, private service: GestanteService, private route: ActivatedRoute, private pushNotification: PushNotificationService) {
    this.sideBarService.getSideNavStatus().subscribe(status => {
      this.sideNavStatus = status;
    });
    this.route.queryParams.subscribe((params) => {
      const encodedValue = params['id'];
      if (encodedValue) {
        this.profissionalId = parseInt(this.cryptService.decode(encodedValue));

        if (this.profissionalId === 0) {
          window.history.back();
        }
      }
    });
  }
  ngOnInit(): void {
    this.noSideBar();
    this.getProfissional();
    this.getArticles();
    this.getVideos();
    
  }

  clickCloseNotification(){
    this.pushNotification._updateIconNotification$.next();
  }

  getProfissional(){
    if(this.profissionalId !== 0){
      this.service.getProfissional(this.profissionalId).subscribe((response)=>{
        this.profissional = response;
      })
    }else{
      window.history.back();
    }
   
  }

  getVideos(){
    if(this.profissionalId !== 0){
      this.service.listVideos(this.profissionalId).subscribe((response)=>{
        this.postVideos = response;
      })
    }else{
      window.history.back();
    }
    
  }

  getArticles(){
    if(this.profissionalId !== 0){
      this.service.listArticles(this.profissionalId).subscribe((response)=>{
        this.postArticles = response;
      });
    }else{
      window.history.back();
    }
    
  }

  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }
  }
 
}
