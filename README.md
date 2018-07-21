# ngx-resize-listener

Cpu conscious window resize events for Angular, using RxJs.
It listens for native resize events but throttle it using requestAnimationFrame. Thus, instead of emitting a thousen resize events per second, it emits only 1 event per animation frame. In other words, the maximum events per second is equal to the current monitor refresh rate.
The core implementation was based on [this](https://developer.mozilla.org/en-US/docs/Web/Events/resize#requestAnimationFrame_customEvent).

## Getting Started

Install it with NPM: `npm i @cod3/ngx-resize-listener`

Use it in your code:

```javascript
...
import { ResizeListenerService } from '@cod3/ngx-resize-listener';

@Component({
  selector: 'app-cmp1',
  templateUrl: './cmp1.component.html',
  styleUrls: ['./cmp1.component.css'],
  providers: [ResizeListenerService] // <-- register it.
})
export class Cmp1Component implements OnInit {
  constructor(private resizeListener: ResizeListenerService) {}

  ngOnInit() {
    this.resizeListener.resized().subscribe(() => {
      console.log('Cmp1Component resize');
    });
  }
}
```

## Public API

ResizeListenerService:

- `resized()`: Emits when a window resize event occurs;
- `stopListening()`: Stops listening routines. Because this service correctly implements onDestroy method, it is not necessary to call this method in client components onDestroy method.

## License

ngx-resize-listener is available under the MIT License.
