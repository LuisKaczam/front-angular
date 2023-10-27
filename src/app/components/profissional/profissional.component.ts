import { Component } from '@angular/core';
import { Profissional } from '../../entities/Profissional';

@Component({
  selector: 'app-profissional',
  templateUrl: './profissional.component.html',
  styleUrls: ['./profissional.component.css']
})
export class ProfissionalComponent {
  profissional: Profissional = new Profissional();
}
