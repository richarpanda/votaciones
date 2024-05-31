import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CasillasService } from '../services/casillas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FiltroComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<{ casilla: string, seccion: string }>();
  @Input() filters: { casilla: string, seccion: string } = { casilla: '', seccion: '' };
  casilla = '';
  seccion = '';
  casillas: any[] = [];
  secciones: string[] = [];
  casillasFiltradas: string[] = [];
  filtersApplied = false;
  appliedCasilla = '';
  appliedSeccion = '';

  constructor(private casillasService: CasillasService, private router: Router) { }

  ngOnInit() {
    this.casillasService.getCasillas().subscribe(data => {
      this.casillas = data;
      this.secciones = [...new Set(this.casillas.map(item => item.SECCION))];
    });
  }

  onSeccionChange() {
    this.casillasFiltradas = this.casillas
      .filter(item => item.SECCION === this.seccion)
      .map(item => item.CASILLA.trim());
  }

  applyFilters() {
    this.filtersApplied = true;
    this.appliedCasilla = this.casilla;
    this.appliedSeccion = this.seccion;
    this.filtersChanged.emit({ casilla: this.casilla, seccion: this.seccion });
  }
}
