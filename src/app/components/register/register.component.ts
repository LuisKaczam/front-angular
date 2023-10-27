import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfissionalService } from '../profissional/profissional.service';
import { Profissional } from '../../entities/Profissional';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { catchError } from 'rxjs';
import { ValidatePasswordService } from 'src/app/validate-password.service';
import { ConfirmPasswordService } from 'src/app/confirm-password.service';
import { SwPush } from '@angular/service-worker';
import { PushNotificationService } from 'src/app/push-notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  profissional = new Profissional();
  profissionais: Profissional[] = [];
  formRegister!: FormGroup;
  emailInUse: boolean = false;
  cpfInvalid: boolean = false;

  constructor(private router: Router, private service: ProfissionalService, private swPush: SwPush, private pushService:PushNotificationService) { }

  ngOnInit(): void {
    this.formRegister = new FormGroup(
      {
        profissionalName: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          this.noWhitespaceValidator(),
        ]),
        profissionalEmail: new FormControl('', [
          Validators.required,
          Validators.email,
        ]),
        profissionalPassword: new FormControl('', [
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
        profissionalCpf: new FormControl('', [Validators.required]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      [
        ValidatePasswordService.PasswordMatches('profissionalPassword', 'confirmPassword'),
      ]
    );
  }

  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace && control.value.length > 0 ? { whitespace: true } : null;
    };
  }

  formatarCpf(event: any) {
    let cpf = event.target.value;
    cpf = cpf.replace(/\D/g, '');
    let formattedCpf = '';

    for (let i = 0; i < cpf.length; i++) {
      if (i === 3 || i === 6) {
        formattedCpf += '.';
      } else if (i === 9) {
        formattedCpf += '-';
      }
      formattedCpf += cpf[i];
    }
    this.formRegister.get('profissionalCpf')!.setValue(formattedCpf);
  }


  routeToLogin(): void {
    this.router.navigateByUrl('/login-profissional');
  }

  register(): void {
    const registerForm = this.formRegister;
    const name = registerForm.get('profissionalName');
    const email = registerForm.get('profissionalEmail');
    const password = registerForm.get('profissionalPassword');
    const cpf = registerForm.get('profissionalCpf');
  
    if (registerForm.invalid) {
      return;
    } else {
      this.profissional = new Profissional();
      this.profissional.name = name?.value;
      this.profissional.email = email?.value;
      this.profissional.password = password?.value;
      this.profissional.cpf = cpf?.value;
      
      this.service.registerProfissional(this.profissional).pipe(
        catchError((errorResponse) => {
          if (errorResponse.error === 'CPF Inválido.') {
            cpf!.setErrors({ cpfInvalid: true });
          }
          if (errorResponse.error === 'E-mail já em uso.') {
            email!.setErrors({ emailInUse: true });
          }
          if (errorResponse.error.errors) {
            for (let i = 0; i < errorResponse.error.errors.length; i++) {
              if (errorResponse.error === 'E-mail já em uso.') {
                email!.setErrors({ emailInUse: true });
              } else if (errorResponse.error.errors[i].defaultMessage === 'Name is mandatory') {
                name!.setErrors({ nameInvalid: true });
              } else if (errorResponse.error === 'CPF Inválido.' || errorResponse.error.errors[i].defaultMessage === 'CPF is Invalid') {
                cpf!.setErrors({ cpfInvalid: true });
              } else {
                console.error('Erro ao Cadastrar:', errorResponse);
              }
              console.log(errorResponse);
            }
          }
          return [];
        })
      ).subscribe(async (response) => {
        if (response && response.token && response.role) {
          const token = response.token;
          const role = response.role;
          const id = response.id;
          const userId = response.idUser;
          localStorage.setItem('token', token);
          localStorage.setItem('role', role);
          localStorage.setItem('id', id);
          localStorage.setItem('idUser', userId);
          if (this.swPush.isEnabled) {
           await this.pushService.updateUrl(userId);
           this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/home']);
            
        
          }
        }
      });
    }
  }
  
}
