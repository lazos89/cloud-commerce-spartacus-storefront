import { NgModule } from '@angular/core';
import { OrderHistoryModule } from './order-history/order-history.module';
import { OrderReturnRequestListModule } from './order-return-request-list/order-return-requests.module';
import { OrderDetailsModule } from './order-details/order-details.module';
import { OrderCancelOrReturnModule } from './cancellations-returns/cancel-or-return.module';

@NgModule({
  imports: [
    OrderHistoryModule,
    OrderDetailsModule,
    OrderCancelOrReturnModule,
    OrderReturnRequestListModule,
  ],
})
export class OrderModule {}
