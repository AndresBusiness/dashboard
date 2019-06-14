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

  obtenerConcesiones() {
    return this.afs.collection('ciudades/cozumel/concesiones',
                              ref => ref.where('activo', '==', true)).snapshotChanges();
  }

  filtrarConcesiones(criterio: string) {
    return this.afs.collection('ciudades/cozumel/concesiones',
                              ref => ref.where('descripcionUbicacion', '==', criterio)).snapshotChanges();
  }

  buscarConcesion(unidad: number) {
    return   this.afs.doc(`ciudades/cozumel/concesiones/${unidad.toString()}`)
            .valueChanges();
  }


  buscarInfoUnidad(chofer: string) {
    return this.afs.collection('ciudades/cozumel/concesiones',
    ref => ref.where('chofer', '==', chofer)).valueChanges();
  }

  buscarComentariosChoferes(id: string) {
    return this.afs.collection('ciudades/cozumel/rating',
                              ref => ref.where('uidChofer', '==', id)
                              .orderBy('fecha', 'asc').limit(10)).valueChanges();
  }

  buscarInfoVehiculo(concesion: string) {
    return this.afs.collection('vehiculos',
    ref => ref.where('concesion', '==', concesion)).valueChanges();
  }

  buscarInfoVehiculoRegistroChofer(nombre: string) {
    return this.afs.collection('vehiculos',
    ref => ref.where('nombreChoferRegistro', '==', nombre)).valueChanges();
  }

  buscarInfoChofer(id: string) {
    return new Promise<any>((resolve, reject) => {
      this.afs.doc(`choferes/${id}`)
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

  buscarInfoConcesion(concesion: string) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('choferes',
      ref => ref.where('concesion', '==', concesion)).valueChanges()
      .subscribe((data: any) => {
        console.log(data)
        if (data.length > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      }, err => reject(err)
      );
    });
  }


  obtenerInfoChoferes() {
    return this.afs.collection('choferes').snapshotChanges();
  }

  agregarItem(uid: string, value: any) {

    value.geoposition = new firebase.firestore.GeoPoint(value.geoposition._lat, value.geoposition._long)
    return this.afs.collection('ciudades/cozumel/concesiones').doc(uid).set(value);
  }

  actualizarPerfilUsuario(usuario: any) {
    const usuarioFirestore: AngularFirestoreDocument<any> = this.afs.doc(`ciudades/cozumel/admin/${usuario.uid}`);
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
    return this.afs.collection('ciudades/cozumel/turnos').snapshotChanges();
  }

  subirFotoPerfil(nombre: any){
    const storage = firebase.storage();
    const storageRef = storage.ref();
    var file = ''
    var metadata = {
      contentType: 'image/jpeg'
    };

    var uploadTask = storageRef.child('images/' + nombre).put(file, metadata).then(data=>{

    })
  }

}




