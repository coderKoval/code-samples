import { rtkQuery } from 'services/rtkQuery';
import { User } from 'types/models';

import { LoginResponse, LoginVariables, RefreshTokenResponse } from './types';

export const userApi = rtkQuery.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    login: builder.mutation<LoginResponse, LoginVariables>({
      query: data => ({
        url: 'oauth2/token',
        method: 'POST',
        body: data,
      }),
    }),
    refreshToken: builder.mutation<RefreshTokenResponse, void>({
      query: () => ({
        url: 'oauth2/token/refresh',
        method: 'POST',
      }),
    }),
    getUser: builder.query<User, void>({
      query: () => 'user/details',
      transformResponse: (value: { first_name: string; last_name: string }) => {
        return {
          firstName: value.first_name,
          lastName: value.last_name,
        };
      },
    }),
  }),
});

export const { useLoginMutation, useGetUserQuery } = userApi;
