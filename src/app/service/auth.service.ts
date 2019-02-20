import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  usuario: any;
  uid: string;

  constructor(private afAuth: AngularFireAuth,
              private afBD: AngularFirestore,
              private router: Router) {
    this.cargarStorage();
   }

   cargarStorage() {
    if ( localStorage.getItem('uid')) {
      this.uid = localStorage.getItem('uid');
      this.usuario = JSON.parse( localStorage.getItem('user') );
    } else {
      this.uid = '';
      this.usuario = null;
    }
  }

  obtenerUsuario() {
    return JSON.stringify(this.usuario);
  }


   Login(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
      .then(res => {
        resolve(res.user);
      }, err => reject(err));
    });
  }


  Logout() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.auth.signOut();
        this.borrarStorage();
        resolve();
      } else {
        reject();
      }
    });
  }

 isAuthenticated() {
    return ( this.uid.length > 5 ) ? true : false;
 }

 _obtenerUsuarioCloudStorage(id: string) {
    return new Promise<any>((resolve, reject) => {
      this.afBD.doc(`admin/${id}`)
        .valueChanges()
        .subscribe((data: any) => {
            if (data) {
            this.guardarStorage(id, data);
            resolve(data);
            } else {
            console.log('NO SE ENCONTRO USUARIO CON ESE UID');
            }
        }, err => reject(err)
        );
    });
}

guardarStorage( id: string, usuario: any ) {
  localStorage.setItem('uid', id);
  this.uid = id;
  this.actualizarUsuarioStore(usuario);
}

actualizarUsuarioStore(usuario:any){
  localStorage.setItem('user', JSON.stringify(usuario));
  this.usuario = usuario;
}

borrarStorage() {
  localStorage.removeItem('user');
  localStorage.removeItem('uid');
  this.uid = '';
  this.usuario = null;
}

}
