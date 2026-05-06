import { HttpScope } from './http-scope';

export const httpScope = new HttpScope();
export const http = httpScope.createHttp();
export const useHttp = httpScope.createHttpHook();
