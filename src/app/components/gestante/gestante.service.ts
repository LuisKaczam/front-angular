import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, catchError, tap } from 'rxjs';
import { Bebe } from 'src/app/entities/Bebe';
import { Gestante } from 'src/app/entities/Gestante';
import { Notificacoes } from 'src/app/entities/Notificacoes';
import { Post } from 'src/app/entities/Posts';
import { environment } from 'src/environments/environment';
import firebase from 'firebase/compat/app';
import { Calendario } from 'src/app/entities/Calendario';
import { Profissional } from 'src/app/entities/Profissional';
import { Vacinas } from 'src/app/entities/Vacinas';

@Injectable({
  providedIn: 'root',
})
export class GestanteService {
  private baseUrl = 'https://sisgestante-deploy-tb0m.onrender.com';
  _refresh$ = new Subject<void>();
  _delete$ = new Subject<void>();
  _notification$ = new Subject<void>();
  _calendar$ = new Subject<void>();
  app = firebase.initializeApp(environment.firebase);

  constructor(private http: HttpClient, private router: Router) {}

  loginGestante(email: string, password: string): Observable<any> {
    const gestanteLogin = { email, password };

    return this.http.post(`${this.baseUrl}/auth/login-gestante`, gestanteLogin);
  }

  getGestante(): Observable<any> {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<Gestante>(`${this.baseUrl}/gestantes/${id}/gestante`, {
      headers: headers,
    });
  }

  listBebes(): Observable<any> {
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<Bebe[]>(
      `${this.baseUrl}/gestantes/${id}/list-babies`,
      {
        headers: headers,
      }
    );
  }

  getOneBaby(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<Bebe>(
      `${this.baseUrl}/gestantes/${id}/gestante-infos-bebe`,
      { headers: headers }
    );
  }

  getConsultas(): Observable<any> {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<Gestante[]>(
      `${this.baseUrl}/gestantes/${id}/list-gestante-consultas`,
      { headers: headers }
    );
  }

  listArticles(profissionalId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<Post[]>(
      `${this.baseUrl}/gestantes/${id}/list-gestante-articles/${profissionalId}`,
      { headers: headers }
    );
  }

  listVideos(profissionalId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<Post[]>(
      `${this.baseUrl}/gestantes/${id}/list-gestante-videos/${profissionalId}`,
      { headers: headers }
    );
  }

  getProfissional(profissionalId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<Profissional>(
      `${this.baseUrl}/gestantes/${profissionalId}/profissional`,
      { headers: headers }
    );
  }

  listConsultas(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<Gestante>(
      `${this.baseUrl}/gestantes/${id}/list-gestante-consultas`,
      { headers: headers }
    );
  }

  getNotifications() {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<Notificacoes[]>(
      `${this.baseUrl}/gestantes/${id}/list-unread-notifications-gestante`,
      { headers: headers }
    );
  }

  getAllProfissionais() {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<Profissional[]>(
      `${this.baseUrl}/gestantes/${id}/gestante-profissionais`,
      { headers: headers }
    );
  }

  getAllNotifications() {
    const token = localStorage.getItem('token');
    const gestanteId = localStorage.getItem('id');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<Notificacoes[]>(
      `${this.baseUrl}/gestantes/${gestanteId}/list-gestante-notifications`,
      { headers: headers }
    );
  }

  getCalendar() {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<Calendario[]>(
      `${this.baseUrl}/gestantes/${id}/list-gestante-calendar`,
      { headers: headers }
    );
  }

