import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public afs: AngularFirestore) {
   }

  obtenerUbicacionTaxistas() {
    return this.afs.collection('ubicacionTaxistas',
                              ref => ref.where('activo', '==', true)
                              .where('enTurno', '==', true)
                              .limit(20)).snapshotChanges();
  }

  obtenerInfoTaxistas() {
    return this.afs.collection('infoTaxistas',
                              ref => ref.where('activo', '==', true)
                              .where('enTurno', '==', true)
                              .limit(15)).snapshotChanges();
  }

  buscarInfoTaxistas(id: string) {
    return new Promise<any>((resolve, reject) => {
      this.afs.doc(`infoTaxistas/${id}`)
      .valueChanges()
      .subscribe((data: any) => {
        if (data) {
          resolve(data);
        } else {
          console.log('NO SE ENCONTRO TAXISTA CON ESE UID');
        }
      }, err => reject(err)
      );
    });
  }

  agregarInfoTaxistasFake(info: any, number: number ) {
  return this.afs.collection('infoTaxistas').doc(number.toString()).set(info);
  }

  agregarUbicacionTaxistasFake(info: any, numeroTaxi: string ) {
    const data = {
      geoposition: new firebase.firestore.GeoPoint(info.latitude, info.longitude),
      activo: info.activo,
      enBase: info.enBase ,
      enMiniSitio: info.enMiniSitio,
      enTurno: info.enTurno,
      libre: info.libre
    };
    return this.afs.collection('ubicacionTaxistas').doc(numeroTaxi).set(data);
    }

}
