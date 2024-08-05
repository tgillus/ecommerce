import { request } from 'pactum';
import { inject } from 'vitest';

const apiBaseUrl = inject('apiBaseUrl');

request.setBaseUrl(apiBaseUrl);
request.setDefaultTimeout(10000);
