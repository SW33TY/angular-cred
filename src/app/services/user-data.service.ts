import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import Dexie from 'dexie';
import { UserData } from '../interfaces/userData';

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
   addRandomData() {
    const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

    let test = {
      id: UUID.UUID(),
      name: name,
      color : this.colors[Math.round(Math.random() * (this.colors.length - 1))],
      progress : Math.round(Math.random() * 100).toString()
    };
    
    this.userDatas.push(test);
    this.addToIndexedDb(test);
  }

  getAllDatas() {
    return this.userDatas;
  }
  private addToIndexedDb(data: UserData) {
    this.db.userDatas
      .add(data)
      .then(async () => {
        const allItems: UserData[] = await this.db.userDatas.toArray();
        console.log('saved in DB, DB is now', allItems);
      })
      .catch(e => {
        alert('Error: ' + (e.stack || e));
      });
  }
   private createDatabase(){
     this.db = new Dexie('myDataTest');
     this.db.version(1).stores({
       userDatas:'id,name,progress,color'
     })
   }
   
}
