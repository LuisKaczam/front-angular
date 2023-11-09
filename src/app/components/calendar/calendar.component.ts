import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Calendario } from 'src/app/entities/Calendario';
import { Notificacoes } from 'src/app/entities/Notificacoes';
import { ModalService } from '../modals/modal.service';
import { ProfissionalService } from '../profissional/profissional.service';
import { SidebarService } from '../sidebar/sidebar.service';
import { catchError } from 'rxjs';
import { Gestante } from 'src/app/entities/Gestante';
import { PushNotificationService } from 'src/app/push-notification.service';
//import { PushNotificationService } from 'src/app/push-notification.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  sideNavStatus = false;
  @Output() datesArrayEmitter: EventEmitter<any[]> = new EventEmitter();
  week: any = [
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
    'Domingo',
  ];
  monthSelect: any[] = [];
  dateSelect: Date = new Date();
  months: any[] = [];
  calendarModal: boolean = false;
  calendarForm!: FormGroup;
  selectedDate!: string;
  gestantes: any[] = [];
  calendarEvents: any[] = [];
  eventDay: any[] = [];
  datesForm!: FormGroup;
  datesModal: boolean = false;
  datesArray: any[] = [];
  datesError: boolean = false;
  datesNotFound: boolean = false;
  PdfModal: boolean = false;
  dateNow!: Date;
  gestanteId: number = 0;
  userId: number = 0;
  errorDate: boolean = false;

  constructor(
    private sideBarService: SidebarService,
    private pushService: PushNotificationService,
    private modalService: ModalService,
    private profissionaService: ProfissionalService
  ) {
    this.sideBarService.getSideNavStatus().subscribe((status) => {
      this.sideNavStatus = status;
    });
    this.dateNow = new Date();
  }

  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }
  }

  ngOnInit(): void {
    this.noSideBar();

    this.getDaysFromDate(
      this.dateSelect.getMonth() + 1,
      this.dateSelect.getFullYear()
    );
    this.calendarForm = new FormGroup({
      calendarName: new FormControl('', Validators.required),
      calendarDate: new FormControl('', [Validators.required]),
      calendarHour: new FormControl('', Validators.required),
      calendarParticipant: new FormControl(''),
      calendarDescription: new FormControl('', Validators.required),
    });
    this.listGestante();
    this.listCalendario();

    this.profissionaService._calendar$.subscribe(() => {
      this.listCalendario();
    });
    this.datesForm = new FormGroup({
      calendarDateBegin: new FormControl('', Validators.required),
      calendarDateEnd: new FormControl('', Validators.required),
    });
  }

  listGestante() {
    this.profissionaService.listGestante().subscribe((response) => {
      this.gestantes = response;
    });
  }

  listCalendario() {
    this.profissionaService.getCalendar().subscribe((response) => {
      this.calendarEvents = response;
      for (let i = 0; i < this.calendarEvents.length; i++) {
        let eventDate = new Date(this.calendarEvents[i].data);
        this.eventDay[i] = eventDate.getDate();
      }
    });
  }

  isDatePassed(dateValue: string): boolean {
    return dateValue < this.dateNow.toLocaleDateString('pt-BR');
  }

  isEventDay(day: any): boolean {
    const selectedDate = new Date(
      this.dateSelect.getFullYear(),
      this.dateSelect.getMonth(),
      day.value - 1
    );

    for (const event of this.calendarEvents) {
      const eventDate = new Date(event.data);
      if (selectedDate.toDateString() === eventDate.toDateString()) {
        return true;
      }
    }

    return false;
  }

  onModalOpen() {
    this.calendarModal = true;
  }

  onDatesModalOpen() {
    this.datesModal = true;
  }

  onDatesModalClose() {
    const modal = document.getElementById('formCalendarPdf');
    if (modal) {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }

    this.datesForm = new FormGroup({
      calendarDateBegin: new FormControl('', Validators.required),
      calendarDateEnd: new FormControl('', Validators.required),
    });

    this.datesNotFound = false;
    this.datesError = false;
  }

  onModalClose() {
    this.errorDate = false;
    const modal = document.getElementById('formCalendar');
    if (modal) {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
    this.calendarForm = new FormGroup({
      calendarName: new FormControl('', Validators.required),
      calendarDate: new FormControl('', Validators.required),
      calendarHour: new FormControl('', Validators.required),
      calendarParticipant: new FormControl(''),
      calendarDescription: new FormControl('', Validators.required),
    });
  }

  getSelectedGestante(event: any) {
    const selectedValue = event.target.value;
    const values = selectedValue.split(' ');
    this.userId = parseInt(values[0]);
    this.gestanteId = parseInt(values[1]);
    console.log(this.gestanteId);
    console.log('user', this.userId);
  }

  registerDate() {
    const calendarForm = this.calendarForm!;
    const date = calendarForm.get('calendarDate');
    const hour = calendarForm.get('calendarHour');
    const name = calendarForm.get('calendarName');
    const participant = calendarForm.get('calendarParticipant')!;
    const description = calendarForm.get('calendarDescription');
    console.log('gesta: ', this.gestanteId);

    if (calendarForm.invalid) {
      return;
    } else {
      const calendar = new Calendario();
      calendar.data = date?.value;
      calendar.nomeEvento = name?.value;
      calendar.descricao = description?.value;
      calendar.hora = hour?.value;

      if (participant.value !== '') {
        const notificacao = new Notificacoes();
        notificacao.descricaoProfissional = 'Você marcou um novo evento.';
        notificacao.tipoProfissional = 'Evento';
        notificacao.tituloProfissional = 'Novo Evento';
        notificacao.tipoGestante = 'Evento';
        notificacao.tituloGestante = 'Novo evento';
        notificacao.lidaGestante = false;
        notificacao.lidaProfissional = false;
        notificacao.descricaoGestante = 'Nova consulta marcada';

        this.profissionaService
          .insertCalendarGestante(calendar, this.gestanteId)
          .pipe(
            catchError((error) => {
              console.error('Falha ao inserir evento', error);
              return [];
            })
          )
          .subscribe(() => {
            this.profissionaService
              .newNotification(notificacao, this.gestanteId)
              .pipe(
                catchError((error) => {
                  console.error('Falha ao criar notificação', error);
                  return [];
                })
              )
              .subscribe(() => {
                this.pushService
                  .getPwaObject(this.userId)
                  .pipe(
                    catchError((error) => {
                      console.error('Falha ao obter objeto PWA', error);
                      return [];
                    })
                  )
                  .subscribe(async (response) => {
                    const pwaObject = response;
                    if (pwaObject) {
                      for (let i = 0; i < pwaObject.length; i++) {
                        console.log(pwaObject);

                        this.profissionaService
                          .sendPushNotification(
                            notificacao.tituloGestante,
                            notificacao.descricaoGestante,
                            pwaObject[i]
                          )
                          .pipe(
                            catchError((error) => {
                              console.error(
                                'Falha ao enviar notificação push',
                                error
                              );
                              return [];
                            })
                          )
                          .subscribe(() => {
                            document.getElementById('btn-close')?.click();
                            this.onModalClose();
                          });
                      }
                    } else {
                      document.getElementById('btn-close')?.click();
                      this.onModalClose();
                    }
                  });
              });
          });
      } else {
        this.profissionaService
          .insertCalendar(calendar)
          .pipe(
            catchError((error) => {
              console.error('Falha ao inserir evento', error);
              return [];
            })
          )
          .subscribe(() => {
            document.getElementById('btn-close')?.click();
            this.onModalClose();
          });
      }
    }
    document.getElementById('btn-close')?.click();
    this.onModalClose();
  }

  datesToPdf() {
    const datesForm = this.datesForm!;
    const begin = datesForm.get('calendarDateBegin')!;
    const end = datesForm.get('calendarDateEnd')!;

    if (datesForm.invalid) {
      return;
    }
    for (let i = 0; i < this.calendarEvents.length; i++) {
      console.log(this.calendarEvents[i].data);
      if (
        this.calendarEvents[i].data >= begin.value &&
        this.calendarEvents[i].data <= end.value
      ) {
        this.datesArray[i] = this.calendarEvents[i];
      }
    }
    console.log(this.datesArray);
    if (begin.value > end.value) {
      this.datesError = true;
      return;
    }

    if (this.datesArray.length === 0) {
      this.datesNotFound = true;
      return;
    }

    if (this.datesArray.length > 0) {
      this.generatePdf();
    }
  }

  generatePdf() {
    setTimeout(() => {
      const pdfButton = document.getElementById('pdf-btn');
      if (pdfButton) {
        pdfButton.setAttribute('target', '_self');
        pdfButton.click();
      } else {
        console.error('O botão não foi encontrado.');
      }
    }, 2000);
  }

  changeDateInput() {
    this.datesError = false;
    this.datesNotFound = false;
  }

  getDaysFromDate(month: number, year: number): void {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    this.dateSelect = startDate;
    const diffDays =
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    const numberDays = Math.round(diffDays);
    const arrayDays = Array.from({ length: numberDays + 1 }, (_, index) => {
      const dayValue = index + 1;
      const dayObject = new Date(year, month - 1, dayValue);
      return {
        name: this.week[dayObject.getDay()],
        value: dayValue,
        indexWeek: dayObject.getDay(),
      };
    });
    this.monthSelect = arrayDays;
  }

  getYearMonths(year: number): void {
    this.months = [];
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      const daysInMonth = endDate.getDate();
      const arrayDays = Array.from({ length: daysInMonth }, (_, index) => {
        const dayValue = index + 1;
        const dayObject = new Date(year, month, dayValue);
        return {
          name: this.week[dayObject.getDay()],
          value: dayValue,
          indexWeek: dayObject.getDay(),
        };
      });
      this.months.push({
        name: startDate.toLocaleString('default', { month: 'long' }),
        days: arrayDays,
      });
    }
  }

  changeMonth(flag: number): void {
    const currentYear = this.dateSelect.getFullYear();
    const currentMonth = this.dateSelect.getMonth() + 1;
    const nextDate = new Date(currentYear, currentMonth - 1 + flag, 1);
    this.getDaysFromDate(nextDate.getMonth() + 1, nextDate.getFullYear());
    const newYear = currentYear + flag;
    this.getYearMonths(newYear);
  }

  getLocalizedMonth(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { month: 'long' };
    return date.toLocaleDateString('pt-BR', options);
  }

  clickDay(day: any, year: number): void {
    const selectedMonth = this.dateSelect.getMonth();
    const fullDate = new Date(year, selectedMonth, day.value);
    const formattedDate = fullDate.toISOString().substr(0, 10);
    this.selectedDate = formattedDate;
    if (fullDate > this.dateNow) {
      this.calendarForm.get('calendarDate')?.setValue(formattedDate);
      this.onModalOpen();
    } else {
      this.errorDate = true;
    }
  }
}
