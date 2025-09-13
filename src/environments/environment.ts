export interface ApiConfig {
  baseUrl: string;   // e.g. http://localhost:8080
  basePath: string;  // e.g. /api/v1
  endpoints: {
    auth: {
      login: string;
      logout: string;
      register: string;
      me: string;
    };
  };
}

export const environment: {
  production: boolean;
  api: ApiConfig;
} = {
  production: false,
  api: {
    baseUrl: 'http://localhost:8080',
    basePath: '/api/v1',
    endpoints: {
      auth: {
        login: '/auth/login',
        logout: '/auth/logout',
        register: '/auth/register',
        me: '/auth/me',
      },
    },
  },
} as const;
