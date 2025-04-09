import { Injectable } from '@angular/core';
import KeyCloak from 'keycloak-js'
import { UserProfile } from './user-profile';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  private _keycloak: KeyCloak | undefined;
  private _profile: UserProfile | undefined;

  get keycloak() {
    if (!this._keycloak) {
      this._keycloak = new KeyCloak({
        url: 'http://bechangerapp-ancient-frost-9304.fly.dev:9090',
        realm: 'be-changer-app',
        clientId: 'bc'
      });
    }
    return this._keycloak;
  }

  get profile(): UserProfile | undefined {
    return this._profile;
  }

  async init() {
    const authenticated = await this.keycloak?.init({
      onLoad: 'login-required'
    });

    if(authenticated) {
      this._profile = (await this.keycloak?.loadUserProfile()) as UserProfile;
      this._profile.token = this.keycloak?.token;
    }
  }

  login(){
    return this.keycloak?.login();
  }


  logout(){
    return this.keycloak?.logout({redirectUri: 'http://bechangerapp-ancient-frost-9304.fly.dev:4200'})
    // return this.keycloak?.accountManagement();
  }
}
