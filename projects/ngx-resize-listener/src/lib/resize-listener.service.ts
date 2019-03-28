// MIT License

// Copyright (c) 2018 Thomas Oelke Adriano

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { Injectable, OnDestroy } from "@angular/core";
import { Observable, Observer } from "rxjs";
import { shareReplay } from "rxjs/operators";

/**
 * Emits cpu conscious window resize events.
 * It listens for native resize events but throttle it
 * using requestAnimationFrame. Thus, instead of emitting
 * a thousen resize events per second, it emits only 1
 * event per animation frame.
 * In other words, the maximum events per second is equal
 * to the current monitor refresh rate.
 * The core implementation was based on https://developer.mozilla.org/en-US/docs/Web/Events/resize#requestAnimationFrame_customEvent
 */
@Injectable()
export class ResizeListenerService implements OnDestroy {
  private static readonly OPTIMIZED_RESIZE_NAME = "optimizedResize";
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
        this.optimizedResizeCallback,
        true
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
      window.removeEventListener("resize", this.nativeResizeCallback, true);
    }

    if (this.optimizedResizeCallback) {
      window.removeEventListener(
        ResizeListenerService.OPTIMIZED_RESIZE_NAME,
        this.optimizedResizeCallback,
        true
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
      window.addEventListener(type, this.nativeResizeCallback, true);
    };

    throttle("resize");
  }
}
