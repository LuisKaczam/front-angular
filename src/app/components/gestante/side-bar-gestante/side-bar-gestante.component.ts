import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GestanteService } from '../gestante.service';

@Component({
  selector: 'app-side-bar-gestante',
  templateUrl: './side-bar-gestante.component.html',
  styleUrls: ['./side-bar-gestante.component.css']
})
export class SideBarGestanteComponent implements OnInit{
  @Input() sideNavStatus = false;
  gestante: any;
  avatar: string = '';
  babies: any[] = [];
  hasBaby: boolean = false;
  list: any[] = [];
  icon:string = 'fa-solid fa-user';

  constructor(private router: Router, private service: GestanteService) {}

  ngOnInit(): void {
    this.getGestante();
    this.getBabies();
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
      { name: 'Perfil', icon: this.icon, route: '/profile-gestante' },
      { name: 'Home', icon: 'fas fa-home', route: route },
      { name: 'Publicações', icon: 'fas fa-newspaper', route: '/gestante-profissionais' },
      { name: 'Calendário', icon: 'fas fa-calendar-day', route: '/list-gestante-calendar' },
    ];
  }

  navigateTo(item: any) {
    this.router.navigate([item.route]);
  }

  getGestante(){
    this.setHome();
    this.service.getGestante().subscribe(response=>{
      if(response){
      this.gestante = response;
      if(this.gestante.usuario.profilePhoto.startsWith('https://firebasestorage')){
        this.avatar = this.gestante.usuario.profilePhoto;
        for(let i = 0; i < this.list.length; i++){
          if(this.list[i].icon == 'fa-solid fa-user'){
            this.list[i].icon = '';
            this.icon = '';
          }

          if(this.list[i].name == 'Perfil'){
            this.list[i].icon = '';
            this.icon = '';
          }
        }
      }
      }
    })
  }
}
