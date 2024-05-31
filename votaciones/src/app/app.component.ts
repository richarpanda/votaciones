import { Component } from '@angular/core';
import { FiltroComponent } from './filtro/filtro.component';
import { CandidatosComponent } from './candidatos/candidatos.component';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    FiltroComponent,
    CandidatosComponent
  ]
})
export class AppComponent {
  filters: { casilla: string, seccion: string } = { casilla: '', seccion: '' };
  private chart: Chart | undefined;

  constructor(private firestore: Firestore) { }

  onFiltersChanged(filters: { casilla: string, seccion: string }) {
    this.filters = filters;
    this.loadGraficaData();
  }

  async loadGraficaData() {
    const colRef = collection(this.firestore, 'votos');
    const q = query(colRef, where('casilla', '==', this.filters.casilla), where('seccion', '==', this.filters.seccion));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);

    const candidatos = querySnapshot.docs.map(doc => doc.data() as { partido: string, votos: number });

    const labels = candidatos.map(c => c.partido);
    const votos = candidatos.map(c => c.votos);

    if (this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = votos;
      this.chart.update();
    } else {
      const ctx = document.getElementById('graficaVotos') as HTMLCanvasElement;
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Votos',
            data: votos,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
}
