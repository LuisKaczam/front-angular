import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../sidebar/sidebar.service';
import { Profissional } from 'src/app/entities/Profissional';
import { ProfissionalService } from '../profissional/profissional.service';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ValidatePasswordService } from 'src/app/validate-password.service';
import { catchError } from 'rxjs';
import { PushNotificationService } from 'src/app/push-notification.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  sideNavStatus = false;
  profissional: any;
  avatar:any = 'https://cdn-icons-png.flaticon.com/128/1946/1946429.png';
  postVideos: any[] = [];
  postArticles: any[] = [];
  inputEmail!: FormGroup;
  inputPassword!: FormGroup;
  passwordSuccess:boolean = false;
  emailSuccess:boolean = false;
  emailModal:boolean = false;
  passwordModal:boolean = false;
  passwordError: boolean = false;
  deleteModal: boolean = false;
  inputPhone!: FormGroup;
  phoneSuccess:boolean = false;
  phoneModal:boolean = false;
  phoneError: boolean = false;

  

  constructor(private sideBarService: SidebarService, private pushNotification: PushNotificationService, private service: ProfissionalService, private router: Router) {
    this.sideBarService.getSideNavStatus().subscribe(status => {
      this.sideNavStatus = status;
    });
  }
  ngOnInit(): void {
    this.noSideBar();
    this.getProfissional();
    this.getArticles();
    this.getVideos();
    this.inputEmail = new FormGroup({
      newEmail: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });

    this.inputPhone = new FormGroup({
      phone: new FormControl('', [Validators.required, Validators.minLength(14)])
    });

    this.inputPassword = new FormGroup({
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
        ValidatePasswordService.PasswordValidator(/\d/, { hasNumber: true }),
        ValidatePasswordService.PasswordValidator(/[A-Z]/, {
          hasCapitalCase: true,
        }),
        ValidatePasswordService.PasswordValidator(/[a-z]/, {
          hasLowerCase: true,
        }),
        ValidatePasswordService.PasswordValidator(
          /[!@#$%^&*()_+{}\[\]:;<>,.?~\\|]/,
          { hasSpecialC: true }
        ),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    [
      ValidatePasswordService.PasswordMatches('newPassword', 'confirmPassword')
    ]
    );

    document.getElementById('close')?.addEventListener('click', ()=>{
        this.inputEmail = new FormGroup({
          newEmail: new FormControl('', [Validators.required, Validators.email]),
          password: new FormControl('', [Validators.required])
        });
      });
      document.getElementById('closePassword')?.addEventListener('click', ()=>{
        this.inputPassword = new FormGroup({
          newPassword: new FormControl('', [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(30),
            ValidatePasswordService.PasswordValidator(/\d/, { hasNumber: true }),
            ValidatePasswordService.PasswordValidator(/[A-Z]/, {
              hasCapitalCase: true,
            }),
            ValidatePasswordService.PasswordValidator(/[a-z]/, {
              hasLowerCase: true,
            }),
            ValidatePasswordService.PasswordValidator(
              /[!@#$%^&*()_+{}\[\]:;<>,.?~\\|]/,
              { hasSpecialC: true }
            ),
          ]),
          confirmPassword: new FormControl('', [Validators.required]),
        },
        [
          ValidatePasswordService.PasswordMatches('newPassword', 'confirmPassword')
        ]
        );
        });
  }

  onModalDeleteOpen() {
    this.deleteModal = true;
    }

  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }
  }


  onModalOpen() {
    this.emailModal = true;
    }

  onModalPasswordOpen() {
   this.passwordModal = true;
   }

   onModalPhoneOpen() {
    this.phoneModal = true;
    }

  onModalClose() {
    const modal = document.getElementById('emailModal');
    if (modal) {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      this.emailModal = false;
      const btnClose = document.getElementById('close');
      btnClose?.click();
  }

  }

  onModalPasswordClose() {
    const modal = document.getElementById('passwordModal');
    if (modal) {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      this.emailModal = false;
      
      const btnClose = document.getElementById('closePassword');
      btnClose?.click();
  }
  
  }

  onModalPhoneClose() {
    const modal = document.getElementById('phoneModal');
    if (modal) {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      this.emailModal = false;
      
      const btnClose = document.getElementById('closePhone');
      btnClose?.click();
  }
  
  }

  clickCloseNotification(){
    this.pushNotification._updateIconNotification$.next();
  }

  updatePhone(){
    const formUpdatePhone = this.inputPhone;
    const newPhone = formUpdatePhone.get('phone')!;
    if(formUpdatePhone.invalid){
      return;
    }else{
      const updateProfissional = new Profissional();
      updateProfissional.name = this.profissional.usuario.name;
      updateProfissional.cpf = this.profissional.usuario.cpf;
      updateProfissional.email = this.profissional.usuario.email;
      updateProfissional.password = this.profissional.usuario.password;
      updateProfissional.id = this.profissional.usuario.id;
      updateProfissional.phone = newPhone.value;
      updateProfissional.profilePhoto = this.profissional.usuario.profilePhoto
      this.service.updateProfissional(updateProfissional, this.profissional.usuario.id).pipe(
        catchError((error)=>{
          console.error("Erro ao atualizar usuario: ", error);
        if(error){
          this.phoneError = true;
        }
        return[]
      })
      ).subscribe((response) =>{
        if(response){
          this.phoneSuccess = true;
          setTimeout(() => {
            document.getElementById('closePhone')?.click();
          }, 5000);
        }
      })
    }
  }

  formatarTelefone(event: any) {
    let telefone = event.target.value;
    telefone = telefone.replace(/\D/g, '');
    let formattedTelefone = '';

    for (let i = 0; i < telefone.length; i++) {
      if (i === 0) {
        formattedTelefone += '(';
      } else if (i === 2) {
        formattedTelefone += ') ';
      } else if (i === telefone.length - 4) {
        formattedTelefone += '-';
      }
      formattedTelefone += telefone[i];
    }

    this.inputPhone.get('phone')!.setValue(formattedTelefone);
  }

  updatePassword(){
    const formUpdatePassword = this.inputPassword;
    const newPassword = formUpdatePassword.get('newPassword')!;
    const oldPassword = this.profissional.usuario.password;

    if(formUpdatePassword.invalid){
      return;
    }else{
      this.service.updateProfissionalPassword(this.profissional.usuario.email, oldPassword, newPassword.value).pipe(
        catchError((error)=>{
          console.error("Erro ao atualizar senha: ", error);
        if(error){
          this.passwordError = true;
        }
        return[]
      })
      ).subscribe((response) =>{
        if(response){
          this.passwordSuccess = true;
          setTimeout(() => {
            window.location.reload()
          }, 5000);
        }
      })
    }
  }

  updateEmailUser(){
    const emailForm = this.inputEmail!;
    const newEmail = emailForm.get('newEmail');
    const password = emailForm.get('password');
    if(emailForm.invalid){
      return;
    }else{
      this.service.updateEmail(newEmail?.value, password?.value, this.profissional.usuario.id).pipe(
        catchError((errorResponse) => {
          if ( errorResponse.error === "E-mail ja em uso.") {
            newEmail?.setErrors({ emailInUse: true });
          }

          if ( errorResponse.error === "Senha invalida.") {
            password?.setErrors({ passwordInvalid: true });
          }
    
        return [];
      })
      ).subscribe((response => {
        if (response) {
            this.service.loginProfissional(newEmail?.value, password?.value).subscribe((response) =>{
              if (response && response.token && response.role) {
                const token = response.token;
                const role = response.role;
                const id = response.id;
                localStorage.setItem('token', token);
                localStorage.setItem('role', role);
                localStorage.setItem('id', id);
                window.location.reload();
              }
            })
        }
      }))
    }
  }

  

  getProfissional(){
    this.service.getProfissional().subscribe(response=>{
      if(response){
      this.profissional = response;
      if(this.profissional.usuario.profilePhoto != ''){
        this.avatar = this.profissional.usuario.profilePhoto;
      }
      }
    })
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const nameId = this.profissional.usuario.name + this.profissional.usuario.id;
    if (file) {
        this.profissional.photo = file;
        const updateProfissional = new Profissional();
        updateProfissional.name = this.profissional.usuario.name;
        updateProfissional.cpf = this.profissional.usuario.cpf;
        updateProfissional.email = this.profissional.usuario.email;
        updateProfissional.password = this.profissional.usuario.password;
        updateProfissional.id = this.profissional.usuario.id;
        updateProfissional.phone = this.profissional.usuario.phone
        this.service.updateUserPhoto(updateProfissional, file, nameId);
      };
    }

    deleteProfissional(){
      const nameId = this.profissional.usuario.name + this.profissional.usuario.id;
      this.service.deleteProfissional(this.profissional.usuario.id, this.profissional.usuario.profilePhoto, this.postArticles, this.postVideos, nameId);
    }

    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      this.router.navigate(['/login']);
    }
  
}
