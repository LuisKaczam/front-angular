import { Component } from '@angular/core';
import { SidebarService } from '../../../sidebar/sidebar.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-recem-nascido',
  templateUrl: '../before-birth/recem-nascido.component.html',
  styleUrls: ['../before-birth/recem-nascido.component.css']
})
export class RecemNascidoComponent {
  sideNavStatus = false;
  isRegisterBebe = false;
  gestanteId: number = 0;

  constructor(private sideBarService: SidebarService, private route: ActivatedRoute, private router: Router) {
    this.sideBarService.getSideNavStatus().subscribe(status => {
      this.sideNavStatus = status;
    });

  }

  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }

    this.route.queryParams.subscribe(params => {
      this.gestanteId = parseInt(params['id']);
    })
  }

  navigateToNewBaby(){
     this.route.queryParams.subscribe(params => {
      this.gestanteId = parseInt(params['id']);
      this.router.navigate(['/add-baby'], { queryParams: { id: this.gestanteId } });
     })
  }

  
}
