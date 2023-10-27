import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../sidebar/sidebar.service';
import { Router } from '@angular/router';
import { GestanteService } from '../gestante.service';

@Component({
  selector: 'app-infos-gestante',
  templateUrl: './infos-gestante.component.html',
  styleUrls: ['./infos-gestante.component.css']
})
export class InfosGestanteComponent implements OnInit {
  sideNavStatus = false;
  infosGestante:any; 
  currentStep = 1;
  consultas:any;
  


  constructor(private router: Router, private sideBarService: SidebarService, private service: GestanteService) {
    this.sideBarService.getSideNavStatus().subscribe(status => {
      this.sideNavStatus = status;
    });
  }
  ngOnInit(): void {
    this.showStep(this.currentStep);
    this.noSideBar();
    this.getGestante();
    this.getConsultas();
  }

  showStep(step: number) {
    this.currentStep = step;
  
    const infos = document.getElementById('info');
    const historico = document.getElementById('historico');
  
    if (step === 1) {
      if (infos && historico) {
        infos.classList.add('active');
        infos.classList.remove('a-links');
        historico.classList.add('a-links');
        historico.classList.remove('active');
      }
    } else if (step === 2) {
  
      if (infos && historico) {
        historico.classList.add('active');
        historico.classList.remove('a-links');
        infos.classList.add('a-links');
        infos.classList.remove('active');
      }
    }
  }
  



  toggleDetails(consulta: any): void {
    consulta.expanded = !consulta.expanded;
  }

  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }
  }
 
  navigateToHistorico(): void {
    this.router.navigateByUrl('historico-gestante');
  }

  getGestante(){
    this.service.getGestante().subscribe((response)=>{
      this.infosGestante = response;
    })
  }

  getConsultas(){
    this.service.getConsultas().subscribe((response)=>{
      this.consultas = response;
      console.log(this.consultas)
    })
  }

  navigateToBebe(): void {
    this.router.navigateByUrl('infos-recem-nascido');
  }


  expandContactInfo(contact: any): void {
    contact.expanded = !contact.expanded;
  }
}
