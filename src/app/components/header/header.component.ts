import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  nameLink: string = "Cadastrar-se";

  constructor(private router: Router) {}

  isLoginOrRegisterRoute(): string {
    if (this.router.url === '/register') {
      return 'Login';
    } else {
      return 'Cadastrar-se';
    }
  }

  navigateToLoginOrRegister(): void {
    if (this.router.url === '/register') {
      this.router.navigateByUrl('/login-profissional');
    } else {
      this.router.navigateByUrl('/register');
    }
  }

  isModalOpen: boolean = false;
  

  onModalOpen() {
    this.isModalOpen = true;
  }

  onModalClose() {
    this.isModalOpen = false;
  }

}
