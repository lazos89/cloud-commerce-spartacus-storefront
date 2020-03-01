import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PermissionTypeAdapter } from './permissionType.adapter';
import { OrderApprovalPermissionType } from '../../../model/permission.model';
import { EntitiesModel } from '../../../model/misc.model';

@Injectable({
  providedIn: 'root',
})
export class PermissionTypeConnector {
  constructor(protected adapter: PermissionTypeAdapter) {}

  get(): Observable<OrderApprovalPermissionType> {
    return this.adapter.load();
  }

  getList(
    userId: string,
    params?: any
  ): Observable<EntitiesModel<OrderApprovalPermissionType>> {
    return this.adapter.loadList(userId, params);
  }
}
