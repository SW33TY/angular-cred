import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient} from '@angular/common/http';
import {User} from '../user';
import { RouterModule, Router} from '@angular/router';
// import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: User=new User();
  receivedUser: User;
  done: boolean = false;
  keepLogedIn: boolean;

  constructor(private http: HttpClient,private authSevice: AuthService, private route: RouterModule, private router: Router){}

  ngOnInit(){
    // this.http.get('https:/api.github.com/search/users').subscribe(results =>{
    //   console.log(results);
    // })
  }

  submit(user: User){
    this.authSevice.postData(user)
    .subscribe(
      (data: User) => {this.receivedUser=data; this.done=true;
        this.keepLogedIn ? this.authSevice.setSession(this.receivedUser) : this.authSevice.setSessionStorage(this.receivedUser);
        this.router.navigate(['/home']);
        },
        error => console.log(error)
    )
  }
  // submit(user: User){
  //   this.authSevice.postData1(user);
  // }
}
