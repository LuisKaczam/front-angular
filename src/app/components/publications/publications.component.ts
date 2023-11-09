import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from '../sidebar/sidebar.service';
import { Post } from 'src/app/entities/Posts';
import { ProfissionalService } from '../profissional/profissional.service';
import { Subscription, catchError } from 'rxjs';
import { Notificacoes } from 'src/app/entities/Notificacoes';
import { PushNotificationService } from 'src/app/push-notification.service';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css'],
})
export class PublicationsComponent implements OnInit {
  sideNavStatus = false;

  postVideos: any[] = [];
  postArticles: any[] = [];
  subscription!: Subscription;
  gestantes: any[] = [];
  searchTerm: string = '';
  filteredGestantes: any[] = this.gestantes
  foundedGestante: boolean = false;
  gestantesSelecionadas: any[] = [];
  isRegisterGestante: boolean = false;
  selectAllChecked: boolean = false;
  post = new Post();

  constructor(
    private sideBarService: SidebarService,
    private service: ProfissionalService,
    private pushService: PushNotificationService
  ) {
    this.sideBarService.getSideNavStatus().subscribe((status) => {
      this.sideNavStatus = status;
    });
  }
  ngOnInit(): void {
    this.noSideBar();
    this.getArticles();
    this.getVideos();
    this.getGestantes();
    this.subscription = this.service._refresh$.subscribe(() => {
      this.getArticles();
      this.getVideos();
    });
  }

  deleteVideo(id: number, file: string, postName: string) {
    if (confirm('Deseja realmente deletar: ' + postName)) {
      this.service.deleteVideos(id, file);
    }
  }

  getGestantes() {
    this.service.listGestante().subscribe((response) => {
      this.gestantes = response;
    });
  }

  deleteArticle(id: number, file: string, postName: string) {
    if (confirm('Deseja realmente deletar: ' + postName)) {
      this.service.deleteArticles(id, file);
    }
  }

  searchGestantes() {
    if(this.gestantes.length > 0 ){
    if (this.searchTerm === '') {
      this.filteredGestantes = this.gestantes;
      this.foundedGestante = false; 
    } else {
      this.filteredGestantes = this.gestantes.filter(gestante =>
        gestante.usuario.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.foundedGestante = this.filteredGestantes.length === 0;
    }
  }
  }


  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }
  }

  onModalOpen(post: Post) {
    this.isRegisterGestante = true;
    this.post = post;
  }

  onModalClose() {
    const modal = document.getElementById('formPosts');
    if (modal) {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');

  }
  }

  share() {
    this.gestantesSelecionadas.forEach(gestante => {
      this.service.sharePost(this.post, gestante.id).subscribe(response => {
        console.log("OK ", response);
  
        const notificacao = new Notificacoes();
        notificacao.descricaoProfissional = `Você compartilhou uma postagem com ${gestante.usuario.name}`;
        notificacao.tipoProfissional = "Postagem";
        notificacao.tituloProfissional = "Nova postagem";
        notificacao.tipoGestante = "Evento";
        notificacao.tituloGestante = "Novo evento";
        notificacao.lidaGestante = false;
        notificacao.lidaProfissional = false;
  
        this.service.newNotification(notificacao, gestante.id).subscribe(response => {
          this.pushService.getPwaObject(gestante.usuario.id).subscribe(pwa => {
            if (pwa) {
              console.log(pwa);
              this.service.sendPushNotification(
                notificacao.tituloGestante,
                notificacao.descricaoGestante,
                pwa
              );
            }
          });
  
          setTimeout(() => {
            document.getElementById('close-share')?.click();
          }, 2000);
        });
      });
    });
  }
  

  getVideos() {
    this.service.listVideos().subscribe((response) => {
      this.postVideos = response;
    });
  }

  getArticles() {
    this.service.listArticles().subscribe((response) => {
      this.postArticles = response;
    });
  }

  toggleGestanteSelection(gestante: any) {
    const sendBtn = document.getElementById('sendBtn');
    const selectCard = document.getElementById('selectGestante' + gestante.id )
    if (gestante.selected) {
      this.gestantesSelecionadas.push(gestante);
      selectCard?.classList.add('selectedborder');
      
    } else {
      const index = this.gestantesSelecionadas.indexOf(gestante);
      if (index !== -1) {
        this.gestantesSelecionadas.splice(index, 1);
      }
      selectCard?.classList.remove('selectedborder');
    }
    console.log(gestante);
      if(this.gestantesSelecionadas.length > 0){
        sendBtn?.classList.remove('invisible');
       
      }else{
        sendBtn?.classList.add('invisible');
    }
  }

  selectAllGestantes() {
    const sendBtn = document.getElementById('sendBtn');
    this.gestantes.forEach((gestante) => {
      gestante.selected = this.selectAllChecked;
      const selectCard = document.getElementById('selectGestante' + gestante.id )
      if (gestante.selected) {
        this.gestantesSelecionadas.push(gestante);
        selectCard?.classList.add('selectedborder');
      } else {
        const index = this.gestantesSelecionadas.indexOf(gestante);
        if (index !== -1) {
          this.gestantesSelecionadas.splice(index, 1);
        }
        selectCard?.classList.remove('selectedborder');
      }
    });
      if(this.gestantesSelecionadas.length > 0){
        sendBtn?.classList.remove('invisible')
        
      }else{
        sendBtn?.classList.add('invisible');
      }
    console.log(this.gestantesSelecionadas)
  }
  
  
}
