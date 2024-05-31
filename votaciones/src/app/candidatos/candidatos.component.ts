import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Firestore, collection, doc, getDocs, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';

interface Candidato {
  nombre: string;
  partido: string;
  votos: number;
  imagen: string;
}

@Component({
  selector: 'app-candidatos',
  templateUrl: './candidatos.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class CandidatosComponent implements OnChanges {
  @Input() filters: { casilla: string, seccion: string } = { casilla: '', seccion: '' };

  candidatos: Candidato[] = [
    { nombre: 'Juan Antonio Paredes Gomez', partido: "PAN", votos: 0, imagen: 'assets/pan.png' },
    { nombre: 'Eder Rafael Lozano Peña', partido: "PRI", votos: 0, imagen: 'assets/pri.png' },
    { nombre: 'Angelica Reyes Gonzalez', partido: "PRD", votos: 0, imagen: 'assets/prd.png' },
    { nombre: 'Karla Sayuri Molinero Garcia', partido: "PVEM", votos: 0, imagen: 'assets/pvem.png' },
    { nombre: 'Juan Fernando Fragoso Torres', partido: "PT", votos: 0, imagen: 'assets/pt.png' },
    { nombre: 'Maria de los Angeles Zuppa Villegaz', partido: "MC", votos: 0, imagen: 'assets/mc.png' },
    { nombre: 'Kenia Idalid Maldonado Rodriguez', partido: "MORENA", votos: 0, imagen: 'assets/morena.png' },
    { nombre: 'Andrea Aguilar Rosales', partido: "NUEVA ALIANZA", votos: 0, imagen: 'assets/nuevaAlianza.png' },
    { nombre: 'NULOS', partido: "NULOS", votos: 0, imagen: 'assets/nulos.png' }
  ];


  constructor(private firestore: Firestore) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filters']) {
      this.loadVotos();
    }
  }

  async loadVotos() {
    const colRef = collection(this.firestore, 'votos');
    const q = query(colRef, where('casilla', '==', this.filters.casilla), where('seccion', '==', this.filters.seccion));
    const querySnapshot = await getDocs(q);

    // Reset votos to 0 before fetching data
    this.candidatos.forEach(candidato => candidato.votos = 0);

    querySnapshot.forEach(doc => {
      const data = doc.data() as { nombre: string; votos: number };
      const candidato = this.candidatos.find(c => c.nombre === data.nombre);
      if (candidato) {
        candidato.votos = data.votos;
      }
    });
  }

  async incrementarVotos(candidato: Candidato) {
    candidato.votos += 1;

    const colRef = collection(this.firestore, 'votos');
    const q = query(colRef, where('nombre', '==', candidato.nombre), where('casilla', '==', this.filters.casilla), where('seccion', '==', this.filters.seccion));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, { votos: candidato.votos });
    } else {
      await setDoc(doc(colRef), {
        nombre: candidato.nombre,
        votos: candidato.votos,
        partido: candidato.partido,
        casilla: this.filters.casilla,
        seccion: this.filters.seccion
      });
    }
  }
}
