import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfissionalService } from '../profissional/profissional.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() sideNavStatus = false;
  

  list = [
    {
      number: '1',
      name: 'home',
      icon: 'fa-solid fa-house',
      route: '/home'
    },
    {
      number: '2',
      name: 'perfil',
      icon: 'fa-solid fa-user',
      route: '/perfil'
    },
    {
      number: '3',
      name: 'publicações',
      icon: 'fa-regular fa-newspaper',
      route: '/publicacoes'
    },
    {
      number: '4',
      name: 'Calendário',
      icon: 'fa-solid fa-calendar-days',
      route: '/calendario'
    },
  ]
 avatar:string='';
 private profissional:any


  ngOnInit(): void {
      this.getProfissional();
  }


  constructor(private router: Router, private service: ProfissionalService){}

  navigateToPage(route: string): void {
    this.router.navigateByUrl(route);
  }
  getProfissional(){
    this.service.getProfissional().subscribe(response=>{
      if(response){
      this.profissional = response;
      if(this.profissional.usuario.profilePhoto != ''){
        this.avatar = this.profissional.usuario.profilePhoto;
        for(let i = 0; i < this.list.length; i++){
          if(this.list[i].icon == 'fa-solid fa-user'){
            this.list[i].icon = '';
          }

          if(this.list[i].name == 'perfil'){
            this.list[i].icon = '';
          }
        }
      }
      console.log(this.profissional);
      }
    })
  }


}
