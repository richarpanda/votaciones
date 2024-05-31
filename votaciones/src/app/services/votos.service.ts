import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class VotosService {
  constructor(private firestore: AngularFirestore) { }

  getCandidatos() {
    return this.firestore.collection('candidatos').valueChanges();
  }

  incrementarVoto(casilla: string, seccion: string, candidatoId: number) {
    const votoRef = this.firestore.collection('votos').doc(`${casilla}-${seccion}-${candidatoId}`);
    this.firestore.firestore.runTransaction(async (transaction: { get: (arg0: any) => any; update: (arg0: any, arg1: { count: any; }) => void; set: (arg0: any, arg1: { count: number; }) => void; }) => {
      const doc = await transaction.get(votoRef.ref);
      if (doc.exists) {
        transaction.update(votoRef.ref, { count: doc.data()?.count + 1 });
      } else {
        transaction.set(votoRef.ref, { count: 1 });
      }
    });
  }

  getVotos(casilla: string, seccion: string) {
    return this.firestore.collection('votos', ref => ref.where('casilla', '==', casilla).where('seccion', '==', seccion)).valueChanges();
  }
}
