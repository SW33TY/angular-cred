import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../user';
import { RouterModule, Router } from '@angular/router';

// import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: User = new User();
  receivedUser: User;
  done: boolean = false;
  keepLoggedIn: boolean = false;

  constructor(private http: HttpClient, private authService: AuthService, private route: RouterModule, private router: Router) {
  }

  ngOnInit() {
    // this.http.get('https:/api.github.com/search/users').subscribe(results =>{
    //   console.log(results);
    // })
  }


  submit(user: User) {
    this.authService.postData(user)
      .subscribe(
        (data: User) => {
          this.receivedUser = data;
          this.done = true;
          this.keepLoggedIn ? this.authService.setSession(this.receivedUser) : this.authService.setSessionStorage(this.receivedUser);
          this.router.navigate(['/home']);
        },
        error => console.log(error)
      );
  }

  submitNew() {
    this.keepLoggedIn ? localStorage.setItem('testToken', 'true') : sessionStorage.setItem('testToken', 'true');
    // localStorage.setItem('testToken', 'true');
    // this.router.navigate(['home']);
    this.authService.loginUser();
    // this.router.navigate(['home']);
    this.router.navigate(['home']);
  }

  // submit(user: User){
  //   this.authService.postData1(user);
  // }
}
