import axios from 'axios';

const service = axios.create({
  baseURL: '/',
  timeout: 50000,
});

service.defaults.headers.common['x-csrf-token'] = 'AUTH_TOKEN';

service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

service.interceptors.response.use(
  (response) => {
    const res = response.data;
    return res;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default service;
