/// <reference types="vite/client" />

declare global {
  interface Window {
    APP_CONFIG?: {
      BASE_API_URL?: string;
    };
  }
  
  const __VITE_BASE_API_URL__: string;
  const __IMAGE_REGISTRY_URL__: string;
}

export {};

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
