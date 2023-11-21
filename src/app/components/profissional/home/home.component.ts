import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, catchError } from 'rxjs';
import { ModalService } from '../../modals/modal.service';
import { SidebarService } from '../../sidebar/sidebar.service';
import { ProfissionalService } from '../profissional.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PwaObject } from 'src/app/entities/PwaObject';
import { PushNotificationService } from 'src/app/push-notification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  sideNavStatus = false;

  gestantes: any[] = [];
  bebes: any[] = [];
  searchTerm: string = '';
  filteredGestantes: any[] = this.gestantes
  isRegisterGestante: boolean = false;
  foundedGestante: boolean = false;
  subscription!: Subscription;
  key!:number;
  deleteName: string = '';
  inputCpf!: FormGroup;
  errorCpf: boolean = false;
  formCpfModal:boolean = false;
  errorPresent:boolean = false;
  pwaObject:any[] = []


  constructor(private router: Router, private sideBarService: SidebarService, private pushService: PushNotificationService, private serviceProfissional: ProfissionalService, private modalService: ModalService) {
    this.sideBarService.getSideNavStatus().subscribe(status => {
      this.sideNavStatus = status;
    });
   
    
  }



  ngOnInit(): void {
    this.noSideBar();
    this.listGestante();
    this.getPwaObj();

    this.modalService.closeModalEvent.subscribe(()=>{
      document.getElementById('btn-close')?.addEventListener('click', ( ()=>{
        this.onModalClose();
        console.log('click')
      }))
    })
    
    this.inputCpf = new FormGroup({
      cpf: new FormControl('',[Validators.required])
    });

    document.getElementById('closeCpf')?.addEventListener('click', ()=>{
      this.inputCpf = new FormGroup({
        cpf: new FormControl('',[Validators.required])
      });
      this.errorCpf = false;
    })
  }

  getPwaObj(){
    const key = localStorage.getItem('idUser');
    const id = Number(key);
    if(id != 0){
      this.pushService.getPwaObject(id).subscribe((response)=>{
        this.pwaObject = response;
        console.log(this.pwaObject);
      })
    }
   
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
    this.inputCpf.get('cpf')!.setValue(formattedCpf);
  }


  listGestante(){
    this.serviceProfissional.listGestante().subscribe(data => {
      for(let i = 0; i < data.length; i++){
        this.gestantes[i] = data[i];
      }
      console.log(this.gestantes);
    });

    
  }

 

  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }
  }
 
  navigateToHistorico(gestanteId:number): void {
    this.router.navigate(['/historico-gestante'], { queryParams: { id: gestanteId } });
  }
  

  navigateToBebe(gestanteId:number): void {
    this.serviceProfissional.listBebes(gestanteId).subscribe((response) =>{
      this.bebes = response;
      if(this.bebes.length > 0){
        this.router.navigate(['/list-recem-nascido'], { queryParams: { id: gestanteId } });
      }else{
        this.router.navigate(['/new-recem-nascido'], { queryParams: { id: gestanteId } });
      }
    })
    
  }

  onModalOpen() {
    this.isRegisterGestante = true;
  }

  onCpfModalOpen() {
    this.formCpfModal = true;
  }

  onCpfModalClose() {
    const modal = document.getElementById('cpfModal');
    if (modal) {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');

  }
  document.getElementById('closeCpf')?.click()
}

  onModalClose() {
    const modal = document.getElementById('formRegisterGestante2');
    if (modal) {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');

  }
  this.modalService.closeModalEvent.emit()
  
  }

  oldGestante(){
    const formCpf = this.inputCpf!;
    const cpf = formCpf.get('cpf');

    if(formCpf.invalid){
      return;
    }

    this.serviceProfissional.recoveryGestante(cpf?.value).pipe(catchError((errorResponse)=>{
      if(errorResponse){
        console.log(errorResponse.error)
        if (errorResponse.error === "A gestante ja esta na lista.") {
          this.errorPresent = true;
          console.log(this.errorPresent)
          
        }else{
           this.errorCpf = true;
        }
      }
      return[];
    })).subscribe(()=>{
      window.location.reload();
    })

  }

  expandGestanteInfo(gestante: any): void {
    gestante.expanded = !gestante.expanded;
  }

  searchGestantes() {
    if(this.gestantes.length > 0 ){
    if (this.searchTerm === '') {
      this.filteredGestantes = this.gestantes;
      this.foundedGestante = false; 
    } else {
      this.filteredGestantes = this.gestantes.filter(gestante =>{
        const searchTermLower = this.searchTerm.toLowerCase();
        const nameLower = gestante.usuario.name.toLowerCase();
        return nameLower.startsWith(searchTermLower) || nameLower.includes(searchTermLower);
      });
      this.foundedGestante = this.filteredGestantes.length === 0;
    }
  }
  }

  

  deleteGestante( key:number, name:string, event:any){
    event.stopPropagation();
    this.key = key;
    this.deleteName = name;
      if (confirm("Tem certeza que deseja excluir a gestante: " + name)) {
        this.serviceProfissional.deleteGestante(key)
          .subscribe(() => {
              window.location.reload();
            },
          );
      };

  }
  
        
  }

