import { baseApi } from '@/services/baseApi';
import { LoginResponse, User } from '@/types/auth';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, Record<string, string>>({
      query: (credentials) => ({
        url: 'accounts/login/',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<LoginResponse, Record<string, string>>({
      query: (userData) => ({
        url: 'accounts/register/',
        method: 'POST',
        body: userData,
      }),
    }),
    getUserProfile: builder.query<User, void>({
      query: () => 'accounts/me/',
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetUserProfileQuery, useLazyGetUserProfileQuery } = authApi;
