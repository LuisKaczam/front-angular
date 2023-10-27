import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SidebarService } from '../sidebar/sidebar.service';
import { ProfissionalService } from '../profissional/profissional.service';
import { Router } from '@angular/router';
import { Notificacoes } from 'src/app/entities/Notificacoes';

@Component({
  selector: 'app-header-sidebar',
  templateUrl: './header-sidebar.component.html',
  styleUrls: ['./header-sidebar.component.css']
})
export class HeaderSidebarComponent implements OnInit{
  @Output() sideNavToggled = new EventEmitter<boolean>();
  isNotificationsOpen = false;
  allNotifications: any[] = [];
  unread:any[] = [];
  numberOfNotifications: number = 0;

 

  constructor(private sideBarService: SidebarService, 
    private profissionalService: ProfissionalService,
    private router: Router) {}

  ngOnInit(): void {
    this.getNotifications();
    this.getUnreadNotifications();
    this.profissionalService._updateNotification$.subscribe(() =>{
      this.getNotifications();
      this.getUnreadNotifications();
    })
    this.profissionalService._notification$.subscribe(() =>{
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
    this.profissionalService.getAllNotifications().subscribe((response) =>{
      this.allNotifications = response
    });
    
  }

  getUnreadNotifications(){
    this.profissionalService.getNotifications().subscribe((response) =>{
      this.unread = response
      this.numberOfNotifications = this.unread.length;
    })
    
  }

  update(){
    const updateNotifications = new Notificacoes();
    for(let i = 0; i < this.allNotifications.length; i++){
      if(this.allNotifications[i].lidaProfissional === false){
        updateNotifications.descricaoProfissional = this.allNotifications[i].descricaoProfissional;
        updateNotifications.tipoProfissional = this.allNotifications[i].tipoProfissional;
        updateNotifications.tituloProfissional = this.allNotifications[i].tituloProfissional;
        updateNotifications.lidaProfissional = true;
        this.profissionalService.updateNotifications(this.allNotifications[i].id, updateNotifications).subscribe((response)=>{
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
    this.profissionalService.logout();
    this.router.navigate(['/login-profissional']);
  }
}
