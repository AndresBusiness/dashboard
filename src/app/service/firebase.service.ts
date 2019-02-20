import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public afs: AngularFirestore) {
   }

  obtenerUbicacionUnidades() {
    return this.afs.collection('ubicacionUnidades',
                              ref => ref.where('activo', '==', true)).snapshotChanges();
  }

  filtrarUnidades(criterio: string) {
    return this.afs.collection('ubicacionUnidades',
                              ref => ref.where('descripcionUbicacion', '==', criterio)).snapshotChanges();
  }

  buscarUnidad(unidad: number) {
    return new Promise<any>((resolve, reject) => {
      this.afs.doc(`ubicacionUnidades/${unidad.toString()}`)
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

  agregarUbicacionUnidades(info: any, numeroTaxi: number ) {
    const data = {
      geoposition: new firebase.firestore.GeoPoint(info.latitug, info.longitud),
      unidad: info.unidad,
      descripcionUbicacion: info.descripcionUbicacion ,
      activo: info.activo,
      chofer: info.chofer,
      llevaPasaje: info.llevaPasaje
    };
    return this.afs.collection('ubicacionUnidades').doc(numeroTaxi.toString()).set(data);
  }

  actualizarPerfilUsuario(usuario: any) {
    const usuarioFirestore: AngularFirestoreDocument<any> = this.afs.doc(`admin/${usuario.uid}`);
    const usuarioAuthAccount = firebase.auth().currentUser;

    const data: any = {
      nombre: usuario.nombre,
      email: usuario.email,
      img: usuario.img
    };
    usuarioFirestore.set(data);

    return usuarioAuthAccount.updateProfile({
            displayName: usuario.nombre,
            photoURL: usuario.img
          });
  }
}
