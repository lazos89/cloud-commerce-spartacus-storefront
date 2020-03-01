import { InjectionToken, Provider } from '@angular/core';
import { ActionReducerMap, combineReducers } from '@ngrx/store';
import {
  Budget,
  B2BUnitNode,
  ListModel,
  Permission,
  CostCenter,
} from '../../../model';
import { entityLoaderReducer } from '../../../state/utils/entity-loader/entity-loader.reducer';
import {
  OrganizationState,
  BUDGET_ENTITIES,
  BUDGET_FEATURE,
  BUDGET_LIST,
  ORG_UNIT_ENTITIES,
  ORG_UNIT_FEATURE,
  ORG_UNIT_LIST,
  PERMISSION_ENTITIES,
  PERMISSION_FEATURE,
  PERMISSION_LIST,
  COST_CENTER_FEATURE,
  COST_CENTER_ENTITIES,
  COST_CENTER_LIST,
  COST_CENTER_ASSIGNED_BUDGETS,
  PERMISSION_TYPE_ENTITIES,
  PERMISSION_TYPE_FEATURE,
  PERMISSION_TYPE_LIST,
} from '../organization-state';
import { budgetsListReducer } from './budget.reducer';
import { orgUnitListReducer } from './org-unit.reducer';
import { permissionsListReducer } from './permission.reducer';
import { costCentersListReducer } from './cost-center.reducer';
import { permissionTypeListReducer } from './permission-type.reducer';

export function getReducers(): ActionReducerMap<OrganizationState> {
  return {
    [BUDGET_FEATURE]: combineReducers({
      entities: entityLoaderReducer<Budget>(BUDGET_ENTITIES),
      list: entityLoaderReducer<ListModel>(BUDGET_LIST, budgetsListReducer),
    }),
    [PERMISSION_FEATURE]: combineReducers({
      entities: entityLoaderReducer<Permission>(PERMISSION_ENTITIES),
      list: entityLoaderReducer<ListModel>(
        PERMISSION_LIST,
        permissionsListReducer
      ),
    }),
    [ORG_UNIT_FEATURE]: combineReducers({
      entities: entityLoaderReducer<B2BUnitNode>(ORG_UNIT_ENTITIES),
      list: entityLoaderReducer<ListModel>(ORG_UNIT_LIST, orgUnitListReducer),
    }),
    [PERMISSION_TYPE_FEATURE]: combineReducers({
      entities: entityLoaderReducer<B2BUnitNode>(PERMISSION_TYPE_ENTITIES),
      list: entityLoaderReducer<ListModel>(PERMISSION_TYPE_LIST, permissionTypeListReducer),
    }),
    [COST_CENTER_FEATURE]: combineReducers({
      entities: entityLoaderReducer<CostCenter>(COST_CENTER_ENTITIES),
      list: entityLoaderReducer<ListModel>(
        COST_CENTER_LIST,
        costCentersListReducer
      ),
      budgets: entityLoaderReducer<ListModel>(
        COST_CENTER_ASSIGNED_BUDGETS,
        costCentersListReducer
      ),
    }),
  };
}

export const reducerToken: InjectionToken<
  ActionReducerMap<OrganizationState>
> = new InjectionToken<ActionReducerMap<OrganizationState>>(
  'OrganizationReducers'
);

export const reducerProvider: Provider = {
  provide: reducerToken,
  useFactory: getReducers,
};
