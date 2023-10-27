import { Component } from '@angular/core';
import { SidebarService } from '../../sidebar/sidebar.service';
import { GestanteService } from '../gestante.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-profissionais',
  templateUrl: './list-profissionais.component.html',
  styleUrls: ['./list-profissionais.component.css']
})
export class ListProfissionaisComponent {
  sideNavStatus = false;
  profissionaisArray: any;


  constructor(private sideBarService: SidebarService, private service: GestanteService, private router:Router) {
    this.sideBarService.getSideNavStatus().subscribe(status => {
      this.sideNavStatus = status;
    });
  }

 

  ngOnInit(): void {
      this.noSideBar();
      this.getProfissionais();
  }

  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }
  }

  getProfissionais(){
    this.service.getAllProfissionais().subscribe((response)=>{
      if(response){
        this.profissionaisArray = response;
      }
    })
  }

  infosProfissional(profissionalId:number){
    this.router.navigate(['/infos-meu-profissional'], { queryParams: { id: profissionalId }}); 
  }

}
