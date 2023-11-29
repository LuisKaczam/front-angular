import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GestanteService } from '../gestante.service';
import { PushNotificationService } from 'src/app/push-notification.service';

@Component({
  selector: 'app-bottom-navbar-gestante',
  templateUrl: './bottom-navbar-gestante.component.html',
  styleUrls: ['./bottom-navbar-gestante.component.css']
})
export class BottomNavbarGestanteComponent implements OnInit {
  gestante: any;
  avatar: string = '';
  babies: any[] = [];
  hasBaby: boolean = false;
  list: any[] = [];

  constructor(private router: Router, private pushNotification: PushNotificationService, private service: GestanteService) {}

  ngOnInit(): void {
    this.getGestante();
    this.getBabies();
  }

  clickCloseNotification(){
    this.pushNotification._updateIconNotification$.next();
  }

  getBabies() {
    this.service.listBebes().subscribe((response) => {
      this.babies = response;
      if (this.babies.length > 0) {
        this.hasBaby = true;
      }

      this.setHome();
    });
  }

  setHome() {
    const baby = localStorage.getItem('baby')!;
    let route;

    if (parseInt(baby) != 0 || this.babies.length > 0) {
      route = '/gestante';
    } else {
      route = '/infos-gestante';
    }

    this.list = [
      { name: 'Perfil', icon: 'fas fa-user', route: '/profile-gestante' },
      { name: 'Home', icon: 'fas fa-home', route: route },
      { name: 'Publicações', icon: 'fas fa-newspaper', route: '/gestante-profissionais' },
      { name: 'Calendário', icon: 'fas fa-calendar-day', route: '/list-gestante-calendar' },
    ];
  }

  navigateTo(item: any) {
    this.router.navigate([item.route]);
  }

  getGestante() {
    this.service.getGestante().subscribe((response) => {
      if (response) {
        this.gestante = response;
        if (this.gestante.usuario.profilePhoto != '') {
          this.avatar = this.gestante.usuario.profilePhoto;
        }
      }
    });
  }
}
