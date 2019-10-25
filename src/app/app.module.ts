import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { ReactiveFormsModule , FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

// RUTAS
import { APP_ROUTES } from './app.routes';

// MODULOS
import { PagesModule } from './pages/pages.module';
import { SharedModule } from './shared/shared.module';


// DEPENDENCIAS DE ANGULARFIRE
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule, FirestoreSettingsToken } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment.prod';

// SERVICIOS
import { FirebaseService } from './service/firebase.service';
import { AuthService } from './service/auth.service';
import { AuthGuardService } from './service/guard.service';
import { ReadjsonService } from './service/readjson.service';

// PLUGIN LOADING
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { ArchwizardModule } from 'angular-archwizard';
import { AgregarChoferComponent } from './pages/agregar-chofer/agregar-chofer.component';
import { FunctionsService } from './service/functions.service';
import { HttpModule } from '@angular/http';
import { SanitizeUrlPipe } from './pipes/sanitize-url.pipe';

import {NgxMaskModule, IConfig} from 'ngx-mask';

import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import { registerLocaleData } from '@angular/common';

// importar locales
import localeMX from '@angular/common/locales/es-MX';
import { NgbDateCustomParserFormatter } from './service/dateformat.service';
import { FormularioVehiculosComponent } from './components/formulario-vehiculos/formulario-vehiculos.component';
import { FormularioConcesionesComponent } from './components/formulario-concesiones/formulario-concesiones.component';

import { OrderModule } from 'ngx-order-pipe';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { DetalleChoferComponent } from './pages/detalle-chofer/detalle-chofer.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';


// registrar los locales con el nombre que quieras utilizar a la hora de proveer
registerLocaleData(localeMX, 'es');

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AgregarChoferComponent,
    DetalleChoferComponent,
    UsuariosComponent,
    SanitizeUrlPipe,
    FormularioVehiculosComponent,
    FormularioConcesionesComponent
  ],
  imports: [
    BrowserModule,
    PagesModule,
    SharedModule,
    ArchwizardModule,
    FormsModule,
    AutocompleteLibModule,
    OrderModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    HttpModule,
    HttpClientModule,
    NgxMaskModule.forRoot(),
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({
      backdropBackgroundColour:'rgba(0, 140, 255, 0.2)',
      fullScreenBackdrop:true,
      animationType: ngxLoadingAnimationTypes.chasingDots,
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularFireStorageModule,
    APP_ROUTES,
    LoadingBarModule,
  ],
  providers: [FirebaseService,
   AuthService,
   AuthGuardService,
   ReadjsonService,
   FunctionsService,
   NgbDateCustomParserFormatter,
   {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter},
   { provide: LOCALE_ID, useValue: 'es' },
   { provide: FirestoreSettingsToken, useValue: {} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
