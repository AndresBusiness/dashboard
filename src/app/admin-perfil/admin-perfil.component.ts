import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FirebaseService } from '../service/firebase.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-admin-perfil',
  templateUrl: './admin-perfil.component.html',
  styleUrls: ['./admin-perfil.component.css']
})
export class AdminPerfilComponent implements OnInit {

  usuario: any;
  uid: string;

  imagenSubir: File;
  imagenTemp: string;


  constructor(public _usuarioService: AuthService,
              private _fireStore: FirebaseService) {
    this.usuario = this._usuarioService.usuario;
    this.uid = this._usuarioService.uid;
   }

  ngOnInit() {
  }

  guardar(info: any) {
    this.usuario.uid = this.uid;
    this.usuario.nombre = info.nombre;
    this._fireStore.actualizarPerfilUsuario(this.usuario)
    .then( data => {
      this._usuarioService.actualizarUsuarioStore(this.usuario);
      swal('Listo!', 'Has actualizado tu nombre de perfil', 'success');
    });
  }

  cambiarImagen() {

  }

}
