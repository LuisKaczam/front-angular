import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GestanteService } from '../gestante.service';

@Component({
  selector: 'app-bottom-navbar-gestante',
  templateUrl: './bottom-navbar-gestante.component.html',
  styleUrls: ['./bottom-navbar-gestante.component.css']
})
export class BottomNavbarGestanteComponent {
  gestante:any;
  avatar:string = '';

  list = [
    { name: 'Perfil', icon: 'fas fa-user', route: '/profile-gestante'},
    { name: 'Home', icon: 'fas fa-home', route: this.setHome()},
    { name: 'Publicações', icon: 'fas fa-newspaper', route: '/gestante-profissionais' },
    { name: 'Calendário', icon: 'fas fa-calendar-day', route: '/list-gestante-calendar' },
];

  
  constructor(private router: Router, private service: GestanteService) {}

  ngOnInit(): void {
    this.getGestante()
  }

  setHome(){
    const baby =  localStorage.getItem('baby')!;
    let route;
    if(parseInt(baby) != 0){
     route = '/gestante';
    }else{
     route = '/infos-gestante';
    }
    return route;
 
   }

  navigateTo(item: any) {
    this.router.navigate([item.route]);
  }

  getGestante(){
    this.service.getGestante().subscribe(response=>{
      if(response){
      this.gestante = response;
      if(this.gestante.usuario.profilePhoto != ''){
        this.avatar = this.gestante.usuario.profilePhoto;
      }
      }
    })
  }
}
