import { RouterModule, Routes} from '@angular/router';

import { LoginComponent } from './login/login.component';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';
import { PoliticasPrivacidadConductoresComponent } from './conductores/politicas-privacidad-conductores/politicas-privacidad-conductores.component';
import { PoliticasPrivacidadPasajerosComponent } from './pasajeros/politicas-privacidad-pasajeros/politicas-privacidad-pasajeros.component';
import { TerminosCondicionesComponent } from './conductores/terminos-condiciones/terminos-condiciones.component';
import { TerminosCondicionesPasajeroComponent } from './pasajeros/terminos-condiciones/terminos-condiciones.component';


const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'conductores/politicas-privacidad', component: PoliticasPrivacidadConductoresComponent},
  {path: 'conductores/terminos-condiciones', component: TerminosCondicionesComponent},
  {path: 'pasajeros/politicas-privacidad', component: PoliticasPrivacidadPasajerosComponent},
  {path: 'pasajeros/terminos-condiciones', component: TerminosCondicionesPasajeroComponent},


  {path: '**', component: NopagefoundComponent}
];

export const APP_ROUTES = RouterModule.forRoot(appRoutes, { useHash: true , scrollPositionRestoration: 'enabled'});
