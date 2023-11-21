import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Gestante } from 'src/app/entities/Gestante';
import { ProfissionalService } from '../profissional.service';
import { catchError } from 'rxjs';
import { Router } from '@angular/router';
import { Profissional } from 'src/app/entities/Profissional';
import { ModalService } from '../../modals/modal.service';
import { SendEmail } from 'src/app/entities/recoveryPassword';

@Component({
  selector: 'app-form-register-gestante',
  templateUrl: './form-register-gestante.component.html',
  styleUrls: ['./form-register-gestante.component.css'],
})
export class FormRegisterGestanteComponent implements OnInit {
  gestante = new Gestante();

  formRegisterGestante!: FormGroup;

  currentStep: any = 1;
  errorEmail: boolean = false;
  errorName: boolean = false;
  errorCpf: boolean = false;
  errorSendEmail:boolean = false;
  isValidSum: boolean = true;
  private profissional = new Profissional();

  constructor(
    private service: ProfissionalService,
    private router: Router,
    private modal: ModalService
  ) {}

  ngOnInit(): void {
    
    this.currentStep = 1;
    this.formRegisterGestante = new FormGroup({
      gestanteName: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        this.noWhitespaceValidator(),
      ]),
      gestanteEmail: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      gestanteAddress: new FormControl(''),
      gestanteBirthDate: new FormControl('', [
        Validators.required,
        this.BirthDateValidator(),
      ]),
      gestantePhone: new FormControl('', [
        Validators.required,
        Validators.minLength(14),
      ]),
      gestanteCpf: new FormControl('', [Validators.required]),
      gestanteDum: new FormControl('', [Validators.required]),
      gestanteBloodType: new FormControl('', [Validators.required]),
      gestanteWeight: new FormControl('', [Validators.required]),
      gestanteHeight: new FormControl('', [Validators.required]),
      numberOfPregnancies: new FormControl(0, [Validators.required]),
      normalDeliveries: new FormControl(0, [Validators.required]),
      cesareanDeliveries: new FormControl(0, [Validators.required]),
      abortions: new FormControl(0, [Validators.required]),
      
    });
    this.getProfissional();

    if (this.formRegisterGestante) {
      this.modal.closeModalEvent.subscribe(() => {
        this.formRegisterGestante = new FormGroup({
          gestanteName: new FormControl('', [
            Validators.required,
            Validators.minLength(4),
            this.noWhitespaceValidator(),
          ]),
          gestanteEmail: new FormControl('', [
            Validators.required,
            Validators.email,
          ]),
          gestanteAddress: new FormControl(''),
          gestanteBirthDate: new FormControl('', [
            Validators.required,
            this.BirthDateValidator(),
          ]),
          gestantePhone: new FormControl('', [
            Validators.required,
            Validators.minLength(14),
          ]),
          gestanteCpf: new FormControl('', [Validators.required]),
          gestanteDum: new FormControl('', [Validators.required]),
          gestanteBloodType: new FormControl('', [Validators.required]),
          gestanteWeight: new FormControl('', [Validators.required]),
          gestanteHeight: new FormControl('', [Validators.required]),
          numberOfPregnancies: new FormControl(0, [Validators.required]),
          normalDeliveries: new FormControl(0, [Validators.required]),
          cesareanDeliveries: new FormControl(0, [Validators.required]),
          abortions: new FormControl(0, [Validators.required]),
          
        });
      });
      this.formRegisterGestante.valueChanges.subscribe(() => {
        this.isValidSum = this.validateDeliverySum();
      });
    }
  }

  validateDeliverySum(): boolean {
    const numberOfPregnancies = this.formRegisterGestante.get('numberOfPregnancies')?.value;
    const normalDeliveries = this.formRegisterGestante.get('normalDeliveries')?.value;
    const cesareanDeliveries = this.formRegisterGestante.get('cesareanDeliveries')?.value;
    const abortions = this.formRegisterGestante.get('abortions')?.value;

    const sum = normalDeliveries + cesareanDeliveries + abortions;

    return sum === numberOfPregnancies;
  }

  getProfissional() {
    this.service.getProfissional().subscribe((response) => {
      this.profissional = response;
      console.log(this.profissional);
    });
  }

  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace && control.value.length > 0
        ? { whitespace: true }
        : null;
    };
  }

  BirthDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value) {
        const selectedDate = new Date(control.value);
        const currentDate = new Date();
        const minDate = new Date(
          currentDate.getFullYear() - 50,
          currentDate.getMonth(),
          currentDate.getDate()
        );
        const maxDate = new Date(
          currentDate.getFullYear() - 12,
          currentDate.getMonth(),
          currentDate.getDate()
        );

        if (selectedDate < minDate || selectedDate > maxDate) {
          return { invalidDate: true };
        }
      }
      return null;
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
    this.formRegisterGestante.get('gestanteCpf')!.setValue(formattedCpf);
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

    this.formRegisterGestante.get('gestantePhone')!.setValue(formattedTelefone);
  }

  emailInputField() {
    this.errorEmail = false;
  }

  nameInputField() {
    this.errorName = false;
  }

  cpfInputField() {
    this.errorCpf = false;
  }

  showStep(step: number) {
    this.currentStep = step;

    const parte1 = document.getElementById('step1');
    const parte2 = document.getElementById('step2');
    const parte3 = document.getElementById('step3');

    if (step === 1) {
      if (parte1 && parte2 && parte3) {
        parte1.classList.add('active');
        parte2.classList.remove('active');
        parte3.classList.remove('active');
      }
    } else if (step === 2) {
      if (parte1 && parte2 && parte3) {
        parte2.classList.add('active');
        parte1.classList.remove('active');
        parte3.classList.remove('active');
      }
    }
    else if (step === 3) {
      if (parte1 && parte2 && parte3) {
        parte3.classList.add('active');
        parte1.classList.remove('active');
        parte2.classList.remove('active');
      }
    }
  }

  sendEmail(email: string, name:string){
    const message = "Olá " + name + ", bem-vinda ao SisGestante! Para acessar seu perfil, utilize seu e-mail e CPF (sem pontuações ou caracteres especiais) informados na sua primeira consulta." +
                    "\nLembre-se de alterar sua senha na aba 'Perfil' assim que possível." + "\n Desejo-lhe uma gestação tranquila e um ótimo pós-parto 🤱❤️" +
                     "\n\n Att. App SisGestante.";
    const sendEmail = new SendEmail();
    sendEmail.ownerRef = email;
    sendEmail.msgAuthor = "sisgestante@gmail.com";
    sendEmail.receiver = email;
    sendEmail.title = "Boas vindas ao SisGestante!";
    sendEmail.bodyMessage = message;
    this.service.sendEmailNewGestante(sendEmail).pipe(
      catchError((errorResponse) => {
        if (errorResponse) {
          this.errorSendEmail = true
      
        }
        else {
          console.error('Erro ao Cadastrar:', errorResponse);
        }
        console.log(errorResponse);
      return [];
    })
    
    ).subscribe(() =>{
      window.location.reload();
    })

  }

  registerGestante() {
    const registerForm = this.formRegisterGestante!;
    const name = registerForm.get('gestanteName');
    const email = registerForm.get('gestanteEmail');
    const cpf = registerForm.get('gestanteCpf');
    const address = registerForm.get('gestanteAddress');
    const birth = registerForm.get('gestanteBirthDate');
    const phone = registerForm.get('gestantePhone');
    const dum = registerForm.get('gestanteDum');
    const blood = registerForm.get('gestanteBloodType');
    const age = this.service.calculateAge(birth?.value);
    const numberOfPregnancies = registerForm.get('numberOfPregnancies');
    const normalDeliveries = registerForm.get('normalDeliveries');
    const cesareanDeliveries = registerForm.get('cesareanDeliveries');
    const abortions = registerForm.get('abortions');
    const weight = registerForm.get('gestanteWeight');
    const height = registerForm.get('gestanteHeight');
    

    if((name?.errors || email?.errors) || (birth?.errors || phone?.errors) ){
      this.showStep(1);
    }else if ((cpf?.errors || dum?.errors)||(weight?.errors || height?.errors) || blood?.errors ){
      this.showStep(2);
    }else if ((numberOfPregnancies?.errors || normalDeliveries?.errors) || (cesareanDeliveries?.errors || abortions?.errors)){
      this.showStep(3);
    }

    if (registerForm.invalid) {
      return;
    } else {
      this.gestante = new Gestante();
      this.gestante.name = name?.value;
      this.gestante.email = email?.value;
      this.gestante.cpf = cpf?.value;
      this.gestante.password = cpf?.value.replace(/\D/g, '');
      this.gestante.gestanteAddress = address?.value;
      this.gestante.gestanteBirthDate = birth?.value;
      this.gestante.gestanteBloodType = blood?.value;
      this.gestante.gestanteDum = dum?.value;
      this.gestante.phone = phone?.value;
      this.gestante.gestanteAge = age;
      this.gestante.abortions = abortions?.value;
      this.gestante.cesareanDeliveries = cesareanDeliveries?.value;
      this.gestante.height = height?.value;
      this.gestante.weight = weight?.value;
      this.gestante.normalDeliveries = normalDeliveries?.value;
      this.gestante.numberOfPregnancies = numberOfPregnancies?.value;
      
      this.service.getProfissional().subscribe((response) => {
        this.gestante.idProfissional = response.id;
        console.log(this.gestante.idProfissional);
        this.service
          .registerGestante(this.gestante)
          .pipe(
            catchError((errorResponse) => {
              if (errorResponse.error === 'E-mail já em uso.') {
                this.errorEmail = true;
                this.showStep(1);
              }
              if (errorResponse.error === 'CPF Inválido.') {
                this.errorCpf = true;
                this.showStep(2);
              }
              if (errorResponse.error.errors) {
                for (let i = 0; i < errorResponse.error.errors.length; i++) {
                  if (
                    errorResponse.error.errors[i].defaultMessage ===
                    'Name is mandatory'
                  ) {
                    this.errorName = true;
                    this.showStep(1);
                  } else if (
                    errorResponse.error.errors[i].defaultMessage ===
                    'Email is invalid'
                  ) {
                    this.errorEmail = true;
                    this.showStep(1);
                  } else if (
                    errorResponse.error.errors[i].defaultMessage ===
                    'CPF is invalid'
                  ) {
                    this.errorCpf = true;
                    this.showStep(1);
                    this.showStep(2);
                  } else {
                    console.error('Erro ao Cadastrar:', errorResponse);
                  }
                  console.log(errorResponse);
                }
              }
              return [];
            })
          )
          .subscribe(() => {
            this.sendEmail(email?.value, name?.value);
          });
      });
    }
  }
}
