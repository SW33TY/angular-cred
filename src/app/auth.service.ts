import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { User } from '../app/user';
import * as moment from 'moment';
// import { Observable } from "rxjs";
// import { tap } from "rxjs/operators";
// import 'rxjs/add/operator/switchMap';
import { RouterModule, Router } from '@angular/router';
import { AuthGuard } from './services/auth-guard.service';
import { BehaviorSubject, Observable, of } from 'rxjs';

enum storages {
  token = 'testToken'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private route: RouterModule, private router: Router) {
  }
  baseUrl = 'https://api-taneresidence.requestumdemo.com/oauth2/token';

  loggedIn = false;
  credentials: string;
  basic: string;
  Authorization: string;
  get isToken() {
    return this.isStorages(storages.token);
  }

  postData(user: User) {
    user.grant_type = 'password';
    user.client_id = '20aa5tpwg04ks4w84o8cookswwccgkwko40gwcs0ws840wkssk';
    user.client_secret = '79fqd7qzbp8g8o8oggss48w4kwck4s4kccwwk8804ksowg8o';
    const h = {
      headers: new HttpHeaders({
        Authorization: 'Bearer'
      })
    };
    const body = {
      grant_type: user.grant_type,
      client_id: user.client_id,
      client_secret: user.client_secret,
      username: user.username,
      password: user.password
    };
    return this.http.post(this.baseUrl, body);
  }

  //   login(user: User ) {
  //   user.grant_type = "password";
  //   user.client_id= "20aa5tpwg04ks4w84o8cookswwccgkwko40gwcs0ws840wkssk";
  //   user.client_secret = "79fqd7qzbp8g8o8oggss48w4kwck4s4kccwwk8804ksowg8o";
  //   const opt = {
  //     headers: new HttpHeaders({
  //       'Authorization': 'Bearer'
  //     })
  //   }
  //  return this.http.post<User>(this.baseUrl, {grant_type: user.grant_type, client_id: user.client_id,
  //  client_secret: user.client_secret, username: user.username, password: user.password}, opt)
  //       .do(res => this.setSession)
  //       .shareReplay();
  // }

  public getToken(): string {
    const token = (localStorage.getItem('authData') != null) ? localStorage.getItem('authData') : sessionStorage.getItem('authData');
    const tokenPased = JSON.parse(token);
    const userToken = tokenPased.access_token;
    // return localStorage.getItem('token');
    return userToken;
  }

  // public isAuthenticated(): boolean {
  //   const token = this.getToken();
  //   return tokenNotExpired(null, token);
  // }

  setSession(data) {
    const authData = {
      access_token: '',
      expires_in: '',
      token_type: '',
      refresh_token: ''
    };
    authData.access_token = data.access_token;

    // const expiresAt = moment().add(data.expires_in,'second');
    // authData.expires_in = JSON.stringify(expiresAt.valueOf());

    authData.expires_in = data.expires_in;

    authData.token_type = data.token_type;
    authData.refresh_token = data.refresh_token;
    localStorage.setItem('authData', JSON.stringify(authData));
    sessionStorage.setItem('authData', JSON.stringify(authData));
  }

  setSessionStorage(data) {
    const authData = {
      access_token: '',
      expires_in: '',
      token_type: '',
      refresh_token: ''
    };
    authData.access_token = data.access_token;
    // const expiresAt = moment().add(data.expires_in,'second');
    // authData.expires_in = JSON.stringify(expiresAt.valueOf());
    authData.expires_in = data.expires_in;
    authData.token_type = data.token_type;
    authData.refresh_token = data.refresh_token;
    sessionStorage.setItem('authData', JSON.stringify(authData));
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.loggedIn = false;
    this.router.navigate(['login']);
  }



  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  // isLoggedOut() {
  //     return !this.isLoggedIn();
  // }

  getExpiration() {
    const expiration = (localStorage.getItem('authData') !== null) ? localStorage.getItem('authData') : sessionStorage.getItem('authData');
    const expirationParsed = JSON.parse(expiration);
    const expiresAt = expirationParsed.expires_in;
    return moment(expiresAt);
  }

  checkToken() {
    if ((localStorage.getItem('authData') != null) ||
      (sessionStorage.getItem('authData') != null) ||
      (localStorage.getItem('authData') != null && sessionStorage.getItem('authData') != null)) {
      return true;
    } else {
      return false;
    }
  }

  getUserLoggedIn() {
    return this.loggedIn;
  }
  loginUser() {
    this.loggedIn = true;
  }

  isStorages(key: string) {
    return [localStorage, sessionStorage].find((storage) => {
      return storage.getItem(key);
    });
  }

}


