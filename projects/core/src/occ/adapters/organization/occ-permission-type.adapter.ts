import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { OccEndpointsService } from '../../services/occ-endpoints.service';
import { ConverterService } from '../../../util/converter.service';
import {
  PERMISSION_TYPE_NORMALIZER,
  PERMISSION_TYPE_LIST_NORMALIZER,
} from '../../../organization/connectors/permissionType/converters';
import { PermissionTypeAdapter } from '../../../organization/connectors/permissionType/permissionType.adapter';
import { Occ } from '../../occ-models/occ.models';
import { OrderApprovalPermissionType } from '../../../model/permission.model';
import { EntitiesModel } from '../../../model/misc.model';

@Injectable()
export class OccPermissionTypeAdapter implements PermissionTypeAdapter {
  constructor(
    protected http: HttpClient,
    protected occEndpoints: OccEndpointsService,
    protected converter: ConverterService
  ) {}

  load(): Observable<OrderApprovalPermissionType> {
    return this.http
      .get<Occ.OrderApprovalPermissionType>(this.getPermissionTypesEndpoint())
      .pipe(this.converter.pipeable(PERMISSION_TYPE_NORMALIZER));
  }

  loadList(): Observable<EntitiesModel<OrderApprovalPermissionType>> {
    return this.http
      .get<Occ.OrderApprovalPermissionType>(
        this.getPermissionTypesListEndpoint()
      )
      .pipe(this.converter.pipeable(PERMISSION_TYPE_LIST_NORMALIZER));
  }

  protected getPermissionTypesEndpoint(): string {
    return this.occEndpoints.getUrl('orderApprovalPermissionTypes');
  }

  protected getPermissionTypesListEndpoint(): string {
    return this.occEndpoints.getUrl('orderApprovalPermissionTypes');
  }
}
