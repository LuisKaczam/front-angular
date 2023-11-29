import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../sidebar/sidebar.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Post } from 'src/app/entities/Posts';
import { ProfissionalService } from '../profissional/profissional.service';
import { Profissional } from 'src/app/entities/Profissional';
import { FileHandle } from 'src/app/Files/FileHandle';
import { PushNotificationService } from 'src/app/push-notification.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {
  sideNavStatus = false;
  post = new Post();

  newPostForm!: FormGroup;
  files!: File
  fileName: string ='';
  imageType: string='';
  fileSize:number = 0;
  profissional:any;


  constructor(private sideBarService: SidebarService, private service: ProfissionalService, private pushNotification: PushNotificationService){
    this.sideBarService.getSideNavStatus().subscribe(status => {
      this.sideNavStatus = status;
    });
   
  }
 
  ngOnInit(): void {
    this.noSideBar();
      this.newPostForm = new FormGroup({
        type: new FormControl('', [Validators.required]),
        title: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]),
        author: new FormControl(''),
        link: new FormControl('', Validators.required),
      })
      this.getProfissional();
  }
 
     getProfissional(){
      this.service.getProfissional().subscribe((response)=>{
        this.profissional = response;
      })
     }


    fileDropped(fileHandle: FileHandle){
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

    registerPost(){
      const newPostForm = this.newPostForm!;
      const type = newPostForm.get('type')!;
      const title = newPostForm.get('title')!;
      const author = newPostForm.get('author')!;
      const link = newPostForm.get('link')!;
      const date = new Date();
      
      if(newPostForm.invalid){
        return;
      }

      

      if(newPostForm.get('link')?.value == ''){
        newPostForm.get('link')?.setErrors({required: true});
        return;
      }

      this.post.type = type.value;
      this.post.title = title.value;
      this.post.author = author.value;
      this.post.date = date;
      this.post.idProfissional = this.profissional.id;
      this.service.insertStoragePost(this.post, this.files, this.profissional.usuario.name, this.profissional.usuario.id);
    }
 
  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }
  }

  clickCloseNotification(){
    this.pushNotification._updateIconNotification$.next();
  }

}
