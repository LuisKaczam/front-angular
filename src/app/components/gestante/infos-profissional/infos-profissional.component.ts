import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from '../../sidebar/sidebar.service';
import { GestanteService } from '../gestante.service';

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
  


  constructor(private router: Router, private sideBarService: SidebarService, private service: GestanteService, private route: ActivatedRoute) {
    this.sideBarService.getSideNavStatus().subscribe(status => {
      this.sideNavStatus = status;
    });
  }
  ngOnInit(): void {
    this.noSideBar();
    this.route.queryParams.subscribe(params => {
      this.profissionalId = parseInt(params['id']);
    });
    this.getProfissional();
    this.getArticles();
    this.getVideos();
    
  }

  getProfissional(){
    this.service.getProfissional(this.profissionalId).subscribe((response)=>{
      this.profissional = response;
      console.log(this.postVideos);
    })
  }

  getVideos(){
    this.service.listVideos(this.profissionalId).subscribe((response)=>{
      this.postVideos = response;
      console.log(this.postVideos);
    })
  }

  getArticles(){
    this.service.listArticles(this.profissionalId).subscribe((response)=>{
      this.postArticles = response;
    })
  }

  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }
  }
 
}
