import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/service/firebase.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FunctionsService } from 'src/app/service/functions.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  listUser: any[]=[];
  cargarUsuarios: boolean = true;
  public forma:FormGroup;
  public expRefEmail    = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
  imageSrc: any;
  fileImg: any;
  admin: any;
  uidAdmin: string;
  counttimeUploading: number= 0;
  public loading = false;

  uploadProgress: Observable<number>;
  uploadURL: Observable<string>;

  constructor(public servicioFirebase : FirebaseService, 
    public servicioNode: FunctionsService,
    private _storage: AngularFireStorage) {
    this.uidAdmin = localStorage.getItem('uid');
    this.admin=  JSON.parse(localStorage.getItem('user'));

    this.forma = new FormGroup({
      'nombre':          new FormControl('', Validators.required),
      'correo':          new FormControl('', [Validators.required, Validators.pattern(this.expRefEmail)]),
      'img':             new FormControl('', Validators.required),
    });
    
    this.servicioFirebase.obtenerAdministradores()
    .subscribe(data=>  {
      console.log(data);
      this.cargarUsuarios = false;
      this.listUser = data;
    })
   }
   
   capitalizaCamelCase(value: string , control) {
    let newString = '';
    if (value) {
      const cadenas = value.split(' ');
      if (cadenas.length > 1) {
        for (let index = 0; index < cadenas.length; index++) {
          let element = cadenas[index];
              element = (element.charAt(0).toUpperCase() + element.slice(1));
          if (index  !== (cadenas.length - 1 )) {
            element = element + ' ';
          }
          newString += element;
        }
      } else {
        newString = value.charAt(0).toUpperCase() + value.slice(1);
      }
      this.forma.controls[control].setValue(newString);
    }
  } 

  guardarUsuario(){
   
    this.loading = true;
    const filepath = `admin/${ this.forma.value.correo }`;
    const fileRef = this._storage.ref(filepath);
    const task = this._storage.upload(filepath, this.fileImg);
    this.uploadProgress = task.percentageChanges();
    this.uploadProgress.subscribe(count => {
      this.counttimeUploading = count;
    });

    task.snapshotChanges().pipe(
      finalize(() => {
          this.uploadURL = fileRef.getDownloadURL()
          this.uploadURL.subscribe(urlPath => {
            let obj = {
              'nombre': this.forma.value.nombre,
              'correo': this.forma.value.correo,
              'img': urlPath,
              'uidUserSystem': this.uidAdmin,
              'nombreUserSystem': this.admin.nombre, 
              'imgUserSystem': this.admin.img
            }
             this.servicioNode.registarAdmin(obj).subscribe(data=>{
               this.loading = false;
               if(data){
                 swal('Chofer registrado!', 'Continuar', 'success').then(()=>{
                   this.counttimeUploading = 0;
                   this.forma.controls['nombre'].setValue('');          
                   this.forma.controls['correo'].setValue('');          
                   this.forma.controls['img'].setValue('');   
                 });
               }
             });
          });

        })).subscribe();
    
  }

  upload(event) {
    this.fileImg = event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => this.imageSrc = reader.result;
    reader.readAsDataURL(this.fileImg);
  }

  ngOnInit() {
  }

}
