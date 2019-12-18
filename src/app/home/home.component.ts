import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {El} from '../El';
import { HttpClient, HttpResponse ,HttpHeaders} from '@angular/common/http';
import { AuthService } from '../auth.service';
import { RouterModule, Router, RouteConfigLoadStart } from '@angular/router';
import {MatTableDataSource} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { DataSource } from '@angular/cdk/table';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscribable, Subscriber, Unsubscribable } from 'rxjs';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}

/** Constants used to fill up our data base. */
const COLORS: string[] = [
  'maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple', 'fuchsia', 'lime', 'teal',
  'aqua', 'blue', 'navy', 'black', 'gray'
];
const NAMES: string[] = [
  'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
  'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  form: FormGroup;
  uColorFilterCtrl: Unsubscribable;
  


  displayedColumns: string[] = ['id', 'name', 'progress', 'color'];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  applyFilter(filterValue: string){
    console.log(this.dataSource.filter)
    if (this.dataSource.filter!=undefined){
      this.dataSource.filter = !!filterValue ? filterValue.trim().toLocaleLowerCase() : '';
    }
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  colors: string[] = [
    'maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple', 'fuchsia', 'lime', 'teal',
    'aqua', 'blue', 'navy', 'black', 'gray'
  ];
  el: El;
  constructor(private http: HttpClient, private authService: AuthService, private route: RouterModule, private router: Router) {
    // Create 100 users
    const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));
    
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users)
  }
  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.initForm();
    this.initSubscribeFilter();
    console.log(this.dataSource);
  }
  initForm() {
    this.form = new FormGroup({
      colorCtrl: new FormControl(null),
      colorFilterCtrl: new FormControl(null)
    })
  }
  initSubscribeFilter(): void {
    this.uColorFilterCtrl = this.form.get('colorFilterCtrl').valueChanges.subscribe(val => this.applyFilter(val))
  }
  ngOnDestroy() {
    if (this.uColorFilterCtrl) {
      this.uColorFilterCtrl.unsubscribe();
    }
  }
  logoutUser(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  test(){
    this.authService.getExpiration();
  }
  // getData(){
  //   this.http
  //     .get('https://api-taneresidence.requestumdemo.com/api/users/5/accountings?page=1&per-page=20&order-by=date%7Cdesc&expand=contact,paymentMethod,unit.property,account')
  //     .subscribe((data:El) => this.el=data);
  //     console.log(this.el);
  // }
  getData(){
    // var t='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1N';
    const h = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer'
      })
    }
    // var headers_object = new HttpHeaders().set("Authorization", "Bearer " + t);
    
    this.http
      .get('https://api-taneresidence.requestumdemo.com/api/users/5/accountings?page=1&per-page=20&order-by=date%7Cdesc&expand=contact,paymentMethod,unit.property,account')
      .subscribe((data:El) => this.el=data);
      console.log(this.el);
  }
}

// access_token: "NzExYjE1NDZiNWY1ODEwNTUxODM5YTRmOGExNDFkMmFmOWRkZWVjMGVkOThkNzI3NTNkMzYxODIzNjcxMzMwOQ"
// expires_in: 1209600
// token_type: "bearer"
// scope: null
// refresh_token: "ZDAxZDAzMDg2Nzg3ZmY5MDBhOTBhMGY3ODYxZmRmOTU0YmI1NTFiNTU0M2EwNzBjMGUxODhkMzUxZmI2OTIzZQ"
function createNewUser(id: number): UserData {
  const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
      NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
  };
}