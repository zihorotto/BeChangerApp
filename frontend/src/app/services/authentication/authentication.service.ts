import { Injectable } from '@angular/core';
import { ApiConfiguration } from '../api-configuration';
import { HttpClient } from '@angular/common/http';
import { AuthenticationResponse } from '../../types/authentication-response';
import { Observable } from 'rxjs';
import { AuthenticationRequest } from '../../types/authentication-request';
import { RegistrationRequest } from '../../types/registration-request';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(protected config: ApiConfiguration, protected http: HttpClient) {
    this.rootUrl = config.rootUrl;
  }

  rootUrl: string;

  register(params: RegistrationRequest): Observable<{}> {
    return this.http.post<{}>(`${this.rootUrl}/auth/register`, params);
  }

  authenticate(
    params: AuthenticationRequest
  ): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(
      `${this.rootUrl}/auth/authenticate`,
      params
    );
  }

  confirm(params: string): Observable<void> {
    return this.http.get<void>(`${this.rootUrl}/auth/activate-account`, {
      params: { token: params },
    });
  }
}
