import { AfterContentInit, Component, OnInit } from '@angular/core';
import { PushNotificationService } from './push-notification.service';
import { NavigationEnd, Router } from '@angular/router';
import { SidebarService } from './components/sidebar/sidebar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterContentInit {
  title = 'Sisgestante';
  sideNavStatus = false;
  userRole!: string;

  constructor(private pushService: PushNotificationService, private router: Router, 
    private sideBarService: SidebarService, private pushNotification: PushNotificationService) {
    this.sideBarService.getSideNavStatus().subscribe((status) => {
      this.sideNavStatus = status;
    });
  }

  ngOnInit(): void {

  }

  ngAfterContentInit(): void {
    this.noSideBar();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.chooseHeader();
      }
    });
    this.getPush();
    this.pushService.receiveNotification();
  }

  getPush() {
    const userId = Number(localStorage.getItem('idUser'));
    if (userId !== 0) {
      this.pushService.notificationSub();
    }
  }

 

  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }
  }

  chooseHeader() {
    const headerGestante = document.getElementById('header-gestante');
    const headerProfissional = document.getElementById('header-profissional');
    const bottomGestante = document.getElementById('bottom-gestante');
    const bottomProfissional = document.getElementById('bottom-profissional');
    const role = localStorage.getItem('role');

    if (this.router.url === '/login-gestante' ||this.router.url === '/' ||this.router.url === '/login-profissional' ||this.router.url === '/register' ||this.router.url === '' ||this.router.url === '/not-found') {
      headerGestante?.classList.add('d-none');
      headerProfissional?.classList.add('d-none');
      bottomGestante?.classList.add('d-none');
      bottomProfissional?.classList.add('d-none');
    } else {
      if (role) {
        this.userRole = role;
        console.log("Role ", this.userRole)
        if (role === 'GESTANTE') {
          headerProfissional?.classList.add('d-none');
          bottomProfissional?.classList.add('d-none');
          headerGestante?.classList.remove('d-none');
          bottomGestante?.classList.remove('d-none');
        } else if (role === 'PROFISSIONAL') {
          headerGestante?.classList.add('d-none');
          bottomGestante?.classList.add('d-none');
          headerProfissional?.classList.remove('d-none');
          bottomProfissional?.classList.remove('d-none');
        }
      } else {
        window.location.reload();
      }
    }
  }
}
