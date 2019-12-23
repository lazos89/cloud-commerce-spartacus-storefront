import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  Event as NgRouterEvent,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { Action, ActionsSubject } from '@ngrx/store';
import {
  AuthActions,
  Cart,
  CartService,
  ConsentService,
  OrderEntry,
} from '@spartacus/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CdsConfig } from '../../config';
import { SpartacusEventTracker } from './spartacus-events';

describe('SpartacusEventTracker', () => {
  let spartacusEventTracker: SpartacusEventTracker;
  let getConsentBehavior;
  let isConsentGivenValue;
  let routerEventsBehavior;
  let router;
  let consentsService;
  let cartService;
  let orderEntryBehavior;
  let cartBehavior;
  let mockActionsSubject: ReplaySubject<Action>;
  const mockCDSConfig: CdsConfig = {
    cds: {
      consentTemplateId: 'PROFILE',
    },
  };
  function setVariables() {
    getConsentBehavior = new BehaviorSubject<Object>([{}]);
    isConsentGivenValue = false;
    routerEventsBehavior = new BehaviorSubject<NgRouterEvent>(
      new NavigationStart(0, 'test.com', 'popstate')
    );
    orderEntryBehavior = new ReplaySubject<OrderEntry[]>();
    cartBehavior = new ReplaySubject<Cart>();
    mockActionsSubject = new ReplaySubject<Action>();
    consentsService = {
      getConsent: () => getConsentBehavior,
      isConsentGiven: () => isConsentGivenValue,
    };
    router = {
      events: routerEventsBehavior,
    };
    cartService = {
      getEntries: () => orderEntryBehavior,
      getActive: () => cartBehavior,
    };
  }
  beforeEach(() => {
    setVariables();
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        {
          provide: ConsentService,
          useValue: consentsService,
        },
        {
          provide: CartService,
          useValue: cartService,
        },
        {
          provide: CdsConfig,
          useValue: mockCDSConfig,
        },
        {
          provide: ActionsSubject,
          useValue: mockActionsSubject,
        },
      ],
    });
    spartacusEventTracker = TestBed.get(SpartacusEventTracker as Type<
      SpartacusEventTracker
    >);
  });

  it('Should be created', () => {
    expect(spartacusEventTracker).toBeTruthy();
  });

  it(`Should call the push method if the profile consent changes to true,
  and ignore all further changes, only sending one consent changed event,`, () => {
    let timesCalled = 0;
    const subscription = spartacusEventTracker
      .consentGranted()
      .pipe(tap(_ => timesCalled++))
      .subscribe();
    isConsentGivenValue = false;
    getConsentBehavior.next({ consent: 'test' });
    getConsentBehavior.next({ consent: 'test' });
    getConsentBehavior.next({ consent: 'test' });
    isConsentGivenValue = true;
    getConsentBehavior.next({ consent: 'test' });
    getConsentBehavior.next({ consent: 'test' });
    getConsentBehavior.next({ consent: 'test' });
    isConsentGivenValue = true;
    getConsentBehavior.next({ consent: 'test' });
    subscription.unsubscribe();
    expect(timesCalled).toEqual(1);
  });

  it(`Should call the push method for every NavigationEnd event,
    regardless of consent status, and even if the consent pipe ends due to take(1)`, () => {
    let timesCalled = 0;
    const subscription = spartacusEventTracker
      .navigated()
      .pipe(tap(_ => timesCalled++))
      .subscribe();
    getConsentBehavior.next({ consent: 'test' });
    routerEventsBehavior.next(new NavigationEnd(0, 'test', 'test'));
    routerEventsBehavior.next(new NavigationEnd(0, 'test', 'test'));
    routerEventsBehavior.next(new NavigationStart(0, 'test', 'hashchange'));
    routerEventsBehavior.next(new NavigationStart(0, 'test', 'hashchange'));
    routerEventsBehavior.next(new NavigationStart(0, 'test', 'hashchange'));
    routerEventsBehavior.next(new NavigationEnd(0, 'test', 'test2'));
    routerEventsBehavior.next(new NavigationEnd(0, 'test', 'test3'));
    routerEventsBehavior.next(new NavigationEnd(0, 'test', 'test1'));
    subscription.unsubscribe();
    expect(timesCalled).toEqual(5);
  });

  it(`Should call the push method for every CartSnapshot event`, () => {
    let timesCalled = 0;
    const subscription = spartacusEventTracker
      .cartChanged()
      .pipe(tap(_ => timesCalled++))
      .subscribe();
    const mockCartEntry: OrderEntry[] = [{ entryNumber: 7 }];
    const mockCartEntry2: OrderEntry[] = [{ entryNumber: 1 }];
    const testCart = { testCart: { id: 123 } };
    cartBehavior.next(testCart);
    orderEntryBehavior.next(mockCartEntry);
    orderEntryBehavior.next(mockCartEntry2);
    subscription.unsubscribe();
    expect(timesCalled).toEqual(2);
  });

  it(`Should not call the push method when the cart is not modified`, () => {
    let timesCalled = 0;
    const subscription = spartacusEventTracker
      .cartChanged()
      .pipe(tap(_ => timesCalled++))
      .subscribe();
    subscription.unsubscribe();
    expect(timesCalled).toEqual(0);
  });

  it(`Should not call the push method when the entries have only ever sent an empty array`, () => {
    let timesCalled = 0;
    const subscription = spartacusEventTracker
      .cartChanged()
      .pipe(tap(_ => timesCalled++))
      .subscribe();
    subscription.unsubscribe();
    cartBehavior.next({ testCart: { id: 123 } });
    orderEntryBehavior.next([]);
    orderEntryBehavior.next([]);
    orderEntryBehavior.next([]);
    subscription.unsubscribe();
    expect(timesCalled).toEqual(0);
  });

  it(`Should call the push method every time after a non-empty orderentry array is passed`, () => {
    let timesCalled = 0;
    const subscription = spartacusEventTracker
      .cartChanged()
      .pipe(tap(_ => timesCalled++))
      .subscribe();
    cartBehavior.next({ testCart: { id: 123 } });
    orderEntryBehavior.next([]);
    orderEntryBehavior.next([]);
    orderEntryBehavior.next([]);
    orderEntryBehavior.next([{ test: {} }]);
    orderEntryBehavior.next([{ test: {} }]);
    orderEntryBehavior.next([]);
    orderEntryBehavior.next([]);
    subscription.unsubscribe();
    expect(timesCalled).toEqual(4);
  });

  it(`Should call the push method first time a login is successful`, () => {
    let timesCalled = 0;
    const subscription = spartacusEventTracker
      .loginSuccessful()
      .pipe(tap(_ => timesCalled++))
      .subscribe();
    mockActionsSubject.next({ type: AuthActions.LOGIN });
    mockActionsSubject.next({ type: AuthActions.LOGIN });
    mockActionsSubject.next({ type: AuthActions.LOGOUT });
    mockActionsSubject.next({ type: AuthActions.LOGOUT });
    mockActionsSubject.next({ type: AuthActions.LOGOUT });
    mockActionsSubject.next({ type: AuthActions.LOGIN });
    mockActionsSubject.next({ type: AuthActions.LOGIN });
    mockActionsSubject.next({ type: AuthActions.LOGIN });
    mockActionsSubject.next({ type: AuthActions.LOGIN });
    mockActionsSubject.next({ type: AuthActions.LOGIN });
    mockActionsSubject.next({ type: AuthActions.LOGOUT });
    mockActionsSubject.next({ type: AuthActions.LOGOUT });
    mockActionsSubject.next({ type: AuthActions.LOGOUT });
    subscription.unsubscribe();
    expect(timesCalled).toEqual(2);
  });
});