import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { OccEndpointsService } from '../../occ/services/occ-endpoints.service';
import { PersonalizationConfig } from '../config/personalization-config';
import { WindowRef } from '../../window/window-ref';
import { isPlatformServer } from '@angular/common';

const PERSONALIZATION_TIME_KEY = 'personalization-time';

@Injectable()
export class OccPersonalizationTimeInterceptor implements HttpInterceptor {
  private timestamp: string;
  private requestHeader: string;

  constructor(
    private config: PersonalizationConfig,
    private occEndpoints: OccEndpointsService,
    private winRef: WindowRef,
    @Inject(PLATFORM_ID) private platform: any
  ) {
    this.requestHeader = this.config.personalization.httpHeaderName.timestamp.toLowerCase();
    this.timestamp =
      this.winRef.localStorage &&
      this.winRef.localStorage.getItem(PERSONALIZATION_TIME_KEY);
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (isPlatformServer(this.platform)) {
      return next.handle(request);
    }

    if (
      this.timestamp &&
      request.url.includes(this.occEndpoints.getBaseEndpoint())
    ) {
      request = request.clone({
        setHeaders: {
          [this.requestHeader]: this.timestamp,
        },
      });
    }

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          if (event.headers.keys().includes(this.requestHeader)) {
            const receivedTimestamp = event.headers.get(this.requestHeader);
            if (this.timestamp !== receivedTimestamp) {
              this.timestamp = receivedTimestamp;
              this.winRef.localStorage.setItem(
                PERSONALIZATION_TIME_KEY,
                this.timestamp
              );
            }
          }
        }
      })
    );
  }
}
