import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BaseSiteService, WindowRef } from '@spartacus/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CdsConfig } from '../../config/index';
import {
  ConsentReferenceEvent,
  DebugEvent,
  ProfileTagEventNames,
  ProfileTagWindowObject,
} from '../model/index';
import { ProfileTagEventTracker } from './profiletag-events';

const mockCDSConfig: CdsConfig = {
  cds: {
    tenant: 'ArgoTest',
    baseUrl: 'example.com',
    endpoints: {
      strategyProducts: 'example',
    },
    profileTag: {
      javascriptUrl: 'https:tag.static.eu.context.cloud.sap',
      configUrl: 'https:tag.static.us.context.cloud.sap',
      allowInsecureCookies: false,
      gtmId: 'test-id-1234567',
    },
  },
};

describe('ProfileTagEventTracker', () => {
  let profileTagEventTracker: ProfileTagEventTracker;
  let nativeWindow: ProfileTagWindowObject;
  let getActiveBehavior;
  let baseSiteService;
  let appendChildSpy;
  const eventListener: Record<ProfileTagEventNames, Function> = <
    Record<ProfileTagEventNames, Function>
  >{};
  let mockedWindowRef;
  let getConsentBehavior;

  function setVariables() {
    getActiveBehavior = new BehaviorSubject<string>('');
    appendChildSpy = jasmine.createSpy('appendChildSpy');
    getConsentBehavior = new BehaviorSubject<Object>([{}]);
    mockedWindowRef = {
      nativeWindow: {
        addEventListener: (event, listener) => {
          eventListener[event] = listener;
        },
        removeEventListener: jasmine.createSpy('removeEventListener'),
        Y_TRACKING: {
          eventLayer: {
            push: jasmine.createSpy('push'),
          },
        },
      },
      document: {
        createElement: () => ({}),
        getElementsByTagName: () => [{ appendChild: appendChildSpy }],
      },
    };
    baseSiteService = {
      getActive: () => getActiveBehavior,
    };
  }
  beforeEach(() => {
    setVariables();
    TestBed.configureTestingModule({
      providers: [
        { provide: CdsConfig, useValue: mockCDSConfig },
        { provide: WindowRef, useValue: mockedWindowRef },
        { provide: BaseSiteService, useValue: baseSiteService },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    profileTagEventTracker = TestBed.get(ProfileTagEventTracker);
    nativeWindow = TestBed.get(WindowRef).nativeWindow;
  });

  it('should be created', () => {
    expect(profileTagEventTracker).toBeTruthy();
  });

  it('Should first wait for the basesite to be active before adding config parameters to the q array', () => {
    expect(appendChildSpy).not.toHaveBeenCalled();
    expect(nativeWindow.Y_TRACKING.eventLayer.push).not.toHaveBeenCalled();
    expect(nativeWindow.Y_TRACKING.q).not.toBeDefined();
  });

  it(`Should add config parameters to the q array after the base site is active`, () => {
    const profileTagLoaded$ = profileTagEventTracker.addTracker();
    const subscription = profileTagLoaded$.subscribe();
    const baseSite = 'electronics-test';
    getActiveBehavior.next(baseSite);
    subscription.unsubscribe();

    expect(nativeWindow.Y_TRACKING.q[0][0]).toEqual({
      ...mockCDSConfig.cds.profileTag,
      tenant: mockCDSConfig.cds.tenant,
      siteId: baseSite,
      spa: true,
    });
    expect(appendChildSpy).toHaveBeenCalled();
    expect(nativeWindow.Y_TRACKING.eventLayer.push).not.toHaveBeenCalled();
  });

  it(`Should not call the push method if the event receiver callback hasn't been called`, () => {
    const profileTagLoaded$ = profileTagEventTracker.addTracker();
    const subscription = profileTagLoaded$.subscribe();
    getActiveBehavior.next('electronics-test');
    getConsentBehavior.next({ consent: 'test' });
    subscription.unsubscribe();

    expect(nativeWindow.Y_TRACKING.eventLayer.push).not.toHaveBeenCalled();
  });

  it(`Should call the pageLoaded method if the site is active,
        and event receiver callback has been called with loaded`, () => {
    let loaded = 0;
    const subscription = profileTagEventTracker
      .addTracker()
      .pipe(tap(_ => loaded++))
      .subscribe();
    getActiveBehavior.next('electronics-test');
    eventListener[ProfileTagEventNames.LOADED](
      new CustomEvent(ProfileTagEventNames.LOADED)
    );
    subscription.unsubscribe();

    expect(loaded).toEqual(1);
  });

  it(`Should call the debugChanged method when profileTagDebug value changes`, () => {
    let timesCalled = 0;
    const subscription = profileTagEventTracker
      .getProfileTagEvents()
      .pipe(tap(_ => timesCalled++))
      .subscribe();

    const debugEvent = <DebugEvent>(
      new CustomEvent(ProfileTagEventNames.DEBUG_FLAG_CHANGED, {
        detail: { debug: true },
      })
    );
    eventListener[ProfileTagEventNames.DEBUG_FLAG_CHANGED](debugEvent);
    subscription.unsubscribe();

    expect(timesCalled).toEqual(1);
  });

  it(`Should call the consentReferenceChanged method when consentReference value changes`, () => {
    let timesCalled = 0;
    const subscription = profileTagEventTracker
      .getProfileTagEvents()
      .pipe(tap(_ => timesCalled++))
      .subscribe();

    let consentReferenceChangedEvent = <ConsentReferenceEvent>(
      new CustomEvent(ProfileTagEventNames.CONSENT_REFERENCE_LOADED, {
        detail: { consentReference: 'some_id' },
      })
    );
    eventListener[ProfileTagEventNames.CONSENT_REFERENCE_LOADED](
      consentReferenceChangedEvent
    );

    consentReferenceChangedEvent = <ConsentReferenceEvent>(
      new CustomEvent(ProfileTagEventNames.CONSENT_REFERENCE_LOADED, {
        detail: { consentReference: 'another_id' },
      })
    );
    eventListener[ProfileTagEventNames.CONSENT_REFERENCE_LOADED](
      consentReferenceChangedEvent
    );
    subscription.unsubscribe();

    expect(timesCalled).toEqual(2);
  });
});