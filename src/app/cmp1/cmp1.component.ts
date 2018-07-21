import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResizeListenerService } from 'projects/resize-listener/src/public_api';

@Component({
  selector: 'app-cmp1',
  templateUrl: './cmp1.component.html',
  styleUrls: ['./cmp1.component.css'],
  providers: [ResizeListenerService]
})
export class Cmp1Component implements OnInit, OnDestroy {
  constructor(private resizeListener: ResizeListenerService) {}

  ngOnInit() {
    this.resizeListener.resized().subscribe(() => {
      console.log('Cmp1Component resize');
    });

    window.addEventListener('optimizedResize', () => {
      console.log('aqui ainda');
    });
  }

  ngOnDestroy() {
    console.log('destroying Cmp1Component');
  }
}
