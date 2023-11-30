import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from 'src/app/components/sidebar/sidebar.service';
import { ProfissionalService } from '../../../profissional.service';
import { PushNotificationService } from 'src/app/push-notification.service';
import { EncondingParamsService } from 'src/app/enconding-params.service';

@Component({
  selector: 'app-bebe',
  templateUrl: './bebe.component.html',
  styleUrls: ['./bebe.component.css']
})
export class BebeComponent implements OnInit{
  sideNavStatus = false;
  bebeId:number = 0;
  baby: any;
  vacinas: any;
  vacinasBaby:any[] = [];
  showFullText = false;

 

  constructor(private sideBarService: SidebarService, private cryptService: EncondingParamsService, private pushNotification: PushNotificationService, private route: ActivatedRoute, private router: Router, private profissionalService: ProfissionalService) {
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
    this.getBaby();
    this.getVacinas();
    this.getVaccinesBaby();
  }

  
  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }
  }
  clickCloseNotification(){
    this.pushNotification._updateIconNotification$.next();
  }

  newVaccine(){
    const encondeId = this.cryptService.encode(String(this.bebeId));
    const name = this.cryptService.encode(String(this.baby.nome));
    this.router.navigate(['/new-vaccine'], { queryParams: { id: encondeId, name: name } });
  }

  getVaccinesBaby(){
    if(this.bebeId !== 0){
      this.profissionalService.getVaccinesBaby(this.bebeId).subscribe((response)=>{
        const vacinasSet = new Set(response); 
        this.vacinasBaby = Array.from(vacinasSet);
        this.vacinas.sort((a: { idadeNecessaria: number; }, b: { idadeNecessaria: number; }) => a.idadeNecessaria - b.idadeNecessaria);
      })
    }else{
      window.history.back();
    }
    
  }

  deleteVacina(vacinaId: number, link:string){
    this.profissionalService.deleteVaccines(vacinaId, this.bebeId, link);
  }

  toggleDetails(vaccine: any): void {
    vaccine.expanded = !vaccine.expanded;
  }

  getBaby(){
    if(this.bebeId !== 0){
    this.profissionalService.getOneBaby(this.bebeId).subscribe((response) =>{
      this.baby = response;
    })
  }else{
    window.history.back();
  }
  }

  getVacinas() {
    if(this.bebeId !== 0){
      this.profissionalService.getVaccines().subscribe((response) => {
        const vacinasSet = new Set(response); 
        this.vacinas = Array.from(vacinasSet);
        this.vacinas.sort((a: { idadeNecessaria: number; }, b: { idadeNecessaria: number; }) => a.idadeNecessaria - b.idadeNecessaria);
    });
    }else{
      window.history.back();
    }
    
}

  
}
