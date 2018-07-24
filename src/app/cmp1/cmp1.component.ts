import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ResizeListenerService,
  ScrollListenerService
} from '@cod3/ngx-resize-listener';

@Component({
  selector: 'app-cmp1',
  templateUrl: './cmp1.component.html',
  styleUrls: ['./cmp1.component.css'],
  providers: [ResizeListenerService, ScrollListenerService]
})
export class Cmp1Component implements OnInit, OnDestroy {
  constructor(
    private resizeListener: ResizeListenerService,
    private scrollListener: ScrollListenerService
  ) {}

  ngOnInit() {
    this.resizeListener.resized().subscribe(() => {
      console.log('Cmp1Component resize');
    });

    this.scrollListener.scrolled().subscribe(() => {
      console.log('scrolled');
    });

    window.addEventListener('optimizedResize', () => {
      console.log('aqui ainda');
    });
  }

  ngOnDestroy() {
    console.log('destroying Cmp1Component');
  }
}
