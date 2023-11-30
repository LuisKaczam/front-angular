import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfissionalService } from '../profissional/profissional.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { SendEmail } from 'src/app/entities/recoveryPassword';
import { SwPush } from '@angular/service-worker';
import { PushNotificationService } from 'src/app/push-notification.service';

@Component({
  selector: 'app-login-interface',
  templateUrl: './login-interface.component.html',
  styleUrls: ['./login-interface.component.css']
})
export class LoginInterfaceComponent implements OnInit {
  loginForm !: FormGroup;
  invalidCredentials: boolean = false;
  passwordModal: boolean = false;
  confirmEmail: boolean = false;
  errorEmail:boolean = false;

  constructor(private service: ProfissionalService, private router: Router, private swPush: SwPush, private pushService: PushNotificationService){}


  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    })
    
  }

  get email(){
    return this.loginForm.get('email')!;
  }

  get password(){
    return this.loginForm.get('password')!;
  }

  onModalOpen() {
    this.passwordModal = true;
  }

  clickCloseNotification(){
    this.pushService._updateIconNotification$.next();
  }
  
  onModalClose() {
    const modal = document.getElementById('passwordModal');
    this.confirmEmail = false;
    this.errorEmail = false;
    if (modal) {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');

  }
  
  }

  generateRandomPassword(): string {
    const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_+=<>?';
    const passwordLength = 8;
    let password = '';
  
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * CHARACTERS.length);
      const randomChar = CHARACTERS.charAt(randomIndex);
      password += randomChar;
    }
  
    return password;
  }

  recoveryPassword(){
    const formLogin = this.loginForm!;
    const email = formLogin.get('email')!;
    const randomPassword = this.generateRandomPassword();
    const message = "Caro(a) " + email.value + ", você realizou a recuperação de senha no SisGestante portanto, utilize a seguinte senha para acessar o sistema: " + randomPassword +
                    "\nLembre-se de alterar sua senha imediatamente. \n\n Att. App SisGestante.";
    if(email.value == ''){
      return;
    }
    this.service.updateUserPassword(email.value, randomPassword).pipe(
      catchError((errorResponse) => {
        if (errorResponse.error === 'E-mail nao encontrado.') {
          this.errorEmail = true
      
        }
        else {
          console.error('Erro ao alterar senha: :', errorResponse);
        }
      return [];
    })
    
    )
    .subscribe((response) => {
      if (response){
        const recoveryPasswordEmail = new SendEmail();
        recoveryPasswordEmail.ownerRef = email.value;
        recoveryPasswordEmail.msgAuthor = "sisgestante@gmail.com";
        recoveryPasswordEmail.receiver = email.value;
        recoveryPasswordEmail.title = "Recuperação de Senha";
        recoveryPasswordEmail.bodyMessage = message;
        this.service.sendEmailRecoveryPassword(recoveryPasswordEmail).pipe(
          catchError((errorResponse) => {
            if (errorResponse.error === 'E-mail nao encontrado.') {
              this.errorEmail = true
          
            }
            else {
              console.error('Erro ao enviar e-mail: ', errorResponse);
            }
          return [];
        })
        
        ).subscribe(() =>{
          this.confirmEmail = true;
          setTimeout(() => {
            document.getElementById('btnClose')?.click();
            this.onModalClose();
          }, 3000);
        })

      }
    });
  }


  inputChange(){
    const loginEmail = this.loginForm.get('email')!
    const btnLogin = document.getElementById('btnLogin');
    const recoveryPasword = this.loginForm.get('password')!
    const divPasswordRec = document.getElementById('recoveryPassword')
    this.invalidCredentials = false;
  
    if(loginEmail.value != '' && loginEmail.valid){
      divPasswordRec?.classList.remove('d-none')
    }else{
      divPasswordRec?.classList.add('d-none')
    }
  
    if((loginEmail.value != '' && loginEmail.valid) && (recoveryPasword.value != '' && recoveryPasword.valid)){
      btnLogin?.removeAttribute('disabled');
      btnLogin?.classList.remove('btn-enter');
    }else{
      btnLogin?.setAttribute('disabled', '');
      btnLogin?.classList.add('btn-enter');
    }
  }

  

  login(){
    const formLogin = this.loginForm!;
    const email = formLogin.get('email')!;
    const password = formLogin.get('password')!;
    if(this.loginForm.invalid){
      return;
    }

    this.service.loginProfissional(email.value, password.value)
    .pipe(
      catchError((error) => {
        if (error) {
          this.invalidCredentials = true;
        } else {
          console.error('Erro ao efetuar login: ', error);
        }
        return [];
      })
    ).subscribe(
        async response => {
          if (response && response.token && response.role) {
            const token = response.token;
            const role = response.role;
            const id = response.id;
            const userId = response.idUser;
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('id', id);
            localStorage.setItem('idUser', userId);
            await this.pushService.notificationSub();
            this.router.navigate(['/home']);
          }
        }            
      );
  }
  
  }
