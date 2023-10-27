import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../sidebar/sidebar.service';

@Component({
  selector: 'app-gestante',
  templateUrl: './gestante.component.html',
  styleUrls: ['./gestante.component.css']
})
export class GestanteComponent implements OnInit{

  sideNavStatus = false;


  constructor(private sideBarService: SidebarService) {
    this.sideBarService.getSideNavStatus().subscribe(status => {
      this.sideNavStatus = status;
    });
  }

  ngOnInit(): void {
      this.noSideBar()
  }

  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }
  }


}

