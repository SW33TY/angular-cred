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
import { Subscribable, Subscriber, Unsubscribable, from } from 'rxjs';
import{UserData} from '../interfaces/userData';
// import { NgxIndexedDBService } from 'ngx-indexed-db';
import {UserDataService} from '../services/user-data.service'


/** Constants used to fill up our data base. */
// const COLORS: string[] = [
//   'maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple', 'fuchsia', 'lime', 'teal',
//   'aqua', 'blue', 'navy', 'black', 'gray'
// ];
// const NAMES: string[] = [
//   'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
//   'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
// ];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  form: FormGroup;
  uColorFilterCtrl: Unsubscribable;
  // db: any;
  userDatas: UserData[]=[];

  displayedColumns: string[] = ['id', 'name', 'progress', 'color'];
  // dataSource: MatTableDataSource<UserData>;
  dataSource1:MatTableDataSource<UserData>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  applyFilter(filterValue: string){    
    if (this.dataSource1.filter!=undefined){
      this.dataSource1.filter = !!filterValue ? filterValue.trim().toLocaleLowerCase() : '';
    }
    if (this.dataSource1.paginator) {
      this.dataSource1.paginator.firstPage();
    }
  }
  colors: string[] = this.udService.colors;
  el: El;
  
  constructor(private http: HttpClient, private authService: AuthService, private route: RouterModule,
     private router: Router, private udService: UserDataService) {
    // Create 100 users
    // const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));
    //create users by form

    // this.assignData();

    // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource(users);    
  }

  ngOnInit() {
    this.assignData();
    this.initForm();
    this.initSubscribeFilter();
  }
  
  initForm() {
    this.form = new FormGroup({
      colorCtrl: new FormControl(null),
      colorFilterCtrl: new FormControl(null)
    })
  }

  // private _getElementData(): void {
  //   this.udService.getElementData().subscribe(res => {
  //   this.dataSource1 = new MatTableDataSource(res);
  //   });
  // }

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

  async assignData(){
    let usersArr = await this.udService.getAllDatas()
    .then(data => {
      //fill users from form
      this.dataSource1 = new MatTableDataSource(data);
      this.dataSource1.sort = this.sort;
      this.dataSource1.paginator = this.paginator;
    })
    return usersArr;
  }

  async createUsers(amount: number){
    this.udService.generateRandomUser(amount);
    this.udService.getAllDatas();
  }

  deleteBD(){
    this.udService.clearDB();
  }

  test(){
    this.authService.getExpiration();
  }

  
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

// getData(){
  //   this.http
  //     .get('https://api-taneresidence.requestumdemo.com/api/users/5/accountings?page=1&per-page=20&order-by=date%7Cdesc&expand=contact,paymentMethod,unit.property,account')
  //     .subscribe((data:El) => this.el=data);
  //     console.log(this.el);
  // }


// access_token: "NzExYjE1NDZiNWY1ODEwNTUxODM5YTRmOGExNDFkMmFmOWRkZWVjMGVkOThkNzI3NTNkMzYxODIzNjcxMzMwOQ"
// expires_in: 1209600
// token_type: "bearer"
// scope: null
// refresh_token: "ZDAxZDAzMDg2Nzg3ZmY5MDBhOTBhMGY3ODYxZmRmOTU0YmI1NTFiNTU0M2EwNzBjMGUxODhkMzUxZmI2OTIzZQ"

// function createNewUser(id: number): UserData {
//   const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
//       NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

//   return {
//     id: id.toString(),
//     name: name,
//     progress: Math.round(Math.random() * 100).toString(),
//     color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
//   };
// }