import { OrderApprovalPermissionType } from '../../../model/permission.model';
import { LoaderAction } from '../../../state/utils/loader/loader.action';
import * as OrgUnitActions from '../actions/org-unit.action';

export const permissionTypeInitialState = undefined;

export function permissionTypeEntitiesReducer(
  state = permissionTypeInitialState,
  action: LoaderAction
): OrderApprovalPermissionType {
  switch (action.type) {
  }
  return state;
}

export function permissionTypeListReducer(
  state = permissionTypeInitialState,
  action: LoaderAction
): any {
  switch (action.type) {
    case OrgUnitActions.LOAD_ORG_UNITS_SUCCESS:
      return action.payload.page;
  }
  return state;
}
