const CORS = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: '*',
  credentials: false,
};

export const CONFIG = {
  CORS,
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '7d',
};

export const PAGINATION_QUERY_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
};
