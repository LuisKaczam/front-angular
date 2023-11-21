import { Component } from '@angular/core';
import { SidebarService } from 'src/app/components/sidebar/sidebar.service';
import { ProfissionalService } from '../../../profissional.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Vacinas } from 'src/app/entities/Vacinas';
import { FileHandle } from 'src/app/Files/FileHandle';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-vaccine',
  templateUrl: './new-vaccine.component.html',
  styleUrls: ['./new-vaccine.component.css']
})
export class NewVaccineComponent {
  sideNavStatus = false;
  vacina = new Vacinas();

  newVacinaForm!: FormGroup;
  files!: File
  fileName: string ='';
  imageType: string='';
  fileSize:number = 0;
  bebe!:number;
  name!:string;
  errorVaccine:boolean = false;


  constructor(private sideBarService: SidebarService, private service: ProfissionalService, private route: ActivatedRoute, private router: Router){
    this.sideBarService.getSideNavStatus().subscribe(status => {
      this.sideNavStatus = status;
    });
   
  }
 
  ngOnInit(): void {
    this.noSideBar();
      this.newVacinaForm = new FormGroup({
        nome: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]),
        idadeNescessaria: new FormControl(0, [Validators.required]),
        link: new FormControl('', Validators.required),
      });

      this.route.queryParams.subscribe(params => {
        this.bebe = parseInt(params['id']);
        this.name = params['name'];
      })

      this.service._errorVaccine.subscribe(()=>{
        this.errorVaccine = true;
      })
  }


     get nome(){
      return this.newVacinaForm.get('nome')!;
    }

    get idadeNescessaria(){
      return this.newVacinaForm.get('idadeNescessaria')!;
    }    

    get link(){
      return this.newVacinaForm.get('link')!;
    }

    fileDropped(fileHandle: FileHandle){
      this.files = fileHandle.file;
      this.fileName = this.files.name;
      this.imageType = this.files.type;
      this.fileSize = this.files.size;
      console.log(this.imageType);
      console.log(this.fileSize);
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

    registerVaccine(){
      console.log("aqui");
      
      const newVacinaForm = this.newVacinaForm!;
      const name = newVacinaForm.get('nome')!;
      const age = newVacinaForm.get('idadeNescessaria')!;
      const link = newVacinaForm.get('link')!;
      
      if(newVacinaForm.invalid){
        console.log("aqui 2");
        
        return;
      }

      if(newVacinaForm.get('link')?.value == ''){
        newVacinaForm.get('link')?.setErrors({required: true});
        return;
      }

      this.vacina.nome = name.value;
      this.vacina.idadeNecessaria = age.value;
      this.service.insertStorageVacine(this.vacina, this.files, this.name, this.bebe);
    }
 
  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }
  }

  
  
  
  

  
}
