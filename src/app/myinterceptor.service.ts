import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent , HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';
import {AuthService} from '../app/auth.service'
import { RouterModule, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MyinterceptorService implements HttpInterceptor {
  constructor (public auth: AuthService, private route: RouterModule, private router: Router){}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // let t = this.auth.getToken();
      // const request = req.clone({headers: new HttpHeaders().set("Authorization", "Bearer " + t)});

      // const request = req.clone({
      //   setHeaders: {
      //     Authorization: `Bearer ${this.auth.getToken()}`
      //   }
      // });

      const request = req.clone({ setHeaders: { Authorization: 'Bearer'} });
      if (this.auth.checkToken()){
        request.headers.set('',this.auth.getToken());
        return next.handle(request);
      }
    // return;;
    return next.handle(request).pipe( tap(() => {},
    (err: any) => {
    if (err instanceof HttpErrorResponse) {
      if (err.status !== 401) {
       return;
      }
      this.router.navigate(['/login']);
    }
  }));

  }
}
