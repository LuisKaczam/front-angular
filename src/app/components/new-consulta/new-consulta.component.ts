import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../sidebar/sidebar.service';
import { ProfissionalService } from '../profissional/profissional.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Gestante } from 'src/app/entities/Gestante';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs';
import { PushNotificationService } from 'src/app/push-notification.service';
import { EncondingParamsService } from 'src/app/enconding-params.service';

@Component({
  selector: 'app-new-consulta',
  templateUrl: './new-consulta.component.html',
  styleUrls: ['./new-consulta.component.css'],
})
export class NewConsultaComponent implements OnInit {
  sideNavStatus = false;
  gestanteId: number = 0;

  formConsulta!: FormGroup;

  constructor(
    private sideBarService: SidebarService,
    private cryptService: EncondingParamsService,
    private pushNotification: PushNotificationService,
    private service: ProfissionalService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.sideBarService.getSideNavStatus().subscribe((status) => {
      this.sideNavStatus = status;
    });

    this.route.queryParams.subscribe((params) => {
      const encodedValue = params['id'];
      if (encodedValue) {
        this.gestanteId = parseInt(this.cryptService.decode(encodedValue));

        if (this.gestanteId === 0) {
          window.history.back();
        }
      }
    });
  }

  ngOnInit(): void {
    this.noSideBar();
    this.formConsulta = new FormGroup({
      batimentosCardiacos: new FormControl('', [Validators.required]),
      diagnostico: new FormControl('', [Validators.required]),
      examesRealizados: new FormControl('', [Validators.required]),
      prescricoesMedicas: new FormControl('', [Validators.required]),
      pressaoArterial: new FormControl('', [Validators.required]),
      dataConsulta: new FormControl('', [Validators.required]),
    });
  }

  clickCloseNotification() {
    this.pushNotification._updateIconNotification$.next();
  }

  registerNewConsulta() {
    const registerForm = this.formConsulta!;
    const batimentosCardiacos = registerForm.get('batimentosCardiacos');
    const diagnostico = registerForm.get('diagnostico');
    const examesRealizados = registerForm.get('examesRealizados');
    const prescricoesMedicas = registerForm.get('prescricoesMedicas');
    const pressaoArterial = registerForm.get('pressaoArterial');
    const dataConsulta = registerForm.get('dataConsulta');

    if (registerForm.invalid) {
      return;
    } else {
      const gestanteConsulta = new Gestante();
      gestanteConsulta.batimentosCardiacos = batimentosCardiacos?.value;
      gestanteConsulta.diagnostico = diagnostico?.value;
      gestanteConsulta.examesRealizados = examesRealizados?.value;
      gestanteConsulta.prescricoesMedicas = prescricoesMedicas?.value;
      gestanteConsulta.pressaoArterial = pressaoArterial?.value;
      gestanteConsulta.dataConsulta = dataConsulta?.value;

      this.service
        .newConstulta(gestanteConsulta, this.gestanteId)
        .pipe(
          catchError((error) => {
            console.error('Falha ao cadastrar nova consulta: ', error);

            return [];
          })
        )
        .subscribe((response) => {
          const encondeId = this.cryptService.encode(String(this.gestanteId));
          if (encondeId) {
            this.router.navigate(['/historico-gestante'], {
              queryParams: { id: encondeId },
            });
          }
        });
    }
  }

  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }
  }
}
