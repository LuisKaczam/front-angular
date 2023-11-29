import { Component } from '@angular/core';
import { SidebarService } from '../../sidebar/sidebar.service';
import { GestanteService } from '../gestante.service';
import { formatDate } from '@angular/common';
import { PushNotificationService } from 'src/app/push-notification.service';

@Component({
  selector: 'app-calendar-gestante',
  templateUrl: './calendar-gestante.component.html',
  styleUrls: ['./calendar-gestante.component.css']
})
export class CalendarGestanteComponent {
  sideNavStatus = false;
  week: any = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
  monthSelect: any[] = [];
  dateSelect: Date = new Date();
  months: any[] = [];
  calendarEvents: any[] = [];
  eventDay: any[] =[];
  selectedDay:any[] = [];
  choosed: boolean = false;


  constructor(private sideBarService: SidebarService, private service: GestanteService, private pushNotification: PushNotificationService) {
    this.sideBarService.getSideNavStatus().subscribe(status => {
      this.sideNavStatus = status;
    });
  }

  noSideBar(): void {
    if (this.sideBarService.isSideNavOpen()) {
      this.sideBarService.toggleSideNav();
    }
  }

  ngOnInit(): void {
    this.noSideBar();
    this.getDaysFromDate(this.dateSelect.getMonth() + 1, this.dateSelect.getFullYear() );
    this.listCalendario();   
  }

  clickCloseNotification(){
    this.pushNotification._updateIconNotification$.next();
  }

 
  listCalendario(){
    this.service.getCalendar().subscribe((response) => {
      this.calendarEvents = response;
      for(let i = 0; i < this.calendarEvents.length; i++) {
        let eventDate = new Date(this.calendarEvents[i].data);
        this.eventDay[i] = eventDate.getDate();

      }
  
    })
  }

  isEventDay(day: any): boolean {
    const selectedDate = new Date(this.dateSelect.getFullYear(), this.dateSelect.getMonth(), day.value-1);
  
    for (const event of this.calendarEvents) {
      const eventDate = new Date(event.data);
      if (selectedDate.toDateString() === eventDate.toDateString()) {
        return true; 
      }
    }
  
    return false; 
  }
  


  
  
  



  getDaysFromDate(month: number, year: number): void {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    this.dateSelect = startDate;
    const diffDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
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
      this.months.push({ name: startDate.toLocaleString('default', { month: 'long' }), days: arrayDays });
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
    const fullDate = new Date(year, selectedMonth, day);
    for (const monthDay of this.monthSelect) {
      if (fullDate.getDate() === monthDay.value) {
        this.choosed = true;
        break;
      }
    }
}
}
