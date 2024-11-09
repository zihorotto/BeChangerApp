import { Injectable } from '@angular/core';
import { ApiConfiguration } from '../api-configuration';
import { HttpClient} from '@angular/common/http';
import { AuthenticationResponse } from '../models/authentication-response';
import { Observable } from 'rxjs';
import { AuthenticationRequest } from '../models/authentication-request';
import { RegistrationRequest } from '../models/registration-request';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    protected config: ApiConfiguration,
    protected http: HttpClient
  ) {
    this.rootUrl = config.rootUrl;
  }

  rootUrl:string;

  register(params: RegistrationRequest): Observable<{}> {
    return this.http.post<{}>(`${this.rootUrl}/auth/register`, params);
  }

  authenticate(params: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.rootUrl}/auth/authenticate`, params);
  }

  confirm(params: string): Observable<void> {
    return this.http.get<void>(`${this.rootUrl}/auth/activate-account`, { params: { token: params } });
  }

}

