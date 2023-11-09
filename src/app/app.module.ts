import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule, isDevMode } from '@angular/core';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BottomNavigationComponent } from './components/bottom-navigation/bottom-navigation.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { FooterComponent } from './components/footer/footer.component';
import { GestanteComponent } from './components/gestante/home/gestante.component';
import { InfosGestanteComponent } from './components/gestante/infos-gestante/infos-gestante.component';
import { InfosRecemNascidoComponent } from './components/gestante/infos-recem-nascido/infos-recem-nascido.component';
import { LoginGestanteComponent } from './components/gestante/login-gestante/login-gestante.component';
import { HeaderSidebarComponent } from './components/header-sidebar/header-sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginInterfaceComponent } from './components/login-interface/login-interface.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FormEditGestanteComponent } from './components/profissional/form-edit-gestante/form-edit-gestante.component';
import { FormRegisterGestanteComponent } from './components/profissional/form-register-gestante/form-register-gestante.component';
import { HistoricoGestanteComponent } from './components/profissional/historico-gestante/historico-gestante.component';
import { HomeComponent } from './components/profissional/home/home.component';
import { ProfissionalComponent } from './components/profissional/profissional.component';
import { BebeComponent } from './components/profissional/recem-nascido/after-birth/bebe/bebe.component';
import { RecemNascidoComponent } from './components/profissional/recem-nascido/before-birth/recem-nascido.component';
import { PublicationsComponent } from './components/publications/publications.component';
import { RegisterComponent } from './components/register/register.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import {AngularFireMessagingModule} from '@angular/fire/compat/messaging'
import { AddPostComponent } from './components/add-post/add-post.component';
import { DropDirective } from './directives/drop.directive';
import { NewConsultaComponent } from './components/new-consulta/new-consulta.component';
import { NewRecemNascidoComponent } from './components/profissional/recem-nascido/before-birth/new-recem-nascido/new-recem-nascido.component';
import { ListRecemNascidoComponent } from './components/profissional/recem-nascido/after-birth/list-recem-nascido/list-recem-nascido.component';
import { HeaderGestanteComponent } from './components/gestante/header-gestante/header-gestante.component';
import { SideBarGestanteComponent } from './components/gestante/side-bar-gestante/side-bar-gestante.component';
import { BottomNavbarGestanteComponent } from './components/gestante/bottom-navbar-gestante/bottom-navbar-gestante.component';
import { ListBabiesComponent } from './components/gestante/list-babies/list-babies.component';
import { CalendarGestanteComponent } from './components/gestante/calendar-gestante/calendar-gestante.component';
import { ProfileGestanteComponent } from './components/gestante/profile-gestante/profile-gestante.component';
import { ListProfissionaisComponent } from './components/gestante/list-profissionais/list-profissionais.component';
import { InfosProfissionalComponent } from './components/gestante/infos-profissional/infos-profissional.component';
import { NgxPrintModule } from 'ngx-print';
import { ServiceWorkerModule } from '@angular/service-worker';
import { PushNotificationService } from './push-notification.service';
import { GlobalErrorHandler } from 'global-error-handler';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginInterfaceComponent,
    FooterComponent,
    RegisterComponent,
    HomeComponent,
    ProfissionalComponent,
    SidebarComponent,
    HeaderSidebarComponent,
    BottomNavigationComponent,
    FormRegisterGestanteComponent,
    FormEditGestanteComponent,
    HistoricoGestanteComponent,
    CalendarComponent,
    ProfileComponent,
    PublicationsComponent,
    RecemNascidoComponent,
    BebeComponent,
    GestanteComponent,
    InfosGestanteComponent,
    InfosRecemNascidoComponent, 
    LoginGestanteComponent, AddPostComponent, DropDirective, NewConsultaComponent, NewRecemNascidoComponent, ListRecemNascidoComponent, HeaderGestanteComponent, SideBarGestanteComponent, BottomNavbarGestanteComponent, ListBabiesComponent, CalendarGestanteComponent, ProfileGestanteComponent, ListProfissionaisComponent, InfosProfissionalComponent, 
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    JwtModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireMessagingModule,
    NgxPrintModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  exports: [
    RouterModule
  ],

  providers:[
    PushNotificationService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  
  ],

  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
