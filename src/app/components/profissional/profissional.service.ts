import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { Profissional } from '../../entities/Profissional';
import { Gestante } from 'src/app/entities/Gestante';
import firebase from 'firebase/compat/app';
import { environment } from 'src/environments/environment';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Post } from 'src/app/entities/Posts';
import { Router } from '@angular/router';
import { Bebe } from 'src/app/entities/Bebe';
import { Calendario } from 'src/app/entities/Calendario';
import { Notificacoes } from 'src/app/entities/Notificacoes';
import { SendEmail } from 'src/app/entities/recoveryPassword';
import { PwaObject } from 'src/app/entities/PwaObject';

@Injectable({
  providedIn: 'root',
})
export class ProfissionalService {
  private baseUrl = 'https://sisgestante-deploy.onrender.com';
  _refresh$ = new Subject<void>();
  _delete$ = new Subject<void>();
  _notification$ = new Subject<void>();
  _notificationGestante$ = new Subject<void>();
  _updateNotification$ = new Subject<void>();
  _calendar$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private storage: AngularFireStorage,
    private router: Router
  ) {}

  registerProfissional(profissional: Profissional): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/auth/register-profissional`,
      profissional
    );
  }

  loginProfissional(email: string, password: string): Observable<any> {
    const profissionalLogin = { email, password };

    return this.http.post(`${this.baseUrl}/auth/login`, profissionalLogin);
  }

  updateUrlNotification(id: number, endpoint: string, expirationTime: any, keys: any): Observable<any> {
    const notificationUrl = {endpoint, expirationTime, keys
    };

    console.log('teste', notificationUrl);

    return this.http.post(`${this.baseUrl}/auth/notification-url/${id}`, notificationUrl);
  }

  registerGestante(gestante: Gestante): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.post(`${this.baseUrl}/auth/register-gestante`, gestante, {
      headers: headers,
    });
  }

  newNotification( notificacao: Notificacoes, gestanteId:number): Observable<any> {
    const token = localStorage.getItem('token');
    console.log("esse ", gestanteId);
    const profissionalId = localStorage.getItem('id');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http
      .post(
        `${this.baseUrl}/profissionais/notification/${profissionalId}/${gestanteId}`,
        notificacao,
        {
          headers: headers,
        }
      )
      .pipe(
        tap(() => {
          this._notification$.next();
        })
      );
  }

  sendPushNotification(title: string, message:string, pwa:PwaObject){
    const token = localStorage.getItem('token');
    const endpoint = pwa.endpoint;
    const expirationTime = pwa.expirationTime;
    const keys = pwa.keys
    const notificacao = {endpoint, title, message, expirationTime, keys}
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http
    .post(
      `${this.baseUrl}/profissionais/send-push-notification`,
      notificacao,
      {
        headers: headers,
      }
    )
  }

  getNotifications() {
    const token = localStorage.getItem('token');
    const profissionalId = localStorage.getItem('id');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<Notificacoes[]>(
      `${this.baseUrl}/profissionais/${profissionalId}/list-notifications`,
      { headers: headers }
    );
  }

  getPwaObject() {
    const profissionalId = localStorage.getItem("idUser")
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<PwaObject>(
      `${this.baseUrl}/auth/${profissionalId}/pwa-notification`,
      { headers: headers }
    );
  }

  getPwaObjectGestante(id: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<PwaObject>(
      `${this.baseUrl}/auth/${id}/gestante-pwa-notification`,
      { headers: headers }
    );
  }

  getAllNotifications() {
    const token = localStorage.getItem('token');
    const profissionalId = localStorage.getItem('id');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<Notificacoes[]>(
      `${this.baseUrl}/profissionais/${profissionalId}/list-all-notificacoes`,
      { headers: headers }
    );
  }

  updateNotifications(id: number, notificacao: Notificacoes): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http
      .put(
        `${this.baseUrl}/profissionais/${id}/update-notifications`,
        notificacao,
        { headers: headers }
      )
      .pipe(
        tap(() => {
          this._updateNotification$.next();
        })
      );
  }

  newPost(post: Post): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.post(`${this.baseUrl}/profissionais/new-post`, post, {
      headers: headers,
    }).pipe(
      tap(() => {
        this._notification$.next();
      })
    );
  }

  newConstulta(gestante: Gestante, historicId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.post(
      `${this.baseUrl}/profissionais/historic/${historicId}`,
      gestante,
      {
        headers: headers,
      }
    );
  }

  newBaby(bebe: Bebe, gestanteId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.post(
      `${this.baseUrl}/profissionais/bebe/${gestanteId}`,
      bebe,
      {
        headers: headers,
      }
    );
  }

  async insertStoragePost(post: Post, file: File, profissional: string, userId:number) {
    const nameId = profissional + userId;
    let app = firebase.initializeApp(environment.firebase);
    const storage = app.storage();
    const newPost = new Post();
    newPost.author = post.author;
    newPost.date = post.date;
    newPost.idProfissional = post.idProfissional;
    newPost.link = post.link;
    newPost.title = post.title;
    newPost.type = post.type;
    if (newPost.link == '') {
      const storageRef = storage.ref(`Posts/${nameId}/${file.name}`);

      try {
        const snapshot = await storageRef.put(file);
        const url = await snapshot.ref.getDownloadURL();
        newPost.link = url;
        this.newPost(newPost).subscribe(() => {
          this.router.navigate(['publicacoes']);
        });
      } catch (error) {
        console.error('Nao foi possivel realizar postagem: ', error);
      }
    } else {
      this.newPost(newPost).subscribe(() => {
        this.router.navigate(['publicacoes']);
      });
    }
  }
  insertCalendar(calendar: Calendario): Observable<any> {
    const token = localStorage.getItem('token');
    const profissionalId = localStorage.getItem('id');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http
      .post(
        `${this.baseUrl}/profissionais/calendar/${profissionalId}`,
        calendar,
        {
          headers: headers,
        }
      )
      .pipe(
        tap(() => {
          this._calendar$.next();
        })
      );
  }

  insertCalendarGestante(calendar: Calendario, gestanteId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const profissionalId = localStorage.getItem('id');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http
      .post(
        `${this.baseUrl}/profissionais/calendar-with-gestante/${profissionalId}/${gestanteId}`,
        calendar,
        {
          headers: headers,
        }
      )
      .pipe(
        tap(() => {
          this._calendar$.next();
        })
      );
  }

  sharePost(post: Post, gestanteId: number) {
    const postId = post.id;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.put(
      `${this.baseUrl}/profissionais/share-post/${gestanteId}/${postId}`,
      post,
      { headers: headers }
    ).pipe(
      tap(() => {
        this._notification$.next();
      })
    );
  }

  getCalendar() {
    const token = localStorage.getItem('token');
    const profissionalId = localStorage.getItem('id');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<Calendario[]>(
      `${this.baseUrl}/profissionais/${profissionalId}/list-calendar`,
      { headers: headers }
    );
  }

  deleteGestante(gestanteId: number) {
    const token = localStorage.getItem('token');
    const profissionalId = localStorage.getItem('id');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    const url = `${this.baseUrl}/profissionais/${profissionalId}/remove-gestante/${gestanteId}`;
    return this.http.delete(url, {
      headers: headers,
    });
  }

  deleteProfissional(profissionalId: number, image: string, artigos: any[], videos: any[], nameId:string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    const url = `${this.baseUrl}/profissionais/delete-profissional/${profissionalId}`;
    if (image != '' && image != undefined) {
      this.deleteFolder("profiles/", nameId + "/");

    } 
    if ((artigos.length > 0) || (videos.length > 0)) {
      this.deleteFolder("Posts/", nameId + "/");
        }
    
    this.http.delete(url, { headers: headers }).subscribe((response) => {
      if (response) {
        console.log(response);
        localStorage.removeItem('id');
        localStorage.removeItem('token');
        this.router.navigate(['login-profissional']);
      } 
       
    });
  }
  

  getProfissional(): Observable<any> {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<Profissional>(
      `${this.baseUrl}/profissionais/${id}/profissional`,
      { headers: headers }
    );
  }

  getOneGestante(gestanteId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<Gestante>(
      `${this.baseUrl}/profissionais/${id}/gestante/${gestanteId}`,
      { headers: headers }
    );
  }

  async updateUserPhoto(profissional: any, image: File, nameId:string) {
    let app = firebase.initializeApp(environment.firebase);
    const storage = app.storage();
    const updateProfissional = new Profissional();
    updateProfissional.name = profissional.name;
    updateProfissional.email = profissional.email;
    updateProfissional.cpf = profissional.cpf;
    updateProfissional.password = profissional.password;
    updateProfissional.id = profissional.id;
    if (profissional.photo != '' && profissional.photo != undefined) {
      this.deleteImageUrlByLink(profissional.photo);
      try {
        const storageRef = storage.ref(
          `profiles/${nameId}/${image.name}`
        );

        const snapshot = await storageRef.put(image);
        const url = await snapshot.ref.getDownloadURL();
        updateProfissional.profilePhoto = url;
        this.updateProfissional(
          updateProfissional,
          profissional.usuario.id
        ).subscribe((response) => {
          window.location.reload();
        });
      } catch (error) {
        console.error('Erro ao atualizar foto de usuario. ', error);
      }
    } else {
      try {
        const storageRef = storage.ref(
          `profiles/${nameId}/${image.name}`
        );
        const snapshot = await storageRef.put(image);
        const url = await snapshot.ref.getDownloadURL();
        updateProfissional.profilePhoto = url;
        this.updateProfissional(updateProfissional, profissional.id).subscribe(
          () => {
            window.location.reload();
          }
        );
      } catch (error) {
        console.error('Erro ao atualizar foto de usuario. ', error);
      }
    }
  }

  updateProfissional(profissional: Profissional, id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.put(
      `${this.baseUrl}/profissionais/update/${id}`,
      profissional,
      { headers: headers }
    );
  }

  updateGestante(gestante: Gestante, id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.put(
      `${this.baseUrl}/profissionais/update-gestante/${id}`,
      gestante,
      { headers: headers }
    );
  }

  updateEmail(email: string, password:string, id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    const updateEmail = {email, password};
    return this.http.put(
      `${this.baseUrl}/profissionais/update-email/${id}`,
      updateEmail,
      { headers: headers }
    );
  }

  deleteImageUrlByLink(fileLink: string): Promise<any> {
    let app = firebase.initializeApp(environment.firebase);
    const storage = app.storage().refFromURL(fileLink);
    return storage.delete();
  }



  async deleteFolder(basePath: string, folderName: string): Promise<void> {
    let app = firebase.initializeApp(environment.firebase);
    const storage = app.storage();
  
    const folderPath = `${basePath}/${folderName}`;
    const folderRef = storage.ref(folderPath);
  
    const listResult = await folderRef.listAll();
  
    listResult.items.forEach(async (item) => {
      await item.delete();
    });
  
  }

  updateUserPassword(email: string, password: string):Observable<any>{
    const user = {email, password};
    const url = `${this.baseUrl}/auth/update-password`;
    return this.http.put(url, user);
  }

  recoveryGestante(cpf:string):Observable<any>{
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    const gestante = {cpf};
    return this.http.post(
      `${this.baseUrl}/profissionais/recovery-gestante/${id}`,gestante,
      { headers: headers }
    );
  }

  updateProfissionalPassword(email: string, password: string, newPassword: string):Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    const user = {email, password, newPassword};
    const url = `${this.baseUrl}/profissionais/update-profissional-password`;
    return this.http.put(url, user, { headers: headers });
  }

  sendEmailRecoveryPassword(message: SendEmail){
    const url = `${this.baseUrl}/email/send-email-recovery`;
    return this.http.post(url, message);
  }

  sendEmailNewGestante(message: SendEmail){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    const url = `${this.baseUrl}/email/send-email`;
    return this.http.post(url, message, { headers: headers });
  }
  

  listGestante(): Observable<any> {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<Gestante[]>(
      `${this.baseUrl}/profissionais/${id}/gestantes`,
      { headers: headers }
    );
  }

  listConsultas(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<Gestante[]>(
      `${this.baseUrl}/profissionais/${id}/consultas`,
      { headers: headers }
    );
  }

  listBebes(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<Bebe[]>(`${this.baseUrl}/profissionais/${id}/bebes`, {
      headers: headers,
    });
  }

  getOneBaby(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<Bebe>(
      `${this.baseUrl}/profissionais/${id}/infos-bebe`,
      { headers: headers }
    );
  }

  listVideos(): Observable<any> {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<Post[]>(`${this.baseUrl}/profissionais/${id}/videos`, {
      headers: headers,
    });
  }

  deleteVideos(id: number, fileLink: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    console.log(id);
    const url = `${this.baseUrl}/profissionais/delete-videos/${id}`;
    return this.http
      .delete(url, {
        headers: headers,
      })
      .pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  deleteArticles(id: number, fileLink: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    console.log(id);
    const url = `${this.baseUrl}/profissionais/delete-articles/${id}`;
    return this.http
      .delete(url, {
        headers: headers,
      })
      .pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  listArticles(): Observable<any> {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<Post[]>(
      `${this.baseUrl}/profissionais/${id}/articles`,
      { headers: headers }
    );
  }

  calculateAge(date: string): number {
    const today = new Date();
    const birthDate = new Date(date);
    const age = today.getFullYear() - birthDate.getFullYear();
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      return age - 1;
    }

    return age;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    localStorage.removeItem('userId');
  }
}
