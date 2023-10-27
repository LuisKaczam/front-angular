import { EventEmitter, Injectable, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ProfissionalService } from '../profissional/profissional.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService implements OnInit{
  private sideNavOpen = false;
  private sideNavSubject = new Subject<boolean>();

  constructor(private service:ProfissionalService) {}
  ngOnInit(): void {
    
  }

  toggleSideNav(): void {
    this.sideNavOpen = !this.sideNavOpen;
    this.sideNavSubject.next(this.sideNavOpen);
  }

  isSideNavOpen(): boolean {
    return this.sideNavOpen;
  }

  getSideNavStatus(): Observable<boolean> {
    return this.sideNavSubject.asObservable();
  }
}
