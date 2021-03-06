import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { filter, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private $_subscriptions: Subscription;
  
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


  obtenerViajesChofer(uid: string, status:string, from?:any, to?:any) {
    return this.afs.collection('viajes',
    ref => ref.where('uidChofer', '==', uid)
              .where('estatus', '==', status)
              .where('fecha', '>=', from)
              .where('fecha', '<=', to)).valueChanges().pipe(take(1));
  }


  buscarInfoChofer(id: string) {
   return this.afs.doc(`choferes/${id}`).valueChanges().pipe(take(1)) 
  }

  buscarInfoConcesion(data: string, field:string) {
    return  this.afs.collection('choferes',
             ref => ref.where(field, '==', data)).valueChanges().pipe(take(1))
  }

  obtenerCollection(collection:string, field:string){
    return new Promise((resolve, reject) => {
       if (!JSON.parse(localStorage.getItem(collection))) {
         this.$_subscriptions = this.afs.collection(collection,
           x => x
           .orderBy(field))
           .valueChanges().pipe(take(1))
           .subscribe(data => {
             localStorage.setItem(collection, JSON.stringify(data));
             resolve(data);
             this.$_subscriptions.unsubscribe();
           });
       } else{
          let list = JSON.parse(localStorage.getItem(collection));
          resolve(list);
       }
    });
  }


  addItemLocalStorage(objeto:any, collection:string){
    let list = JSON.parse(localStorage.getItem(collection));
    list.push(objeto);
    localStorage.setItem(collection, JSON.stringify(list));
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
