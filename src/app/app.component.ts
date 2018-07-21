import { Component, OnInit, ViewChild } from '@angular/core';
import { Cmp1Component } from './cmp1/cmp1.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild(Cmp1Component) cmp1: Cmp1Component;
  public destroyCmp1 = false;
  title = 'app';

  constructor() {}

  ngOnInit() {
    setTimeout(() => (this.destroyCmp1 = true), 4000);
  }
}
