// Re-export the shared axios instance under the name `apiClient`
// so resident and owner pages can import from either api.ts or api.client.ts
export { api as apiClient } from './api';
