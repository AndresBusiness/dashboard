import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public afs: AngularFirestore) {
   }

  obtenerConcesiones() {
    // return this.afs.collection('concesiones',
    //                           ref => ref.where('activo', '==', true)).snapshotChanges();
    return this.afs.collection('concesiones').snapshotChanges();
  }

  filtrarConcesiones(criterio: string) {
    return this.afs.collection('concesiones',
                              ref => ref.where('descripcionUbicacion', '==', criterio)).snapshotChanges();
  }

  buscarConcesion(unidad: number) {
    return   this.afs.doc(`concesiones/${unidad.toString()}`)
            .valueChanges().pipe(take(1));
  }

  obtenerAdministradores() {
    return this.afs.collection('admin').valueChanges().pipe(take(1));
  }


  buscarInfoUnidad(chofer: string) {
    return this.afs.collection('concesiones',
    ref => ref.where('chofer', '==', chofer)).valueChanges().pipe(take(1));
  }

  buscarComentariosChoferes(id: string) {
    return this.afs.collection('rating',
                              ref => ref.where('uidChofer', '==', id)
                              .orderBy('fecha', 'asc').limit(10)).valueChanges().pipe(take(1));
  }

  buscarInfoVehiculo(concesion: string) {
    return this.afs.collection('vehiculos',
    ref => ref.where('concesion', '==', concesion)).valueChanges().pipe(take(1));
  }

  buscarInfoVehiculoFijosChofer(uid) {
    return this.afs.collection('vehiculos',
    ref => ref.where('modalidad', '==', '1')
              .where('choferes', 'array-contains', uid)).valueChanges().pipe(take(1));
  }
  buscarInfoVehiculoPostureroChofer(uid: string) {
    return this.afs.collection('vehiculos',
    ref => ref.where('uidChoferRegistro', '==', uid)
              .where('modalidad', '==', '0')).valueChanges().pipe(take(1));
  }

  buscarInfoChofer(id: string) {
    return new Promise<any>((resolve, reject) => {
      this.afs.doc(`choferes/${id}`)
      .valueChanges().pipe(take(1)) 
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

  buscarInfoConcesion(data: string, field:string) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('choferes',
      ref => ref.where(field, '==', data)).valueChanges().pipe(take(1)) 
      .subscribe((data: any) => {
        if (data.length > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      }, err => reject(err)
      );
    });
  }

  verificarConcesion(concesion: string) {
    return new Promise<any>((resolve, reject) => {
      this.afs.doc(`concesiones/${concesion}`)
      .valueChanges().pipe(take(1)) 
      .subscribe((data: any) => {
        if (data) {
          resolve(true);
        } else {
          resolve(false);
        }
      }, err => reject(err)
      );
    });
  }


  obtenerInfoChoferes() {
    return this.afs.collection('choferes').valueChanges().pipe(take(1)) 
  }

  agregarItem(uid: string, value: any) {

    value.geoposition = new firebase.firestore.GeoPoint(value.geoposition._lat, value.geoposition._long)
    return this.afs.collection('concesiones').doc(uid).set(value);
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
    return this.afs.collection('turnos').snapshotChanges();
  }

  subirFotoPerfil(nombre: any){
    const storage = firebase.storage();
    const storageRef = storage.ref();
    var file = ''
    var metadata = {
      contentType: 'image/jpeg'
    };

    // var uploadTask = storageRef.child('images/' + nombre).put(file, metadata).then(data=>{

    // })
  }

}




