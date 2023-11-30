import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from '../../sidebar/sidebar.service';
import { GestanteService } from '../gestante.service';
import { Bebe } from 'src/app/entities/Bebe';
import { Vacinas } from 'src/app/entities/Vacinas';
import { PushNotificationService } from 'src/app/push-notification.service';
import { EncondingParamsService } from 'src/app/enconding-params.service';

@Component({
  selector: 'app-infos-recem-nascido',
  templateUrl: './infos-recem-nascido.component.html',
  styleUrls: ['./infos-recem-nascido.component.css']
})
export class InfosRecemNascidoComponent  implements OnInit{
  sideNavStatus = false;
  infosGestante = [] = new Array();
  vacinas: any;
  vacinasBaby:any[] = [];
  bebe: any;
  currentStep = 1;
  bebeId!: number
  gestante:any;



 


  constructor(private router: Router, private pushNotification: PushNotificationService, private cryptService: EncondingParamsService, private route: ActivatedRoute, private sideBarService: SidebarService, private service: GestanteService) {
    this.sideBarService.getSideNavStatus().subscribe(status => {
      this.sideNavStatus = status;
    });
    this.route.queryParams.subscribe((params) => {
      const encodedValue = params['id'];
      if (encodedValue) {
        this.bebeId = parseInt(this.cryptService.decode(encodedValue));
        
        if (this.bebeId === 0) {
          window.history.back();
        }
      }
    });
  }
  ngOnInit(): void {
    this.noSideBar();
    this.showStep(this.currentStep);
    this.getBaby()
    this.getGestante();
    this.getVacinas();
    this.getVacinasBaby();
  }

  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }
  }

  clickCloseNotification(){
    this.pushNotification._updateIconNotification$.next();
  }

  toggleDetails(consulta: any): void {
    consulta.expanded = !consulta.expanded;
  }

  getBaby(){
    if(this.bebeId !== 0){
      this.service.getOneBaby(this.bebeId).subscribe((response)=>{
        this.bebe = response;
      })
    }else{
      window.history.back();
    }
   
  }

  getVacinas() {
    this.service.getVaccines().subscribe((response) => {
        const vacinasSet = new Set(response); 
        this.vacinas = Array.from(vacinasSet);
        this.vacinas.sort((a: { idadeNecessaria: number; }, b: { idadeNecessaria: number; }) => a.idadeNecessaria - b.idadeNecessaria);
    });
}

getVacinasBaby(){
  if(this.bebeId !== 0){
    this.service.getVaccinesBaby(this.bebeId).subscribe((response)=>{
      this.vacinasBaby = response;
    })
  }else{
    window.history.back();
  }
 
 
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

  getGestante(){
    this.service.getGestante().subscribe((response)=>{
      this.gestante = response;
    })
  }

  

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const nameId = this.gestante.usuario.name + this.gestante.usuario.id;
    if (file) {
        this.bebe.foto = file;
        const updateBaby = new Bebe();
        updateBaby.babyBithDate = this.bebe.dataNascimento;
        updateBaby.babyBloodType = this.bebe.tipoSanguineo;
        updateBaby.babyHeight = this.bebe.altura;
        updateBaby.babyName = this.bebe.nome;
        updateBaby.babyWeight = this.bebe.peso;
        updateBaby.sex = this.bebe.sexo;
        updateBaby.photo = this.bebe.foto;
        updateBaby.id = this.bebe.id;
        this.service.updateBabyPhoto(updateBaby, file, nameId);
      };
    }


 
}

