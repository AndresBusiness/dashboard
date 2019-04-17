import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AgregarChoferComponent,
  ],
  imports: [
    BrowserModule,
    PagesModule,
    SharedModule,
    ArchwizardModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    APP_ROUTES,
    LoadingBarModule,
  ],
  providers: [FirebaseService,
   AuthService,
   AuthGuardService,
   ReadjsonService,
   { provide: FirestoreSettingsToken, useValue: {} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
