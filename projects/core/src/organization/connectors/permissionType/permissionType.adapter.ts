import { Observable } from 'rxjs';
import { EntitiesModel } from '../../../model/misc.model';
import { OrderApprovalPermissionType } from '../../../model/permission.model';

export abstract class PermissionTypeAdapter {
  abstract load(): Observable<OrderApprovalPermissionType>;

  abstract loadList(
    userId: string,
    params?: any
  ): Observable<EntitiesModel<OrderApprovalPermissionType>>;
}
