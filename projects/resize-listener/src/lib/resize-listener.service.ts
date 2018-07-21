import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

/**
 * Emits cpu conscious window resize events.
 * It listens for native resize events but throttle it
 * using requestAnimationFrame. Thus, instead of emitting
 * a thousen resize events per second, it emits only 1
 * event per animation frame.
 * In other words, the maximum events per second is equal
 * to the current monitor refresh rate.
 */
@Injectable()
export class ResizeListenerService implements OnDestroy {
  private static readonly OPTIMIZED_RESIZE_NAME = 'optimizedResize';
  private resizeObservable: Observable<any>;
  private nativeResizeCallback;
  private optimizedResizeCallback;

  constructor() {
    this.initOptimizedResizeEvent();
    this.resizeObservable = Observable.create((observer: Observer<any>) => {
      this.optimizedResizeCallback = () => {
        observer.next(0);
      };
      window.addEventListener(
        ResizeListenerService.OPTIMIZED_RESIZE_NAME,
        this.optimizedResizeCallback
      );
    });

    this.resizeObservable.pipe(shareReplay(1));
  }

  public ngOnDestroy() {
    this.stopListening();
  }

  /**
   * Emits when a window resize event occurs.
   */
  public resized(): Observable<any> {
    return this.resizeObservable;
  }

  /**
   * Stops listening routines. Because this service
   * correctly implements the onDestroy method, it is not
   * necessary to call this method in client components
   * onDestroy method.
   */
  public stopListening() {
    if (this.nativeResizeCallback) {
      window.removeEventListener('resize', this.nativeResizeCallback);
    }

    if (this.optimizedResizeCallback) {
      window.removeEventListener(
        ResizeListenerService.OPTIMIZED_RESIZE_NAME,
        this.optimizedResizeCallback
      );
    }
  }

  private initOptimizedResizeEvent() {
    const throttle = type => {
      let running = false;
      this.nativeResizeCallback = function() {
        if (running) {
          return;
        }
        running = true;
        requestAnimationFrame(function() {
          window.dispatchEvent(
            new CustomEvent(ResizeListenerService.OPTIMIZED_RESIZE_NAME)
          );
          running = false;
        });
      };
      window.addEventListener(type, this.nativeResizeCallback);
    };

    throttle('resize');
  }
}
