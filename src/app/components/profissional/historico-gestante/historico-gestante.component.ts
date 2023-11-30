import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../sidebar/sidebar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfissionalService } from '../profissional.service';
import { PushNotificationService } from 'src/app/push-notification.service';
import { EncondingParamsService } from 'src/app/enconding-params.service';

@Component({
  selector: 'app-historico-gestante',
  templateUrl: './historico-gestante.component.html',
  styleUrls: ['./historico-gestante.component.css'],
})
export class HistoricoGestanteComponent implements OnInit {
  sideNavStatus = false;
  gestante: any = [];
  gestanteId: number = 0;
  consultas: any = [];

  constructor(
    private sideBarService: SidebarService,
    private cryptService: EncondingParamsService,
    private pushNotification: PushNotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private profissionalService: ProfissionalService
  ) {
    this.sideBarService.getSideNavStatus().subscribe((status) => {
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
    this.getOneGestante();
    this.getConsultas();
  }

  clickCloseNotification() {
    this.pushNotification._updateIconNotification$.next();
  }

  newConsulta(): void {
    const encondeId = this.cryptService.encode(String(this.gestanteId));
    if(encondeId){
    this.router.navigate(['/new-consulta'], {
      queryParams: { id: encondeId },
    });
  }
  }

  navigateToUpdateGestante(): void {
    const encondeId = this.cryptService.encode(String(this.gestanteId));
    if(encondeId){
      this.router.navigate(['/edit-gestante'], {
      queryParams: { id: encondeId },
    });
  }
  }

  getConsultas() {
    if(this.gestanteId !== 0){
    this.profissionalService
      .listConsultas(this.gestanteId)
      .subscribe((response) => {
        this.consultas = response;
      });
    }else{
      window.history.back();
    }
  }

  toggleDetails(consulta: any): void {
    consulta.expanded = !consulta.expanded;
  }

  getOneGestante() {
    if(this.gestanteId !== 0){
    this.profissionalService
      .getOneGestante(this.gestanteId)
      .subscribe((response) => {
        if (response) {
          this.gestante = response;
        }
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
