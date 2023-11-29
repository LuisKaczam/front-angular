import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../sidebar/sidebar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfissionalService } from '../profissional.service';
import { PushNotificationService } from 'src/app/push-notification.service';

@Component({
  selector: 'app-historico-gestante',
  templateUrl: './historico-gestante.component.html',
  styleUrls: ['./historico-gestante.component.css']
})
export class HistoricoGestanteComponent implements OnInit{
  sideNavStatus = false;
  gestante: any = [];
  gestanteId:number = 0
  consultas: any = [];



  constructor(private sideBarService: SidebarService, private pushNotification: PushNotificationService, private route: ActivatedRoute, private router: Router, private profissionalService: ProfissionalService) {
    this.sideBarService.getSideNavStatus().subscribe(status => {
      this.sideNavStatus = status;
    });
  }

  ngOnInit(): void {
    this.noSideBar();
    this.route.queryParams.subscribe(params => {
      this.gestanteId = parseInt(params['id']);
    });

    this.getOneGestante();

    this.getConsultas();
  }

  clickCloseNotification(){
    this.pushNotification._updateIconNotification$.next();
  }

  newConsulta(): void {
    this.router.navigate(['/new-consulta'], { queryParams: { id: this.gestanteId } });
  }

  navigateToUpdateGestante(): void {
    this.router.navigate(['/edit-gestante'], { queryParams: { id: this.gestanteId } });
  }

  getConsultas(){
    this.profissionalService.listConsultas(this.gestanteId).subscribe((response)=>{
      this.consultas = response;
      console.log(this.consultas)
    })
  }

  toggleDetails(consulta: any): void {
    consulta.expanded = !consulta.expanded;
  }

  getOneGestante(){
    this.profissionalService.getOneGestante(this.gestanteId).subscribe((response) => {
      if(response){
      this.gestante = response
      }
    });
  }

  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }
  }
}
