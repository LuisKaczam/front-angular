import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from 'src/app/components/sidebar/sidebar.service';
import { ProfissionalService } from '../../../profissional.service';
import { PushNotificationService } from 'src/app/push-notification.service';

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

 

  constructor(private sideBarService: SidebarService, private pushNotification: PushNotificationService, private route: ActivatedRoute, private router: Router, private profissionalService: ProfissionalService) {
    this.sideBarService.getSideNavStatus().subscribe(status => {
      this.sideNavStatus = status;
    });
  }

  ngOnInit(): void {
    this.noSideBar();
    this.route.queryParams.subscribe(params => {
      this.bebeId = parseInt(params['id']);
    })
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
    this.router.navigate(['/new-vaccine'], { queryParams: { id: this.bebeId, name: this.baby.nome } });
  }

  getVaccinesBaby(){
    this.profissionalService.getVaccinesBaby(this.bebeId).subscribe((response)=>{
      const vacinasSet = new Set(response); 
      this.vacinasBaby = Array.from(vacinasSet);
      this.vacinas.sort((a: { idadeNecessaria: number; }, b: { idadeNecessaria: number; }) => a.idadeNecessaria - b.idadeNecessaria);
    })
  }

  deleteVacina(vacinaId: number, link:string){
    this.profissionalService.deleteVaccines(vacinaId, this.bebeId, link);
  }

  toggleDetails(vaccine: any): void {
    vaccine.expanded = !vaccine.expanded;
  }

  getBaby(){
    this.profissionalService.getOneBaby(this.bebeId).subscribe((response) =>{
      this.baby = response;
    } )
  }

  getVacinas() {
    this.profissionalService.getVaccines().subscribe((response) => {
        const vacinasSet = new Set(response); 
        this.vacinas = Array.from(vacinasSet);
        this.vacinas.sort((a: { idadeNecessaria: number; }, b: { idadeNecessaria: number; }) => a.idadeNecessaria - b.idadeNecessaria);
    });
}

  
}
