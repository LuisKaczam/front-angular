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
  vaccines = [
    {
      name: 'BCG',
      pdfLink: 'link_to_bcg_pdf',
      date: '10/01/23',
      dose: 'Dose 1',
      expanded: false
    },
    {
      name: 'Hepatite B',
      pdfLink: 'link_to_hepatite_pdf',
      date: '15/02/23',
      dose: 'Dose 1',
      expanded: false
    }
  ];

  toggleDetails(vaccine: any): void {
    vaccine.expanded = !vaccine.expanded;
  }

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
  }

  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }
   
  }

  getBaby(){
    this.profissionalService.getOneBaby(this.bebeId).subscribe((response) =>{
      this.baby = response;
      console.log(this.baby)
    } )
  }
}
