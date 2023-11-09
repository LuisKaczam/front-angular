import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GestanteService } from '../gestante.service';

@Component({
  selector: 'app-side-bar-gestante',
  templateUrl: './side-bar-gestante.component.html',
  styleUrls: ['./side-bar-gestante.component.css']
})
export class SideBarGestanteComponent {
  @Input() sideNavStatus = false;
  babies:any[] = [];
  hasBaby:boolean = false;
  

  list = [
    {
      number: '1',
      name: 'home',
      icon: 'fa-solid fa-house',
      route: this.setHome()
    },
    {
      number: '2',
      name: 'perfil',
      icon: 'fa-solid fa-user',
      route: '/profile-gestante'
    },
    {
      number: '3',
      name: 'publicações',
      icon: 'fa-regular fa-newspaper',
      route: '/gestante-profissionais'
    },
    {
      number: '4',
      name: 'Calendário',
      icon: 'fa-solid fa-calendar-days',
      route: '/list-gestante-calendar'
    },
  ]
 avatar:string='';
 gestante:any


  ngOnInit(): void {
      this.getGestante();
  }

 


  constructor(private router: Router, private service: GestanteService){}
  setHome(){
    const baby =  localStorage.getItem('baby')!;
    let route;
    if(parseInt(baby) != 0 || this.hasBaby === true){
     route = '/gestante';
    }else{
     route = '/infos-gestante';
    }
    return route;
 
   }

  navigateToPage(route: string): void {
    this.router.navigateByUrl(route);
  }
  getGestante(){
    this.service.getGestante().subscribe(response=>{
      if(response){
      this.gestante = response;
      if(this.gestante.usuario.profilePhoto != null){
        this.avatar = this.gestante.usuario.profilePhoto;
        for(let i = 0; i < this.list.length; i++){
          if(this.list[i].icon == 'fa-solid fa-user'){
            this.list[i].icon = '';
          }

          if(this.list[i].name == 'perfil'){
            this.list[i].icon = '';
          }
        }
      }
      }
    })
  }
  getBabies(){
    this.service.listBebes().subscribe((response)=>{
      this.babies = response;
      if(this.babies.length > 0){
        this.hasBaby = true;
      }
    })
  }
}
