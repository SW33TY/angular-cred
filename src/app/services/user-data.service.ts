import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import Dexie from 'dexie';
import { UserData } from '../interfaces/userData';
import { Observable } from 'rxjs';
import { from } from 'rxjs';

const NAMES: string[] = [
  'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
  'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
];

@Injectable({
  providedIn: 'root'
})

export class UserDataService {
  
private db: any;
userDatas: UserData[]=[];
colors: string[] = [
  'maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple', 'fuchsia', 'lime', 'teal',
  'aqua', 'blue', 'navy', 'black', 'gray'
];
  constructor() {
    this.createDatabase();
   }
   private async sendItemsFromIndexedDb() {
    const allItems: UserData[] = await this.db.userDatas.toArray();
    allItems.forEach((item: UserData) => {
      this.db.userDatas.delete(item.id).then(() => {
        console.log(`item ${item.id} sent and deleted locally`);
      });
    });
  }
   addData(data: UserData) {
    const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';
    
    data.id = UUID.UUID();
    data.name = name;
    data.color = this.colors[Math.round(Math.random() * (this.colors.length - 1))];
    data.progress = Math.round(Math.random() * 100).toString();
    this.userDatas.push(data);
    this.addToIndexedDb(data);
  }
  
  
  generateRandomUser(amount: number) {
    for(let i = 0; i<amount; i++){
      const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
      NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

      let randUser = {
        id: UUID.UUID(),
        name: name,
        color : this.colors[Math.round(Math.random() * (this.colors.length - 1))],
        progress : Math.round(Math.random() * 100).toString()
      };
      this.userDatas.push(randUser);
      this.addToIndexedDb(randUser);
    }
  }
  clearDB(){
    this.db.userDatas.clear()
    .then(async () => {
      const allItems: UserData[] = await this.db.userDatas.toArray();
      console.log('saved in DB, DB is now', allItems);
    })
    .catch(e => {
      alert('Error: ' + (e.stack || e));
    });
  }
  getAllDatasExtended() {
    return new Promise((resolve, reject) => {
      this.db.userDatas.get("*")
      .then(async ()=>{
          resolve(await this.db.userDatas.toArray());
        }
      )
      .catch(e => {
        reject(e);
        alert('Error: ' + (e.stack || e));
      });
    });
  }
  getAllDatas() {
    return this.db.userDatas.toArray()
  }

  getElementData(): Observable<any[]> {
    return this.getAllDatas();
  }


  private addToIndexedDb(data: UserData) {
    this.db.userDatas
      .add(data)
      .then(async () => {
        this.userDatas.push(data);
        const allItems: UserData[] = await this.db.userDatas.toArray();
        // console.log('saved in DB, DB is now', allItems);
      })
      .catch(e => {
        alert('Error: ' + (e.stack || e));
      });
  }
   private createDatabase(){
     this.db = new Dexie('myDataTest');
     this.db.version(1).stores({
       userDatas:'++id,name,progress,color'
     })
   }
   
}