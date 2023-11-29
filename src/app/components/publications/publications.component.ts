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
  post:any;
  deleteModalArticle:boolean = false;
  deleteModalVideo:boolean = false;
  deleteName!: string;
  key!:number;
  deleteFile!:string

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
    this.service._refresh$.subscribe(() => {
      this.getArticles();
      this.getVideos();
    });
  }

  onModalDeleteOpen(id: number, file: string, postName: string, event:any) {
    event.stopPropagation();
    this.key = id;
    this.deleteName = postName;
    this.deleteModalVideo = true;
    this.deleteFile = file;
  }

  onModalDeleteArticleOpen(id: number, file: string, postName: string, event:any) {
    event.stopPropagation();
    this.key = id;
    this.deleteName = postName;
    this.deleteModalArticle = true;
    this.deleteFile = file;
  }

  deleteVideo() {
      this.service.deleteVideos(this.key, this.deleteFile);
    
  }

  getGestantes() {
    this.service.listGestante().subscribe((response) => {
      this.gestantes = response;
    });
  }

  deleteArticle() {
    this.service.deleteArticles(this.key, this.deleteFile);
  
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

  onModalOpen(post: any) {
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
    const numGestantes = this.gestantesSelecionadas.length;
    const profissionalId = localStorage.getItem('id');
  
    for (let index = 0; index < numGestantes; index++) {
      const gestante = this.gestantesSelecionadas[index];
  
      this.service.sharePost(this.post, gestante.id).subscribe(() => {
        const notificacao = new Notificacoes();
        notificacao.descricaoProfissional = `compartilhado com ${gestante.usuario.name}`;
        notificacao.tipoProfissional = "Postagem";
        notificacao.tituloProfissional = `Novo Post ${this.post.titulo}`;
        notificacao.tipoGestante = "Po";
        notificacao.tituloGestante = `Novo Post ${this.post.titulo}`;
        notificacao.descricaoGestante = "Nova Postagem";
        notificacao.lidaGestante = false;
        notificacao.lidaProfissional = false;
        notificacao.linkGestante = 'https://sisgestante-d38c4.web.app/infos-meu-profissional?id=' + profissionalId;
        notificacao.linkProfissional = 'https://sisgestante-d38c4.web.app/publicacoes';
  
        this.service.newNotification(notificacao, gestante.id).subscribe(() => {
          this.pushService.getPwaObject(gestante.usuario.id).subscribe(async (response) => {
            const pwaObject = response;
            if (pwaObject) {
              for (let i = 0; i < pwaObject.length; i++) {
                this.service
                  .sendPushNotification(
                    notificacao.tituloGestante,
                    notificacao.descricaoGestante,
                    pwaObject[i]
                  )
                  .subscribe(() => {
                    window.location.reload();
                  });
              }
            } else {
              window.location.reload();
            }
          });
        });
      });
    }
  }
  
  
  
  
  

  getVideos() {
    this.service.listVideos().subscribe((response) => {
      this.postVideos = response;
      console.log(this.postVideos)
    });
  }

  getArticles() {
    this.service.listArticles().subscribe((response) => {
      this.postArticles = response;
      console.log(this.postArticles)
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
  
  clickCloseNotification(){
    this.pushService._updateIconNotification$.next();
  }

}
