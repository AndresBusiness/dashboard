import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportesComponent } from './reportes/reportes.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { TabuladorComponent } from './tabulador/tabulador.component';
import { PasajerosComponent } from './pasajeros/pasajeros.component';
import { AuthGuardService } from '../service/guard.service';
import { AdminConfiguracionComponent } from '../admin-configuracion/admin-configuracion.component';
import { AdminMensajesComponent } from '../admin-mensajes/admin-mensajes.component';
import { AdminPerfilComponent } from '../admin-perfil/admin-perfil.component';
import { UsuariosComponent } from './usuarios/usuarios.component';


const pageRoutes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [ AuthGuardService ],
    children: [
      {path: 'dashboard', component: DashboardComponent, data : { titulo: 'Seguimiento Taxistas'}},
      {path: 'reportes', component: ReportesComponent, data : { titulo: 'Reporte de incidencias'} },
      {path: 'solicitudes', component: SolicitudesComponent, data : { titulo: 'Solicitudes a nuevos taxistas'}},
      {path: 'tabulador', component: TabuladorComponent, data : { titulo: 'Tabulador de Tarifas'}},
      {path: 'pasajeros', component: PasajerosComponent, data : { titulo: 'Listado de pasajeros y comentarios'}},
      {path: 'perfil', component: AdminPerfilComponent, data : { titulo: 'Mi Perfil'}},
      {path: 'mensajes', component: AdminMensajesComponent, data : { titulo: 'Mis Mensajes'}},
      {path: 'configuracion', component: AdminConfiguracionComponent, data : { titulo: 'Configuraciones del Sistema'}},
      {path: 'usuarios', component: UsuariosComponent, data : { titulo: 'Usuarios con acceso al sistema'}},
      {path: '', redirectTo: '/dashboard', pathMatch: 'full'}
    ]
   }
];

export const PAGES_ROUTES = RouterModule.forChild(pageRoutes);
