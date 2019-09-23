import { ModalChoferComponent } from './../shared/modal-chofer/modal-chofer.component';
import { NgModule } from '@angular/core';

// COMPONENTES
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportesComponent } from './reportes/reportes.component';
import { PasajerosComponent } from './pasajeros/pasajeros.component';
import { TabuladorComponent } from './tabulador/tabulador.component';
import { DetalleChoferComponent } from './detalle-chofer/detalle-chofer.component';
import { ChoferesComponent } from './choferes/choferes.component';
import { HeaderComponent } from '../shared/header/header.component';
import { AdminConfiguracionComponent } from '../admin-configuracion/admin-configuracion.component';
import { AdminMensajesComponent } from '../admin-mensajes/admin-mensajes.component';
import { AdminPerfilComponent } from '../admin-perfil/admin-perfil.component';

// MODULOS
import { SharedModule } from '../shared/shared.module';

// RUTAS
import { PAGES_ROUTES } from './pages.routes';

// FORMULARIO
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// PIPES
import { KeysPipe } from '../pipes/keys.pipe';
import { BrowserModule } from '@angular/platform-browser';

// PLUGIN
import { AgmCoreModule } from '@agm/core';

// PLUGINS
import { GridModule } from 'ng2-jsgrid';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MonitoreoComponent } from './monitoreo/monitoreo.component';
import { Ng2OdometerModule } from 'ng2-odometer';
import { GraficaBarrasComponent } from '../components/grafica-barras/grafica-barras.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ReportesComponent,
    PasajerosComponent,
    TabuladorComponent,
    ChoferesComponent,
    HeaderComponent,
    AdminConfiguracionComponent,
    AdminMensajesComponent,
    AdminPerfilComponent,
    PagesComponent,
    KeysPipe,
    ModalChoferComponent,
    GraficaBarrasComponent,
    MonitoreoComponent
  ],
  exports: [
    DashboardComponent,
    ReportesComponent,
    PasajerosComponent,
    TabuladorComponent,
    GraficaBarrasComponent,
    HeaderComponent,
    AdminConfiguracionComponent,
    AdminMensajesComponent,
    AdminPerfilComponent,
    ModalChoferComponent,
    GraficaBarrasComponent
  ],
  imports: [
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    Ng2SmartTableModule,
    BrowserModule,
    //NgbModule.forRoot(),
    GridModule.forRoot(),
    Ng2OdometerModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDCSZP6QgfBgbUa3jsq5rnVAtdYHuZxTgM'
     }),
    PAGES_ROUTES
  ],
  providers: [
    NgbActiveModal
  ],
  entryComponents: [
    ModalChoferComponent
  ]
})
export class PagesModule { }
