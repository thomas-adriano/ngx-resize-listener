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

@Injectable()
export class ScrollListenerService implements OnDestroy {
  private static readonly OPTIMIZED_SCROLL_NAME = "optimizedScroll";
  private scrollObservable: Observable<any>;
  private nativeScrollCallback;
  private optimizedScrollCallback;

  constructor() {
    this.initOptimizedSCrollEvent();
    this.scrollObservable = Observable.create((observer: Observer<any>) => {
      this.optimizedScrollCallback = () => {
        observer.next(0);
      };
      window.addEventListener(
        ScrollListenerService.OPTIMIZED_SCROLL_NAME,
        this.optimizedScrollCallback,
        true
      );
    });

    this.scrollObservable.pipe(shareReplay(1));
  }

  public ngOnDestroy() {
    this.stopListening();
  }

  /**
   * Emits when a window scroll event occurs.
   */
  public scrolled(): Observable<any> {
    return this.scrollObservable;
  }

  /**
   * Stops listening routines. Because this service
   * correctly implements the onDestroy method, it is not
   * necessary to call this method in client components
   * onDestroy method.
   */
  public stopListening() {
    if (this.nativeScrollCallback) {
      window.removeEventListener("scroll", this.nativeScrollCallback, true);
    }

    if (this.optimizedScrollCallback) {
      window.removeEventListener(
        ScrollListenerService.OPTIMIZED_SCROLL_NAME,
        this.optimizedScrollCallback,
        true
      );
    }
  }

  private initOptimizedSCrollEvent() {
    const throttle = type => {
      let running = false;
      this.nativeScrollCallback = function() {
        if (running) {
          return;
        }
        running = true;
        requestAnimationFrame(function() {
          window.dispatchEvent(
            new CustomEvent(ScrollListenerService.OPTIMIZED_SCROLL_NAME)
          );
          running = false;
        });
      };
      window.addEventListener(type, this.nativeScrollCallback, true);
    };

    throttle("scroll");
  }
}
