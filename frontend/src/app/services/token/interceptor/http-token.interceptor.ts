import { TokenService } from './../token.service';
import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  constructor() {}
  private TokenService = inject(TokenService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token: string = this.TokenService.token;
    
    if(token) {
      const authReq: HttpRequest<unknown> = request.clone({
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        }),
      });
      return next.handle(authReq);
    } 
    return next.handle(request);
  }
}
