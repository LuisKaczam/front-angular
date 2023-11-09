import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Gestante } from 'src/app/entities/Gestante';
import { ValidatePasswordService } from 'src/app/validate-password.service';
import { SidebarService } from '../../sidebar/sidebar.service';
import { GestanteService } from '../gestante.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-profile-gestante',
  templateUrl: './profile-gestante.component.html',
  styleUrls: ['./profile-gestante.component.css']
})
export class ProfileGestanteComponent {
  sideNavStatus = false;
  gestante: any;
  avatar:any = 'https://cdn-icons-png.flaticon.com/128/1946/1946429.png';
  inputEmail!: FormGroup;
  inputPassword!: FormGroup;
  passwordSuccess:boolean = false;
  emailSuccess:boolean = false;
  emailModal:boolean = false;
  passwordModal:boolean = false;
  deleteModal:boolean = false;
  passwordError: boolean = false;
  babies: any[] = [];

  

  constructor(private sideBarService: SidebarService, private service: GestanteService, private router: Router) {
    this.sideBarService.getSideNavStatus().subscribe(status => {
      this.sideNavStatus = status;
    });
  }
  ngOnInit(): void {
    this.noSideBar();
    this.getGestante();
    this.getBabies();
    this.inputEmail = new FormGroup({
      newEmail: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
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
      console.log("Aqui")
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

   onModalDeleteOpen() {
    this.deleteModal = true;
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

  updatePassword(){
    const formUpdatePassword = this.inputPassword;
    const newPassword = formUpdatePassword.get('newPassword')!;
    const oldPassword = this.gestante.usuario.password;
    const confirm =formUpdatePassword.get('confirmPassword')!;

    if(formUpdatePassword.invalid){
      return;
    }else{
      this.service.updateGestantePassword(this.gestante.usuario.email, oldPassword, newPassword.value).pipe(
        catchError((error)=>{
          console.log(error);
        if(error){
          this.passwordError = true;
        }
        return[]
      })
      ).subscribe((response) =>{
        if(response){
          this.passwordSuccess = true;
          setTimeout(() => {
            document.getElementById('closePassword')?.click();
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
      this.service.updateEmail(newEmail?.value, password?.value, this.gestante.usuario.id).pipe(
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
            this.service.loginGestante(newEmail?.value, password?.value).subscribe((response) =>{
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

  

  getGestante(){
    this.service.getGestante().subscribe(response=>{
      if(response){
      this.gestante = response;
     
      }
    })
  }

  getBabies() {
    this.service.listBebes().subscribe((response) => {
      this.babies = response;
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const nameId = this.gestante.usuario.name + this.gestante.usuario.id;
    if (file) {
        this.gestante.photo = file;
        const updateGestante = new Gestante()
        updateGestante.name = this.gestante.usuario.name;
        updateGestante.cpf = this.gestante.usuario.cpf;
        updateGestante.email = this.gestante.usuario.email;
        updateGestante.password = this.gestante.usuario.password;
        updateGestante.id = this.gestante.usuario.id;
        this.service.updateUserPhoto(updateGestante, file, nameId);
      };
    }

    deleteGestante(){
      this.service.deleteGestante(this.gestante.usuario.id, this.gestante.usuario.profilePhoto, this.babies);
    }

    logout() {
      this.service.logout();
    }
}
