import { inject } from 'vitest';

export const accessToken = inject('accessToken');
export const requestId = /^[A-Za-z0-9_-]+$/;
export const id = requestId;
