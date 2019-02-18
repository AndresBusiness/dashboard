import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportesComponent } from './reportes/reportes.component';
import { PasajerosComponent } from './pasajeros/pasajeros.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { TabuladorComponent } from './tabulador/tabulador.component';


// MODULOS
import { SharedModule } from '../shared/shared.module';

// RUTAS
import { PAGES_ROUTES } from './pages.routes';

// FORMULARIO
import { FormsModule } from '@angular/forms';

// ng2-chart
import { ChartsModule } from 'ng2-charts';

// PIPES
import { KeysPipe } from '../pipes/keys.pipe';
import { BrowserModule } from '@angular/platform-browser';

// PLUGIN
import { AgmCoreModule } from '@agm/core';
import { AdminConfiguracionComponent } from '../admin-configuracion/admin-configuracion.component';
import { AdminMensajesComponent } from '../admin-mensajes/admin-mensajes.component';
import { AdminPerfilComponent } from '../admin-perfil/admin-perfil.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
// PLUGINS
import { GridModule } from 'ng2-jsgrid';
import { HeaderComponent } from '../shared/header/header.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  declarations: [
    DashboardComponent,
    ReportesComponent,
    PasajerosComponent,
    TabuladorComponent,
    SolicitudesComponent,
    HeaderComponent,
    AdminConfiguracionComponent,
    AdminMensajesComponent,
    AdminPerfilComponent,
    PagesComponent,
    KeysPipe,
    UsuariosComponent
  ],
  exports: [
    DashboardComponent,
    ReportesComponent,
    PasajerosComponent,
    TabuladorComponent,
    HeaderComponent,
    SolicitudesComponent,
    AdminConfiguracionComponent,
    AdminMensajesComponent,
    AdminPerfilComponent
  ],
  imports: [
    SharedModule,
    FormsModule,
    ChartsModule,
    Ng2SmartTableModule,
    BrowserModule,
    GridModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBIjYiShatFSJp6Uop7Fy1HAi2doE-8EAg'
     }),
    PAGES_ROUTES
  ]
})
export class PagesModule { }
