import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from '../../sidebar/sidebar.service';
import { GestanteService } from '../gestante.service';
import { Bebe } from 'src/app/entities/Bebe';

@Component({
  selector: 'app-infos-recem-nascido',
  templateUrl: './infos-recem-nascido.component.html',
  styleUrls: ['./infos-recem-nascido.component.css']
})
export class InfosRecemNascidoComponent  implements OnInit{
  sideNavStatus = false;
  infosGestante = [] = new Array();
  avatar:any = 'https://cdn-icons-png.flaticon.com/128/1946/1946429.png';

  consultas = [
    {
      name: 'Data de Nascimeto',
      pdfLink: 'link_to_bcg_pdf',
      date: '10/01/23',
      dose: 'Dose 1',
      expanded: false
    },
    {
      name: 'Status',
      pdfLink: 'link_to_hepatite_pdf',
      date: '15/02/23',
      dose: 'Dose 1',
      expanded: false
    },
    {
      name: 'Profissionais Responsáveis',
      pdfLink: 'link_to_bcg_pdf',
      date: '10/01/23',
      dose: 'Dose 1',
      expanded: false
    },
    {
      name: 'Tipo Sanguíneo',
      pdfLink: 'link_to_bcg_pdf',
      date: '10/01/23',
      dose: 'Dose 1',
      expanded: false
    },
  ];
  bebe: any;
  currentStep = 1;
  bebeId!: number

  showStep(step: number) {
    this.currentStep = step;
  
    const infos = document.getElementById('info');
    const historico = document.getElementById('historico');
  
    if (step === 1) {
      this.infosGestante = this.consultas.slice(0, 2);
  
      if (infos && historico) {
        infos.classList.add('active');
        infos.classList.remove('a-links');
        historico.classList.add('a-links');
        historico.classList.remove('active');
      }
    } else if (step === 2) {
      this.infosGestante = this.consultas.slice(2, 4);
  
      if (infos && historico) {
        historico.classList.add('active');
        historico.classList.remove('a-links');
        infos.classList.add('a-links');
        infos.classList.remove('active');
      }
    }
  }
  

  submitForm() {
    console.log(this.consultas);
  }

  toggleDetails(consulta: any): void {
    consulta.expanded = !consulta.expanded;
  }


  constructor(private router: Router, private route: ActivatedRoute, private sideBarService: SidebarService, private service: GestanteService) {
    this.sideBarService.getSideNavStatus().subscribe(status => {
      this.sideNavStatus = status;
    });
  }
  ngOnInit(): void {
    this.noSideBar();
    this.showStep(this.currentStep);
    this.route.queryParams.subscribe(params => {
      this.bebeId = parseInt(params['id']);
    })
    this.getBaby()
  }

  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }
  }

  getBaby(){
    this.service.getOneBaby(this.bebeId).subscribe((response)=>{
      this.bebe = response;
      console.log(this.bebe)
    })
  }
 
  navigateToHistorico(): void {
    this.router.navigateByUrl('historico-gestante');
  }

  navigateToBebe(): void {
    this.router.navigateByUrl('infos-recem-nascido');
  }


  expandContactInfo(contact: any): void {
    contact.expanded = !contact.expanded;
  }
}

