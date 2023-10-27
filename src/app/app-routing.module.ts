import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginInterfaceComponent } from './components/login-interface/login-interface.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/profissional/home/home.component';
import { HistoricoGestanteComponent } from './components/profissional/historico-gestante/historico-gestante.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PublicationsComponent } from './components/publications/publications.component';
import { RecemNascidoComponent } from './components/profissional/recem-nascido/before-birth/recem-nascido.component';
import { BebeComponent } from './components/profissional/recem-nascido/after-birth/bebe/bebe.component';
import { GestanteComponent } from './components/gestante/home/gestante.component';
import { InfosGestanteComponent } from './components/gestante/infos-gestante/infos-gestante.component';
import { InfosRecemNascidoComponent } from './components/gestante/infos-recem-nascido/infos-recem-nascido.component';
import { authGuardProfissional } from './guards/auth.guard';
import { authGuardGestante } from './guards/auth-gestante.guard';
import { LoginGestanteComponent } from './components/gestante/login-gestante/login-gestante.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import { NewConsultaComponent } from './components/new-consulta/new-consulta.component';
import { NewRecemNascidoComponent } from './components/profissional/recem-nascido/before-birth/new-recem-nascido/new-recem-nascido.component';
import { ListRecemNascidoComponent } from './components/profissional/recem-nascido/after-birth/list-recem-nascido/list-recem-nascido.component';
import { ListBabiesComponent } from './components/gestante/list-babies/list-babies.component';
import { CalendarGestanteComponent } from './components/gestante/calendar-gestante/calendar-gestante.component';
import { ProfileGestanteComponent } from './components/gestante/profile-gestante/profile-gestante.component';
import { FormEditGestanteComponent } from './components/profissional/form-edit-gestante/form-edit-gestante.component';
import { ListProfissionaisComponent } from './components/gestante/list-profissionais/list-profissionais.component';
import { InfosProfissionalComponent } from './components/gestante/infos-profissional/infos-profissional.component';


const routes: Routes = [
  { path: '',  component: LoginGestanteComponent},
  { path: 'login-gestante',  component: LoginGestanteComponent},
  { path: 'login-profissional', component: LoginInterfaceComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuardProfissional] },
  { path: 'historico-gestante', component: HistoricoGestanteComponent, canActivate: [authGuardProfissional]},
  { path: 'calendario', component: CalendarComponent, canActivate: [authGuardProfissional]},
  { path: 'perfil', component: ProfileComponent, canActivate: [authGuardProfissional]},
  { path: 'publicacoes', component: PublicationsComponent, canActivate: [authGuardProfissional]},
  { path: 'new-recem-nascido', component: RecemNascidoComponent, canActivate: [authGuardProfissional]},
  { path: 'infos-recem-nascido', component: BebeComponent, canActivate: [authGuardProfissional]},
  { path: 'edit-gestante', component: FormEditGestanteComponent, canActivate: [authGuardProfissional]},
  { path: 'gestante', component: GestanteComponent, canActivate: [authGuardGestante]},
  { path: 'infos-gestante', component: InfosGestanteComponent, canActivate: [authGuardGestante]},
  { path: 'infos-meu-bebe', component: InfosRecemNascidoComponent, canActivate: [authGuardGestante]},
  { path: 'new-post', component: AddPostComponent, canActivate: [authGuardProfissional]},
  { path: 'new-consulta', component: NewConsultaComponent, canActivate: [authGuardProfissional]},
  { path: 'add-baby', component: NewRecemNascidoComponent, canActivate: [authGuardProfissional]},
  { path: 'list-recem-nascido', component: ListRecemNascidoComponent, canActivate: [authGuardProfissional]},
  { path: 'list-gestante-babies', component: ListBabiesComponent, canActivate: [authGuardGestante]},
  { path: 'list-gestante-calendar', component: CalendarGestanteComponent, canActivate: [authGuardGestante]},
  { path: 'profile-gestante', component: ProfileGestanteComponent, canActivate: [authGuardGestante]},
  { path: 'gestante-profissionais', component: ListProfissionaisComponent, canActivate: [authGuardGestante]},
  { path: 'infos-meu-profissional', component: InfosProfissionalComponent, canActivate: [authGuardGestante]},
  
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
