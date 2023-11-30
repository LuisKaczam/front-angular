import { Component } from '@angular/core';
import { SidebarService } from 'src/app/components/sidebar/sidebar.service';
import { ProfissionalService } from '../../../profissional.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Vacinas } from 'src/app/entities/Vacinas';
import { FileHandle } from 'src/app/Files/FileHandle';
import { ActivatedRoute, Router } from '@angular/router';
import { PushNotificationService } from 'src/app/push-notification.service';
import { EncondingParamsService } from 'src/app/enconding-params.service';

@Component({
  selector: 'app-new-vaccine',
  templateUrl: './new-vaccine.component.html',
  styleUrls: ['./new-vaccine.component.css'],
})
export class NewVaccineComponent {
  sideNavStatus = false;
  vacina = new Vacinas();

  newVacinaForm!: FormGroup;
  files!: File;
  fileName: string = '';
  imageType: string = '';
  fileSize: number = 0;
  bebe!: number;
  name: string = '';
  errorVaccine: boolean = false;
  idError: boolean = false;

  constructor(
    private sideBarService: SidebarService,
    private cryptService: EncondingParamsService,
    private pushNotification: PushNotificationService,
    private service: ProfissionalService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.sideBarService.getSideNavStatus().subscribe((status) => {
      this.sideNavStatus = status;
    });

    this.route.queryParams.subscribe((params) => {
      const encodedValue = params['id'];
      const name = params['name'];
      if (encodedValue) {
        this.bebe = parseInt(this.cryptService.decode(encodedValue));
        this.name = String(this.cryptService.decode(name));
        if (this.bebe === 0) {
          window.history.back();
        }
      }
    });
  }

  ngOnInit(): void {
    this.noSideBar();
    this.newVacinaForm = new FormGroup({
      nome: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(40),
      ]),
      idadeNescessaria: new FormControl(0, [Validators.required]),
      link: new FormControl('', Validators.required),
    });
    this.service._errorVaccine.subscribe(() => {
      this.errorVaccine = true;
    });
  }

  clickCloseNotification() {
    this.pushNotification._updateIconNotification$.next();
  }

  get nome() {
    return this.newVacinaForm.get('nome')!;
  }

  get idadeNescessaria() {
    return this.newVacinaForm.get('idadeNescessaria')!;
  }

  get link() {
    return this.newVacinaForm.get('link')!;
  }

  fileDropped(fileHandle: FileHandle) {
    this.files = fileHandle.file;
    this.fileName = this.files.name;
    this.imageType = this.files.type;
    this.fileSize = this.files.size;
  }

  arquivoSelecionado(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileName = selectedFile.name;
      this.fileName = fileName;
      this.imageType = selectedFile.type;
      this.fileSize = selectedFile.size;
      this.files = event.target.files[0];
    }
  }

  registerVaccine() {
    const newVacinaForm = this.newVacinaForm!;
    const name = newVacinaForm.get('nome')!;
    const age = newVacinaForm.get('idadeNescessaria')!;
    const link = newVacinaForm.get('link')!;

    if (newVacinaForm.invalid) {
      return;
    }

    if (newVacinaForm.get('link')?.value == '') {
      newVacinaForm.get('link')?.setErrors({ required: true });
      return;
    }

    this.vacina.nome = name.value;
    this.vacina.idadeNecessaria = age.value;
    if (this.bebe !== 0 && this.name !== '') {
      this.service.insertStorageVacine(this.vacina,this.files,this.name,this.bebe);

    }else{
      this.idError = true
      setTimeout(() => {
        this.idError = false;
        window.history.back();
        
      }, 3000);
    }
  }

  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }
  }
}
