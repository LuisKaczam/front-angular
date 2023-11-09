import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SidebarService } from 'src/app/components/sidebar/sidebar.service';
import { ProfissionalService } from '../../../profissional.service';

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

 

  constructor(private sideBarService: SidebarService, private route: ActivatedRoute, private profissionalService: ProfissionalService) {
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
  }

  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }
   
  }

  toggleDetails(vaccine: any): void {
    vaccine.expanded = !vaccine.expanded;
  }

  getBaby(){
    this.profissionalService.getOneBaby(this.bebeId).subscribe((response) =>{
      this.baby = response;
      console.log(this.baby)
    } )
  }

  getVacinas() {
    this.profissionalService.getVaccines().subscribe((response) => {
        const vacinasSet = new Set(response); 
        this.vacinas = Array.from(vacinasSet);
        this.vacinas.sort((a: { idadeNecessaria: number; }, b: { idadeNecessaria: number; }) => a.idadeNecessaria - b.idadeNecessaria);
        console.log(this.vacinas);
    });
}

  
}
