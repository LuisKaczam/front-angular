import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfissionalService } from '../../profissional/profissional.service';
import { catchError } from 'rxjs';
import { SendEmail } from 'src/app/entities/recoveryPassword';
import { GestanteService } from '../gestante.service';
import { SwPush } from '@angular/service-worker';
import { PushNotificationService } from 'src/app/push-notification.service';

@Component({
  selector: 'app-login-gestante',
  templateUrl: './login-gestante.component.html',
  styleUrls: ['./login-gestante.component.css']
})
export class LoginGestanteComponent {
  loginGestanteForm!: FormGroup;
  invalidCredentials: boolean = false;
  passwordModal:boolean = false;
  errorEmail:boolean = false;
  confirmEmail:boolean = false;

  constructor(private router: Router, private service: ProfissionalService, private gestanteService:GestanteService, private swPush: SwPush, private pushService: PushNotificationService){}


  ngOnInit(): void {
    this.loginGestanteForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    })
  }

  get email(){
    return this.loginGestanteForm.get('email')!;
  }

  get password(){
    return this.loginGestanteForm.get('password')!;
  }

  onModalOpen() {
    this.passwordModal = true;
  }

  onModalClose() {
    const modal = document.getElementById('passwordModal');
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
    const formLogin = this.loginGestanteForm!;
    const email = formLogin.get('email')!;
    const randomPassword = this.generateRandomPassword();
    const message = "Caro(a) " + email.value + ", você realizou a recuperação de senha no SisGestante portanto, utilize a seguinte senha para acessar o sistema: " + randomPassword +
                    "\nLembre-se de alterar sua senha imediatamente. \n\n Att. App SisGestante.";
    if(email.value == ''){
      return;
    }
    this.gestanteService.updateUserPassword(email.value, randomPassword).pipe(
      catchError((errorResponse) => {
        if (errorResponse.error === 'E-mail nao encontrado.') {
          this.errorEmail = true
      
        }
        else {
          console.error('Erro ao Cadastrar:', errorResponse);
        }
        console.log(errorResponse);
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
            console.log(errorResponse);
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
    const loginEmail = this.loginGestanteForm.get('email')!
    const btnLogin = document.getElementById('btnLogin');
    const recoveryPasword = this.loginGestanteForm.get('password')!
    const divPasswordRec = document.getElementById('recoveryPassword')
    this.invalidCredentials = false;
  
    if(loginEmail.value != '' && loginEmail.valid){
      divPasswordRec?.classList.remove('invisible')
    }else{
      divPasswordRec?.classList.add('invisible')
    }
  
    if((loginEmail.value != '' && loginEmail.valid) && (recoveryPasword.value != '' && recoveryPasword.valid)){
      btnLogin?.removeAttribute('disabled');
      btnLogin?.classList.remove('btn-enter');
    }else{
      btnLogin?.setAttribute('disabled', '');
      btnLogin?.classList.add('btn-enter');
    }
  }


  loginGestante(){
    const loginForm = this.loginGestanteForm;
    const email = loginForm.get('email')!;
    const password = loginForm.get('password')!;
    if(this.loginGestanteForm.invalid){
      return;
    }

    this.gestanteService.loginGestante(email.value, password.value)
    .pipe(
      catchError((error) => {
        if (error) {
          this.invalidCredentials = true;
        } else {
          console.error('Erro ao efetuar login: ', error);
        }
        return [];
      })
    ).subscribe(async (response) => {
      if (response && response.token && response.role) {
        const token = response.token;
        const role = response.role;
        const id = response.id;
        const baby = response.baby;
        const userId = response.idUser;
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('id', id);
        localStorage.setItem('idUser', userId);
        localStorage.setItem('baby', baby);
        if (this.swPush.isEnabled) {
          await this.pushService.updateUrl(userId);
          if(baby != 0){
            this.router.navigate(['/gestante']);
          }else{
            this.router.navigate(['/infos-gestante']);
          }
         } else {
          if(baby != 0){
            this.router.navigate(['/gestante']);
          }else{
            this.router.navigate(['/infos-gestante']);
          }
           
       
         }
      }
    });
  }
   
  }


