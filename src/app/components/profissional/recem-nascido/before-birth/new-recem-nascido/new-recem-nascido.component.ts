import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { SidebarService } from 'src/app/components/sidebar/sidebar.service';
import { ProfissionalService } from '../../../profissional.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Bebe } from 'src/app/entities/Bebe';
import { PushNotificationService } from 'src/app/push-notification.service';

@Component({
  selector: 'app-new-recem-nascido',
  templateUrl: './new-recem-nascido.component.html',
  styleUrls: ['./new-recem-nascido.component.css']
})
export class NewRecemNascidoComponent {
  sideNavStatus = false;
  gestanteId:number = 0;

  formBebe!:FormGroup;


  constructor(private sideBarService: SidebarService, private pushNotification: PushNotificationService, private service: ProfissionalService, private router: Router, private route: ActivatedRoute){
    this.sideBarService.getSideNavStatus().subscribe(status => {
      this.sideNavStatus = status;
    });

}

ngOnInit(): void {
    this.formBebe = new FormGroup({
      babyName: new FormControl('', [Validators.required, this.noWhitespaceValidator()]),
      babyBithDate: new FormControl('', [Validators.required]),
      babyWeight: new FormControl('', [Validators.required]),
      babyHeight: new FormControl('', [Validators.required]),
      sex: new FormControl('', [Validators.required]),
      babyBloodType: new FormControl('', [Validators.required]),
    })
    this.route.queryParams.subscribe(params => {
      this.gestanteId = +params['id'];
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

clickCloseNotification(){
  this.pushNotification._updateIconNotification$.next();
}

registerNewBaby(){
  const registerForm = this.formBebe!;
  const babyName = registerForm.get('babyName');
  const babyBithDate = registerForm.get('babyBithDate');
  const babyWeight = registerForm.get('babyWeight');
  const babyHeight = registerForm.get('babyHeight');
  const sex = registerForm.get('sex');
  const babyBloodType = registerForm.get('babyBloodType');
 

  if(registerForm.invalid){
    return;
  }else{
    const baby = new Bebe();
    baby.babyBithDate = babyBithDate?.value;
    baby.babyBloodType = babyBloodType?.value;
    baby.babyHeight = babyHeight?.value;
    baby.babyName = babyName?.value;
    baby.babyWeight = babyWeight?.value;
    baby.sex = sex?.value;

    this.service.newBaby(baby, this.gestanteId).subscribe(() =>{
      this.router.navigate(['/list-recem-nascido'], { queryParams: { id: this.gestanteId } });
    })
  
  }

}
noSideBar(): void {
  if (this.sideBarService.isSideNavOpen()) {
    this.sideBarService.toggleSideNav();
  }
}

}
