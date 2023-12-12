export const HTTP_CONFIGS = import.meta.env.DEV
  ? {
      mock: true,
      baseURL: 'https://test.example.com',
      transformURL: (url: string) => {
        return '/api/v1' + url;
      },
    }
  : {
      mock: true,
      baseURL: 'https://test.example.com',
      transformURL: (url: string) => {
        return '/api/v1' + url;
      },
    };
