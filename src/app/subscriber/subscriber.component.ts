import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-subscriber',
  templateUrl: './subscriber.component.html',
  styleUrls: ['./subscriber.component.css']
})
export class SubscriberComponent implements OnInit {

  constructor(
    public appComponent : AppComponent,
  ) { 
    if(!this.appComponent.user){
      //   this.router.navigate(['/']);
      this.appComponent.user = {id:45,name:'leo.grignon@thalesgroup.com', profile:'administrator'};
      }
  }

  ngOnInit(): void {
  }

}
