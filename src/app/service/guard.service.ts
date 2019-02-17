import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthService,
              private router: Router) { }

  canActivate() {
    if ( this.auth.isAuthenticated() ) {
      console.log( 'PASO EL GUARD');
      return true;
    } else {
      console.log( 'Bloqueado por guard' );
      this.router.navigate(['/login']);
      return false;
    }
  }
}