  getVaccines() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<Vacinas[]>(`${this.baseUrl}/auth/list-vacinas`, {
      headers: headers,
    });
  }

  updateNotifications(id: number, notificacao: Notificacoes): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http
      .put(
        `${this.baseUrl}/gestantes/${id}/update-notifications-gestante`,
        notificacao,
        { headers: headers }
      )
      .pipe(
        tap(() => {
          this._notification$.next();
        })
      );
  }

  async updateUserPhoto(gestante: any, image: File, nameId: string) {
    const storage = this.app.storage();
    const updateGestante = new Gestante();
    updateGestante.name = gestante.name;
    updateGestante.email = gestante.email;
    updateGestante.cpf = gestante.cpf;
    updateGestante.password = gestante.password;
    updateGestante.id = gestante.id;
    updateGestante.phone = gestante.phone
    if (gestante.profilePhoto != '' && gestante.profilePhoto != undefined) {
      this.deleteImageUrlByLink(gestante.profilePhoto);
      try {
        const storageRef = storage.ref(
          `profiles/gestantes/${nameId}/${image.name}`
        );

        const snapshot = await storageRef.put(image);
        const url = await snapshot.ref.getDownloadURL();
        updateGestante.profilePhoto = url;
        this.updateGestante(updateGestante, gestante.usuario.id).subscribe(
          () => {
            window.location.reload();
          }
        );
      } catch (error) {
        console.error('Erro ao atualizar foto de usuario. ', error);
      }
    } else {
      try {
        const storageRef = storage.ref(
          `profiles/gestantes/${nameId}/${image.name}`
        );
        const snapshot = await storageRef.put(image);
        const url = await snapshot.ref.getDownloadURL();
        updateGestante.profilePhoto = url;
        this.updateGestante(updateGestante, gestante.id).subscribe(() => {
          window.location.reload();
        });
      } catch (error) {
        console.error('Erro ao atualizar foto de usuario. ', error);
      }
    }
  }

  async updateBabyPhoto(baby: any, image: File, nameId: string) {
    const storage = this.app.storage();
    const updateBaby = new Bebe();
    updateBaby.babyName = baby.babyName;
    updateBaby.babyBithDate = baby.babyBithDate;
    updateBaby.babyBloodType = baby.babyBloodType;
    updateBaby.babyHeight = baby.babyHeight;
    updateBaby.babyWeight = baby.babyWeight;
    updateBaby.sex = baby.sex;

    if (baby.photo != '' && baby.foto != undefined) {
      this.deleteImageUrlByLink(baby.photo);
      try {
        const storageRef = storage.ref(
          `profiles/gestantes/${nameId}/bebes/${image.name}`
        );

        const snapshot = await storageRef.put(image);
        const url = await snapshot.ref.getDownloadURL();
        updateBaby.photo = url;
        this.updateBaby(updateBaby, baby.id).subscribe((response) => {
          window.location.reload();
        });
      } catch (error) {
        console.error('Erro ao atualizar foto de usuario. ', error);
      }
    } else {
      try {
        const storageRef = storage.ref(
          `profiles/gestantes/${nameId}/bebes/${image.name}`
        );
        const snapshot = await storageRef.put(image);
        const url = await snapshot.ref.getDownloadURL();
        updateBaby.photo = url;
        this.updateBaby(updateBaby, baby.id).subscribe(() => {
          window.location.reload();
        });
      } catch (error) {
        console.error('Erro ao atualizar foto de usuario. ', error);
      }
    }
  }

  updateEmail(email: string, password: string, id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    const updateEmail = { email, password };
    return this.http.put(
      `${this.baseUrl}/gestantes/update-email-gestante/${id}`,
      updateEmail,
      { headers: headers }
    );
  }

  deleteImageUrlByLink(fileLink: string): Promise<any> {
    const storage = this.app.storage().refFromURL(fileLink);
    return storage.delete();
  }

  getVaccinesBaby(id: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<Vacinas[]>(`${this.baseUrl}/auth/${id}/bebe-vacinas`, {
      headers: headers,
    });
  }

  async deleteGestante(gestanteId: number, image: string, children: any[]) {
    const token = localStorage.getItem('token');
    let vacinas: any[] = [];
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    const url = `${this.baseUrl}/gestantes/delete-gestante/${gestanteId}`;
    if (image != '' && image != undefined) {
      await this.deleteImageUrlByLink(image);
    }

    if (children.length > 0) {
      for (let i = 0; i < children.length; i++) {
        if (children[i].foto != '' && children[i].foto != undefined) {
          await this.deleteImageUrlByLink(children[i].foto);
          this.getVaccinesBaby(children[i].id).subscribe((response) => {
            vacinas = response;
          });
        }
      }
      if (vacinas.length > 0) {
        for (let i = 0; i < vacinas.length; i++) {
          if (vacinas[i].link.startsWith('https://firebasestorage')) {
            await this.deleteImageUrlByLink(vacinas[i].link);
          }
        }
      }
    }

    this.http.delete(url, { headers: headers }).subscribe(() => {
      this.logout();
    });
  }

  updateGestante(gestante: Gestante, id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.put(`${this.baseUrl}/gestantes/update/${id}`, gestante, {
      headers: headers,
    });
  }

  updateBaby(bebe: Bebe, bebeId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.put(
      `${this.baseUrl}/gestantes/bebe-update/${bebeId}`,
      bebe,
      { headers: headers }
    );
  }

  updateUserPassword(email: string, password: string): Observable<any> {
    const user = { email, password };
    const url = `${this.baseUrl}/auth/update-password-gestante`;
    return this.http.put(url, user);
  }

  updateGestantePassword(
    email: string,
    password: string,
    newPassword: string
  ): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    const user = { email, password, newPassword };
    console.log("Aqui 2")
    const url = `${this.baseUrl}/gestantes/update-gestante-password`;
    return this.http.put(url, user, { headers: headers });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('idUser');
    localStorage.removeItem('id');
    this.router.navigate(['/login-gestante']);
  }
}
