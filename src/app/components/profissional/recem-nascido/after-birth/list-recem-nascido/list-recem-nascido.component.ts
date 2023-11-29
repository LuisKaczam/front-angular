import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from 'src/app/components/sidebar/sidebar.service';
import { ProfissionalService } from '../../../profissional.service';
import { ModalService } from 'src/app/components/modals/modal.service';
import { PushNotificationService } from 'src/app/push-notification.service';

@Component({
  selector: 'app-list-recem-nascido',
  templateUrl: './list-recem-nascido.component.html',
  styleUrls: ['./list-recem-nascido.component.css']
})
export class ListRecemNascidoComponent {
  sideNavStatus = false;
  bebes: any[] = [];
  searchTerm: string = '';
  filteredBebes: any[] = this.bebes;
  foundedBebes: boolean = false;
  gestanteId:number = 0;


  constructor(private router: Router, private route: ActivatedRoute, private pushNotification: PushNotificationService, private sideBarService: SidebarService, private serviceProfissional: ProfissionalService, private modalService: ModalService) {
    this.sideBarService.getSideNavStatus().subscribe(status => {
      this.sideNavStatus = status;
    });
   
    
  }



  ngOnInit(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }

    this.route.queryParams.subscribe(params => {
      this.gestanteId = parseInt(params['id']);
    })
    
    this.getBebes();
  }


infosBaby(babyId:number){
  this.router.navigate(['/infos-recem-nascido'], { queryParams: { id: babyId }}); 
}
 
clickCloseNotification(){
  this.pushNotification._updateIconNotification$.next();
}

  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }
  }
  getBebes(): void {
    this.serviceProfissional.listBebes(this.gestanteId).subscribe((response) =>{
      this.bebes = response;
    })
  }

  newBebe(){
    this.router.navigate(['/add-baby'], { queryParams: { id: this.gestanteId } });
  }



  searchGestantes() {
    if(this.bebes.length > 0 ){
    if (this.searchTerm === '') {
      this.filteredBebes = this.bebes;
      this.foundedBebes = false; 
    } else {
      this.filteredBebes = this.bebes.filter(bebes =>
        bebes.babyName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.foundedBebes = this.filteredBebes.length === 0;
    }
  }
  }
}
