import { Component, Input, OnInit } from '@angular/core';
import { User } from '../app.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() public user!: User;

  constructor() { }

  ngOnInit(): void {
  }

}
