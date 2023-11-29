import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from '../../sidebar/sidebar.service';
import { ProfissionalService } from '../profissional.service';
import { Gestante } from 'src/app/entities/Gestante';
import { catchError } from 'rxjs';
import { PushNotificationService } from 'src/app/push-notification.service';

@Component({
  selector: 'app-form-edit-gestante',
  templateUrl: './form-edit-gestante.component.html',
  styleUrls: ['./form-edit-gestante.component.css']
})
export class FormEditGestanteComponent implements OnInit {
  sideNavStatus = false;
  formUpdateGestante!: FormGroup;
  gestanteId!:number;
  gestante = new Gestante();
  updateError: boolean = false;

  
  ngOnInit(): void {
    this.noSideBar()
    this.route.queryParams.subscribe(params => {
      this.gestanteId = parseInt(params['id']);
    });
    this.formUpdateGestante = new FormGroup({
      gestanteWeight:new FormControl('', [Validators.required, Validators.min(0)]),
      gestanteHeight: new FormControl('', [Validators.required, Validators.min(0)]),
      numberOfPregnancies: new FormControl('', [Validators.required, Validators.min(0)]),
      normalDeliveries: new FormControl('', [Validators.required, Validators.min(0)]),
      cesareanDeliveries: new FormControl('', [Validators.required, Validators.min(0)]),
      abortions: new FormControl('', [Validators.required, Validators.min(0)]),
    });
    this.getGestante();
   
  }

  constructor(private router: Router, private pushNotification: PushNotificationService, private route:ActivatedRoute, private sideBarService: SidebarService, private serviceProfissional: ProfissionalService) {
    this.sideBarService.getSideNavStatus().subscribe(status => {
      this.sideNavStatus = status;
    });
   
    
  }

  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }
  }
getGestante(){
  this.serviceProfissional.getOneGestante(this.gestanteId).subscribe((response)=>{
    this.gestante = response;
    console.log(this.gestante)
    if (this.gestante) {
      this.formUpdateGestante.get('gestanteWeight')?.setValue(this.gestante.weight);
      this.formUpdateGestante.get('gestanteHeight')?.setValue(this.gestante.height);
      this.formUpdateGestante.get('numberOfPregnancies')?.setValue(this.gestante.numberOfPregnancies);
      this.formUpdateGestante.get('normalDeliveries')?.setValue(this.gestante.normalDeliveries);
      this.formUpdateGestante.get('cesareanDeliveries')?.setValue(this.gestante.cesareanDeliveries);
      this.formUpdateGestante.get('abortions')?.setValue(this.gestante.abortions);

    }
  })
}

  submitForm() {
    const updateForm = this.formUpdateGestante!;
    const numberOfPregnancies = updateForm.get('numberOfPregnancies');
    const normalDeliveries = updateForm.get('normalDeliveries');
    const cesareanDeliveries = updateForm.get('cesareanDeliveries');
    const abortions = updateForm.get('abortions');
    const weight = updateForm.get('gestanteWeight');
    const height = updateForm.get('gestanteHeight');

    if(updateForm.invalid){
      return;
    }

    this.gestante.numberOfPregnancies = numberOfPregnancies?.value;
    this.gestante.normalDeliveries = normalDeliveries?.value
    this.gestante.cesareanDeliveries = cesareanDeliveries?.value;
    this.gestante.abortions = abortions?.value;
    this.gestante.weight = weight?.value;
    this.gestante.height = height?.value;

   this.serviceProfissional.updateGestante(this.gestante, this.gestanteId).pipe(catchError((error)=>{
    if(error){
      this.updateError = true;
    }
    return[];
   })).subscribe(()=>{
    this.router.navigate(['/historico-gestante'], { queryParams: { id: this.gestanteId }});
   })
  }

  clickCloseNotification(){
    this.pushNotification._updateIconNotification$.next();
  }
}
