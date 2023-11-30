import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from 'src/app/components/sidebar/sidebar.service';
import { ProfissionalService } from '../../../profissional.service';
import { ModalService } from 'src/app/components/modals/modal.service';
import { PushNotificationService } from 'src/app/push-notification.service';
import { EncondingParamsService } from 'src/app/enconding-params.service';

@Component({
  selector: 'app-list-recem-nascido',
  templateUrl: './list-recem-nascido.component.html',
  styleUrls: ['./list-recem-nascido.component.css'],
})
export class ListRecemNascidoComponent {
  sideNavStatus = false;
  bebes: any[] = [];
  searchTerm: string = '';
  filteredBebes: any[] = this.bebes;
  foundedBebes: boolean = false;
  gestanteId: number = 0;

  constructor(
    private router: Router,
    private cryptService: EncondingParamsService,
    private route: ActivatedRoute,
    private pushNotification: PushNotificationService,
    private sideBarService: SidebarService,
    private serviceProfissional: ProfissionalService,
    private modalService: ModalService
  ) {
    this.sideBarService.getSideNavStatus().subscribe((status) => {
      this.sideNavStatus = status;
    });
    this.route.queryParams.subscribe((params) => {
      const encodedValue = params['id'];
      if (encodedValue) {
        this.gestanteId = parseInt(this.cryptService.decode(encodedValue));

        if (this.gestanteId === 0) {
          window.history.back();
        }
      }
    });
  }

  ngOnInit(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }

    this.getBebes();
  }

  infosBaby(babyId: number) {
    const encondeId = this.cryptService.encode(String(babyId));
    if (encondeId) {
      this.router.navigate(['/infos-recem-nascido'], {
        queryParams: { id: encondeId },
      });
    }
  }

  clickCloseNotification() {
    this.pushNotification._updateIconNotification$.next();
  }

  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }
  }
  getBebes(): void {
    if (this.gestanteId !== 0) {
      this.serviceProfissional
        .listBebes(this.gestanteId)
        .subscribe((response) => {
          this.bebes = response;
        });
    } else {
      window.history.back();
    }
  }

  newBebe() {
    const encondeId = this.cryptService.encode(String(this.gestanteId));
    if (encondeId) {
      this.router.navigate(['/add-baby'], {
        queryParams: { id: encondeId },
      });
    }
  }

  searchBabies() {
    if (this.bebes.length > 0) {
      if (this.searchTerm === '') {
        this.filteredBebes = this.bebes;
        this.foundedBebes = false;
      } else {
        this.filteredBebes = this.bebes.filter((bebe) => {
          const searchTermLower = this.searchTerm.toLowerCase();
          const nameLower = bebe.babyName.toLowerCase();
          return (
            nameLower.startsWith(searchTermLower) ||
            nameLower.includes(searchTermLower)
          );
        });
        this.foundedBebes = this.filteredBebes.length === 0;
      }
    }
  }


}

