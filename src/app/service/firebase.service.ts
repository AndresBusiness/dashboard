import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { filter } from 'rxjs/operators';

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
    return   this.afs.doc(`ubicacionUnidades/${unidad.toString()}`)
            .valueChanges()
    /*return new Promise<any>((resolve, reject) => {
      this.afs.doc(`ubicacionUnidades/${unidad.toString()}`)
      .valueChanges()
      .subscribe((data: any) => {
        resolve(data);
      }, err => reject(err)
      );
    });*/
  }

  buscarInfoChoferes(id: string) {
    return new Promise<any>((resolve, reject) => {
      this.afs.doc(`infoChoferes/${id}`)
      .valueChanges()
      .subscribe((data: any) => {
        if (data) {
          resolve(data);
        } else {
          console.log('NO SE ENCONTRO TAXISTA CON ESE UID: ' , id);
        }
      }, err => reject(err)
      );
    });
  }

  buscarComentariosChoferes(id: string) {
    return this.afs.collection('rating',
                              ref => ref.where('uidChofer', '==', id)
                              .orderBy('fecha','asc').limit(10)).valueChanges();
  }

  obtenerInfoChoferes() {
    return this.afs.collection('infoChoferes',
                              ref => ref.limit(50)).snapshotChanges();
  }

  agregarItem(uid: string, value: any) {

  
    return this.afs.collection('roll').doc(uid).set(value);
     /*return  this.afs.collection('ubicacionUnidades')
     .doc(numeroconcesion).update(
       {
      "activo": value.activo,
      "capacidad": value.capacidad,
      "chofer": value.chofer,
      "conRampa": value.conRampa,
      "descripcionUbicacion": value.descripcionUbicacion,
      "geoposition": new firebase.firestore.GeoPoint(value.geoposition._lat, value.geoposition._long),
      "idPush": "PUSH_ID",
      "img": value.img,
      "llevaPasaje":  value.llevaPasaje,
      "nombre": value.nombre,
      "unidad": value.unidad
       });*/
  }

  actualizarItem(numeroconcesion: string, capacidad:number, conRampa:boolean) {
    // return this.afs.collection('ubicacionUnidades').doc(info.correo).set(info);
      return  this.afs.collection('ubicacionUnidades')
      .doc(numeroconcesion).update(
        {
         conRampa: conRampa,
         capacidad: capacidad
        });
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

  obtenerRolles() {
    return this.afs.collection('roll').snapshotChanges();
  }
}
