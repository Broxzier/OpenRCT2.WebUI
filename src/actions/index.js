// eslint-disable-next-line
import * as shajs from 'sha.js';
import * as api from '../api';
import { ProfileState } from '../constants/profile';
import { Servers } from '../selectors';
import { SiteConfig } from '../config';

const hashPassword = (password) => {
  let salt = SiteConfig.passwordClientSalt;
  let hash = shajs('sha512');
  hash.update(salt + password);
  return hash.digest('hex');
}

export const fetchNewsItems = (skip, take) => (dispatch, getState) => {
  if (getState().news.isFetching) {
    return Promise.resolve();
  }

  dispatch({
    type: 'FETCH_NEWS_REQUEST',
  });

  return api.fetchNewsItems(skip, take).then(
    response => {
      dispatch({
        type: 'FETCH_NEWS_SUCCESS',
        response: response,
      });
    },
    error => {
      dispatch({
        type: 'FETCH_NEWS_FAILURE',
        message: error.message || 'Something went wrong.',
      });
    }
  );
};

export const fetchServers = () => (dispatch, getState) => {
  if (Servers.getIsFetching(getState().servers)) {
    return Promise.resolve();
  }

  dispatch({
    type: 'FETCH_SERVERS_REQUEST',
  });

  return api.fetchServers().then(
    response => {
      dispatch({
        type: 'FETCH_SERVERS_SUCCESS',
        response: response,
      });
    },
    error => {
      dispatch({
        type: 'FETCH_SERVERS_FAILURE',
        message: error.message || 'Something went wrong.',
      });
    }
  );
};

export const signIn = (username, password) => (dispatch, getState) => {
  let profile = getState().profile;
  if (profile.state === ProfileState.DEFAULT) {
    dispatch({
      type: 'SIGN_IN_REQUEST',
    });
    return api.signIn(username, hashPassword(password))
      .then(response => {
        dispatch({
          type: 'SIGN_IN_SUCCESS',
          response: response,
        });
      })
      .catch(error => {
        dispatch({
          type: 'SIGN_IN_FAILURE',
          message: error.message || 'Something went wrong.',
        });
        throw new Error();
      });
  }
  return Promise.resolve();
}

export const signOut = () => (dispatch, getState) => {
  let profile = getState().profile;
  if (profile.state === ProfileState.SIGNED_IN) {
    dispatch({
      type: 'SIGN_OUT_REQUEST',
    });
    return api.signOut()
      .then(response => {
        dispatch({
          type: 'SIGN_OUT_SUCCESS',
          response: response,
        });
      })
      .catch(error => {
        dispatch({
          type: 'SIGN_OUT_FAILURE',
          message: error.message || 'Something went wrong.',
        });
        throw new Error();
      });
  }
  return Promise.resolve();
}

export const signUp = signUpDetails => (dispatch, getState) => {
  let profile = getState().profile;
  if (profile.state === ProfileState.DEFAULT) {
    // Hash password before sending it across the internet
    signUpDetails = {
      ...signUpDetails,
      password: hashPassword(signUpDetails.password)
    };
    return api.signUp(signUpDetails)
      .then(response => {
        dispatch({
          type: 'SIGN_UP_SUCCESS',
          response: response,
        });
      })
      .catch(error => {
        throw error.message || 'Something went wrong.';
      });
  }
  return Promise.resolve();
}
