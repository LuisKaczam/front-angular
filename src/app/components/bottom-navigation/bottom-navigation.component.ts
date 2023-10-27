import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfissionalService } from '../profissional/profissional.service';

@Component({
  selector: 'app-bottom-navigation',
  templateUrl: './bottom-navigation.component.html',
  styleUrls: ['./bottom-navigation.component.css']
})
export class BottomNavigationComponent implements OnInit {
  profissional:any;
  avatar:string = '';

  list = [
    { name: 'Perfil', icon: 'fas fa-user', route: '/perfil' },
    { name: 'Home', icon: 'fas fa-home', route: '/home' },
    { name: 'Publicações', icon: 'fas fa-newspaper', route: '/publicacoes' },
    { name: 'Calendário', icon: 'fas fa-calendar-day', route: '/calendario' },
];

  
  constructor(private router: Router, private service: ProfissionalService) {}
  ngOnInit(): void {
    this.getProfissional()
  }

  navigateTo(item: any) {
    this.router.navigate([item.route]);
  }

  getProfissional(){
    this.service.getProfissional().subscribe(response=>{
      if(response){
      this.profissional = response;
      if(this.profissional.usuario.profilePhoto != ''){
        this.avatar = this.profissional.usuario.profilePhoto;
      }
      console.log(this.profissional);
      }
    })
  }
}
