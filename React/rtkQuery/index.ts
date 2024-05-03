import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from 'constants/env';
import { RootState } from 'store';
import { logout } from 'store/slices/user';

import { TAGS } from './tags';
import { userApi } from './user';

let refreshingToken = false;
let refreshTokenPromise = new Promise(() => {});
let refreshTokenPromiseResolver: (value: unknown) => void = () => {};

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState, endpoint }) => {
    const state = getState() as RootState;

    if (state.user.tokens && !headers.get('Authorization')) {
      headers.append(
        'Authorization',
        `Bearer ${
          endpoint === 'refreshToken' ? state.user.tokens.refresh : state.user.tokens.access
        }`,
      );
    }

    return headers;
  },
});

export const rtkQuery = createApi({
  reducerPath: 'rtkReducer',
  endpoints: () => ({}),
  tagTypes: Object.values(TAGS),
  baseQuery: async (args, api, extraOptions) => {
    let response = await baseQuery(args, api, extraOptions);

    if (response.error?.status === 401) {
      if (api.endpoint === 'refreshToken') {
        return response;
      }

      if (refreshingToken) {
        await refreshTokenPromise;

        response = await baseQuery(args, api, extraOptions);
      } else {
        refreshingToken = true;

        refreshTokenPromise = new Promise(resolve => {
          refreshTokenPromiseResolver = resolve;
        });

        const refreshTokenResponse = await api.dispatch(userApi.endpoints.refreshToken.initiate());

        refreshingToken = false;
        refreshTokenPromiseResolver('success');

        if ('error' in refreshTokenResponse) {
          api.dispatch(logout());

          return response;
        }

        response = await baseQuery(args, api, extraOptions);
      }
    }

    return response;
  },
});
