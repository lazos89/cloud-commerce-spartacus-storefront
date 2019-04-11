import { PROCESS_FEATURE } from '../../../process/store/process-state';
import {
  entityFailMeta,
  entityLoadMeta,
  entitySuccessMeta,
} from '../../../state';
import { UserToken } from '../../models/token-types.model';
import { AUTH_USER_PROCESS_ID } from '../auth-state';
import * as fromUserToken from './../actions/user-token.action';

const token: UserToken = {
  access_token: 'xxx',
  token_type: 'bearer',
  refresh_token: 'xxx',
  expires_in: 1000,
  scope: ['xxx'],
  userId: 'xxx',
};

fdescribe('User Token Actions', () => {
  describe('LoadUserToken Actions', () => {
    it('should create the action', () => {
      const tokenRequest = {
        userId: 'xxx@xxx.xxx',
        password: '1234',
      };

      const action = new fromUserToken.LoadUserToken(tokenRequest);
      expect({ ...action }).toEqual({
        type: fromUserToken.LOAD_USER_TOKEN,
        payload: tokenRequest,
        meta: entityLoadMeta(PROCESS_FEATURE, AUTH_USER_PROCESS_ID),
      });
    });
  });

  describe('LoadUserTokenFail Action', () => {
    it('should create the action', () => {
      const error = 'anError';
      const action = new fromUserToken.LoadUserTokenFail(error);

      expect({ ...action }).toEqual({
        type: fromUserToken.LOAD_USER_TOKEN_FAIL,
        payload: error,
        meta: entityFailMeta(PROCESS_FEATURE, AUTH_USER_PROCESS_ID),
      });
    });
  });

  describe('LoadUserTokenSuccess Action', () => {
    it('should create the action', () => {
      const action = new fromUserToken.LoadUserTokenSuccess(token);

      expect({ ...action }).toEqual({
        type: fromUserToken.LOAD_USER_TOKEN_SUCCESS,
        payload: token,
        meta: entitySuccessMeta(PROCESS_FEATURE, AUTH_USER_PROCESS_ID),
      });
    });
  });

  describe('RefreshUserToken Actions', () => {
    it('should create the action', () => {
      const refreshTokenRequest = {
        userId: 'xxx@xxx.xxx',
        refreshToken: '1234',
      };

      const action = new fromUserToken.RefreshUserToken(refreshTokenRequest);
      expect({ ...action }).toEqual({
        type: fromUserToken.REFRESH_USER_TOKEN,
        payload: refreshTokenRequest,
        meta: entityLoadMeta(PROCESS_FEATURE, AUTH_USER_PROCESS_ID),
      });
    });
  });

  describe('RefreshUserTokenFail Action', () => {
    it('should create the action', () => {
      const error = 'anError';
      const action = new fromUserToken.RefreshUserTokenFail(error);

      expect({ ...action }).toEqual({
        type: fromUserToken.REFRESH_USER_TOKEN_FAIL,
        payload: error,
        meta: entityFailMeta(PROCESS_FEATURE, AUTH_USER_PROCESS_ID),
      });
    });
  });

  describe('LoadUserTokenSuccess Action', () => {
    it('should create the action', () => {
      const action = new fromUserToken.RefreshUserTokenSuccess(token);

      expect({ ...action }).toEqual({
        type: fromUserToken.REFRESH_USER_TOKEN_SUCCESS,
        payload: token,
        meta: entitySuccessMeta(PROCESS_FEATURE, AUTH_USER_PROCESS_ID),
      });
    });
  });
});
