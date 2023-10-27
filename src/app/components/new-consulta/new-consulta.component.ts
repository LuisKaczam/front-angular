import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../sidebar/sidebar.service';
import { ProfissionalService } from '../profissional/profissional.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Gestante } from 'src/app/entities/Gestante';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-new-consulta',
  templateUrl: './new-consulta.component.html',
  styleUrls: ['./new-consulta.component.css']
})
export class NewConsultaComponent implements OnInit{
  sideNavStatus = false;
  gestanteId:number = 0;

  formConsulta!:FormGroup;


  constructor(private sideBarService: SidebarService, private service: ProfissionalService, private router: Router, private route: ActivatedRoute){
    this.sideBarService.getSideNavStatus().subscribe(status => {
      this.sideNavStatus = status;
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
      dataConsulta: new FormControl('', [Validators.required])
    })
    this.route.queryParams.subscribe(params => {
      this.gestanteId = +params['id'];
    });
}

registerNewConsulta(){
  const registerForm = this.formConsulta!;
  const batimentosCardiacos = registerForm.get('batimentosCardiacos');
  const diagnostico = registerForm.get('diagnostico');
  const examesRealizados = registerForm.get('examesRealizados');
  const prescricoesMedicas = registerForm.get('prescricoesMedicas');
  const pressaoArterial = registerForm.get('pressaoArterial');
  const dataConsulta = registerForm.get('dataConsulta');

  if(registerForm.invalid){
    return;
  }else{
    const gestanteConsulta = new Gestante();
    gestanteConsulta.batimentosCardiacos = batimentosCardiacos?.value;
    gestanteConsulta.diagnostico = diagnostico?.value;
    gestanteConsulta.examesRealizados = examesRealizados?.value;
    gestanteConsulta.prescricoesMedicas = prescricoesMedicas?.value;
    gestanteConsulta.pressaoArterial = pressaoArterial?.value;
    gestanteConsulta.dataConsulta = dataConsulta?.value;

    this.service.newConstulta(gestanteConsulta, this.gestanteId).pipe(catchError((error) =>{
      console.error("Falha ao cadastrar nova consulta: ", error );
      
      return [];
    })).subscribe((response) =>{
          this.router.navigate(['/historico-gestante'], { queryParams: { id: this.gestanteId } });
        
    })
  
  }

}
noSideBar(): void {
  if (this.sideBarService.isSideNavOpen()) {
    this.sideBarService.toggleSideNav();
  }
}

}
