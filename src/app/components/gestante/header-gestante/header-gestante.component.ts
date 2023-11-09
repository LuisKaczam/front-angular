import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Notificacoes } from 'src/app/entities/Notificacoes';
import { SidebarService } from '../../sidebar/sidebar.service';
import { ProfissionalService } from '../../profissional/profissional.service';
import { Router } from '@angular/router';
import { GestanteService } from '../gestante.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header-gestante',
  templateUrl: './header-gestante.component.html',
  styleUrls: ['./header-gestante.component.css']
})
export class HeaderGestanteComponent implements OnInit{
  @Output() sideNavToggled = new EventEmitter<boolean>();
  isNotificationsOpen = false;
  allNotifications: any[] = [];
  notificationsSub!: Subscription
  unread:any[] = [];
  numberOfNotifications: number = 0;

 

  constructor(private sideBarService: SidebarService, 
    private gestanteService: GestanteService,
    private profissionalService: ProfissionalService,
    private router: Router) {}

  ngOnInit(): void {
    this.getNotifications();
    this.getUnreadNotifications();
    this.notificationsSub = this.profissionalService._notificationGestante$.subscribe(() =>{
      this.getNotifications();
      this.getUnreadNotifications();
    })

    this.gestanteService._notification$.subscribe(() =>{
      this.getNotifications();
      this.getUnreadNotifications();
    })
   
  }

  toggleNotificationsMenu() {
    if(this.isNotificationsOpen == false){
      this.isNotificationsOpen = true;
      this.update();
    }else{
      this.closeNotificationsMenu();
    }
  }

  closeNotificationsMenu() {
    this.isNotificationsOpen = false;
  }

  getNotifications(){
    this.gestanteService.getAllNotifications().subscribe((response) =>{
      this.allNotifications = response
    });
    
  }

  getUnreadNotifications(){
    this.gestanteService.getNotifications().subscribe((response) =>{
      this.unread = response
      this.numberOfNotifications = this.unread.length;
    })
    
  }

  update(){
    const updateNotifications = new Notificacoes();
    for(let i = 0; i < this.allNotifications.length; i++){
      if(this.allNotifications[i].lidaGestante === false){
        updateNotifications.descricaoGestante = this.allNotifications[i].descricaoGestante;
        updateNotifications.tipoGestante = this.allNotifications[i].tipoGestante;
        updateNotifications.tituloGestante = this.allNotifications[i].tituloGestante;
        updateNotifications.lidaGestante = true;
        this.gestanteService.updateNotifications(this.allNotifications[i].id, updateNotifications).subscribe((response)=>{
          console.log("update");
        })
    }
    }
  }

  toggleSidebar(): void {
    this.sideBarService.toggleSideNav();
    this.sideNavToggled.emit(this.sideBarService.isSideNavOpen());
  }

  

  logout(){
    this.gestanteService.logout();
  }
}
